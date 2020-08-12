<template>
  <div>
    <NotificationBanner
      v-if="redirectNotificationsEnabled"
      :notification-url="notificationUrl"
      :notification-text="$t('linksToClassic.record.text')"
      :notification-link-text="$t('linksToClassic.record.linkText')"
    />
    <b-container v-if="error">
      <AlertMessage
        :error="error"
      />
    </b-container>
    <template
      v-else
      data-qa="item page"
    >
      <b-container
        fluid
        class="bg-white mb-3"
      >
        <!-- TODO: add swiper here
          Swiper also includes download, share, right statement
          Potential useful data:

          :url="selectedMedia.about"
          :europeana-identifier="identifier"
          :use-proxy="useProxy"
          :rights-statement="rightsStatement"
          :data-provider-name="dataProvider.values[0]"
          :data-provider-lang="dataProvider.code"
          :is-shown-at="isShownAt"

          Keep/reuse client-only?
      -->
        <client-only />
      </b-container>
      <b-container>
        <b-row class="mb-3">
          <b-col>
            <!-- TODO: add new title + description box
              Useful data:

              titlesInCurrentLanguage
              descriptionInCurrentLanguage
            -->
          </b-col>
        </b-row>
        <b-row class="mb-3">
          <b-col>
            <h2
              v-if="relatedEntities && relatedEntities.length > 0"
              class="related-heading text-uppercase"
            >
              {{ $t('contentYouMightLike') }}
            </h2>
            <!-- TODO: related content
              Useful data:

              :entities="relatedEntities"
              data-qa="related entities"
            -->
          </b-col>
        </b-row>
        <b-row class="mb-3">
          <b-col>
            <MetadataBox
              :all-metadata="allMetaData"
              :core-metadata="coreFields"
              :transcribing-annotations="transcribingAnnotations"
            />
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <!-- TODO: update similar items,
              they are currently cards within a card, that shouldn't be like that
              fix styling/structure in component itself
            -->
            <section
              v-if="similarItems.length > 0"
            >
              <h2
                class="related-heading text-uppercase"
              >
                {{ $t('record.similarItems') }}
              </h2> <!-- TODO: introduce new heading "Explore more" -->
              <SimilarItems
                :items="similarItems"
                class="mb-3"
              />
            </section>
          </b-col>
        </b-row>
      </b-container>
    </template>
  </div>
</template>

<script>
  import axios from 'axios';
  import { mapGetters } from 'vuex';

  import ClientOnly from 'vue-client-only';
  import MetadataBox from '../../components/item/MetadataBox';

  import { getRecord, similarItemsQuery } from '../../plugins/europeana/record';
  import { search } from '../../plugins/europeana/search';

  import { langMapValueForLocale } from  '../../plugins/europeana/utils';
  import { findEntities } from '../../plugins/europeana/entity';
  import { search as searchAnnotations } from '../../plugins/europeana/annotation';

  export default {
    components: {
      AlertMessage: () => import('../../components/generic/AlertMessage'),
      ClientOnly,
      SimilarItems: () => import('../../components/item/SimilarItems'),
      MetadataBox,
      NotificationBanner: () => import('../../components/generic/NotificationBanner')
    },

    fetch() {
      const annotationSearchParams = {
        query: `target_record_id:"${this.identifier}"`,
        profile: 'dereference'
      };
      axios.all([
        searchAnnotations(annotationSearchParams),
        findEntities(this.europeanaEntityUris),
        this.getSimilarItems()
      ])
        .then(axios.spread((annotations, entities, similar) => {
          this.annotations = annotations;
          this.transcribingAnnotations = this.annotationsByMotivation('transcribing');
          this.taggingAnnotations = this.annotationsByMotivation('tagging');
          this.relatedEntities = entities;
          this.similarItems = similar.results;
        }));
    },

    fetchOnServer: false,

    asyncData({ params, res, query }) {
      return getRecord(`/${params.pathMatch}`, { origin: query.recordApi })
        .then((result) => {
          return result.record;
        })
        .catch((error) => {
          if (typeof res !== 'undefined') {
            res.statusCode = (typeof error.statusCode === 'undefined') ? 500 : error.statusCode;
          }
          return { error: error.message };
        });
    },

    data() {
      return {
        agents: null,
        altTitle: null,
        cardGridClass: null,
        concepts: null,
        coreFields: null,
        description: null,
        error: null,
        fields: null,
        identifier: null,
        isShownAt: null,
        media: [],
        relatedEntities: [],
        similarItems: [],
        annotations: [],
        taggingAnnotations: [],
        transcribingAnnotations: [],
        title: null,
        type: null,
        useProxy: true
      };
    },

    computed: {
      ...mapGetters({
        apiConfig: 'apis/config'
      }),
      keywords() {
        // Convert collection of annotations' prefLabels into a single langMap
        return this.taggingAnnotations.reduce((memo, annotation) => {
          for (const lang in annotation.body.prefLabel) {
            if (!memo[lang]) memo[lang] = [];
            memo[lang] = memo[lang].concat(annotation.body.prefLabel[lang]);
          }
          return memo;
        }, {});
      },
      fieldsAndKeywords() {
        return { ...this.fields, ...{ keywords: this.keywords } };
      },
      allMetaData() {
        return { ...this.coreFields, ...this.fieldsAndKeywords };
      },
      europeanaAgents() {
        return (this.agents || []).filter((agent) => agent.about.startsWith(`${this.apiConfig.data.origin}/agent/`));
      },
      europeanaConcepts() {
        return (this.concepts || []).filter((concept) => concept.about.startsWith(`${this.apiConfig.data.origin}/concept/`));
      },
      europeanaEntityUris() {
        const entities = this.europeanaConcepts.concat(this.europeanaAgents);
        return entities.map((entity) => entity.about).slice(0, 5);
      },
      titlesInCurrentLanguage() {
        let titles = [];

        const mainTitle = this.title ? langMapValueForLocale(this.title, this.$i18n.locale) : '';
        const alternativeTitle = this.altTitle ? langMapValueForLocale(this.altTitle, this.$i18n.locale) : '';

        const allTitles = [].concat(mainTitle, alternativeTitle).filter(Boolean);
        for (let title of allTitles) {
          for (let value of title.values) {
            titles.push({ 'code': title.code, value });
          }
        }

        return titles;
      },
      descriptionInCurrentLanguage() {
        if (!this.description) {
          return false;
        }
        return langMapValueForLocale(this.description, this.$i18n.locale);
      },
      metaTitle() {
        return this.titlesInCurrentLanguage[0] ? this.titlesInCurrentLanguage[0].value : this.$t('record.record');
      },
      metaDescription() {
        if (!this.descriptionInCurrentLanguage) return '';
        return this.descriptionInCurrentLanguage.values[0] ? this.descriptionInCurrentLanguage.values[0] : '';
      },
      dataProvider() {
        const edmDataProvider = langMapValueForLocale(this.coreFields.edmDataProvider, this.$i18n.locale);

        if (edmDataProvider.values[0].about) {
          return edmDataProvider.values[0];
        }

        return edmDataProvider;
      },
      notificationUrl() {
        return `https://classic.europeana.eu/portal/${this.$i18n.locale}/record${this.identifier}.html?utm_source=new-website&utm_medium=button`;
      },
      redirectNotificationsEnabled() {
        return this.$config.app.features.linksToClassic;
      }
    },

    mounted() {
      if (process.browser) {
        this.$gtm.push({
          itemCountry: langMapValueForLocale(this.fields.edmCountry, 'en').values[0],
          itemDataProvider: langMapValueForLocale(this.coreFields.edmDataProvider, 'en').values[0],
          itemProvider: langMapValueForLocale(this.fields.edmProvider, 'en').values[0],
          itemRights: langMapValueForLocale(this.fields.edmRights, 'en').values[0]
        });
      }

      // TODO: remove or is this useful for the new swiper/action?
      window.addEventListener('message', (msg) => {
        if (msg.data.event === 'updateDownloadLink') {
          this.useProxy = (this.media.some((item) => item.about === msg.data.id));
          this.selectedMedia.about = msg.data.id;
        }
      });
    },

    methods: {
      annotationsByMotivation(motivation) {
        return this.annotations.filter(annotation => annotation.motivation === motivation);
      },

      getSimilarItems() {
        const noSimilarItems = { results: [] };
        if (this.error) return noSimilarItems;

        const dataSimilarItems = {
          dcSubject: this.getSimilarItemsData(this.coreFields.dcSubject),
          dcType: this.getSimilarItemsData(this.title),
          dcCreator: this.getSimilarItemsData(this.coreFields.dcCreator),
          edmDataProvider: this.getSimilarItemsData(this.fields.edmDataProvider)
        };

        return search({
          query: similarItemsQuery(this.identifier, dataSimilarItems),
          rows: 4,
          profile: 'minimal',
          facet: ''
        }, {
          origin: this.$route.query.recordApi
        })
          .catch(() => {
            return noSimilarItems;
          });
      },

      getSimilarItemsData(value) {
        if (!value) return;

        const data = langMapValueForLocale(value, this.$i18n.locale).values;
        if (!data) return;

        return data.filter(item => typeof item === 'string');
      }
    },

    head() {
      return {
        title: this.metaTitle,
        meta: [
          { hid: 'title', name: 'title', content: this.metaTitle },
          { hid: 'description', name: 'description', content: this.metaDescription },
          { hid: 'og:title', property: 'og:title', content: this.metaTitle },
          { hid: 'og:description', property: 'og:description', content: this.metaDescription },
          { hid: 'og:image', property: 'og:image', content: this.media[0].src ? this.media[0].src : '' },
          { hid: 'og:type', property: 'og:type', content: 'article' }
        ]
      };
    },

    beforeRouteLeave(to, from, next) {
      this.$gtm.push({
        itemCountry: undefined,
        itemDataProvider: undefined,
        itemProvider: undefined,
        itemRights: undefined
      });
      next();
    }
  };
</script>

<style scoped>
  /* TODO: fix styling in/for MetadataBox component itself */
  /deep/ .card.rounded-0 {
    border-radius: 0.25rem !important;
  }

  /deep/ .card-header-tabs {
    border-radius: 0.25rem 0.25rem 0 0;
  }

  /deep/ .card-header-tabs .nav-link,
  /deep/ .card-header-tabs .nav-link:hover {
    border-radius: 0.25rem 0 0 0;
  }
</style>
