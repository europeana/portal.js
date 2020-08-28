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
        class="bg-white mb-3 px-0"
      >
        <ItemHero
          :identifier="identifier"
          :media="media"
          :edm-rights="edmRights"
        />
      </b-container>
      <b-container>
        <b-row class="mb-3 justify-content-center">
          <b-col
            cols="12"
            class="col-lg-10"
          >
            <SummaryInfo
              :description="descriptionInCurrentLanguage"
              :titles="titlesInCurrentLanguage"
            />
          </b-col>
        </b-row>
        <b-row
          v-if="relatedEntities && relatedEntities.length > 0"
          class="justify-content-center"
        >
          <b-col
            cols="12"
            class="col-lg-10"
          >
            <RelatedCollections
              :title="$t('collectionsYouMightLike')"
              :related-collections="relatedEntities"
            />
          </b-col>
        </b-row>
        <b-row
          v-else
          class="mb-3"
        />
        <b-row class="mb-0 justify-content-center">
          <b-col
            cols="12"
            class="col-lg-10"
          >
            <MetadataBox
              :all-metadata="allMetaData"
              :core-metadata="coreFields"
              :transcribing-annotations="transcribingAnnotations"
            />
          </b-col>
        </b-row>
        <b-row
          v-if="similarItems.length > 0"
          class="mt-3 mb-0 justify-content-center"
        >
          <b-col
            cols="12"
            class="col-lg-10"
          >
            <h2
              class="related-heading text-uppercase mb-2"
            >
              {{ $t('record.exploreMore') }}
            </h2>
            <ItemPreviewCardGroup
              v-model="similarItems"
              view="explore"
              class="mb-0"
            />
          </b-col>
        </b-row>
        <b-row class="footer-margin" />
      </b-container>
    </template>
  </div>
</template>

<script>
  import axios from 'axios';
  import { mapGetters } from 'vuex';

  import MetadataBox from '../../components/item/MetadataBox';

  import { getRecord, similarItemsQuery } from '../../plugins/europeana/record';
  import { search } from '../../plugins/europeana/search';

  import { langMapValueForLocale } from  '../../plugins/europeana/utils';
  import { findEntities } from '../../plugins/europeana/entity';
  import { search as searchAnnotations } from '../../plugins/europeana/annotation';
  import isEmpty from 'lodash/isEmpty';

  export default {
    components: {
      ItemHero: () => import('../../components/item/ItemHero'),
      AlertMessage: () => import('../../components/generic/AlertMessage'),
      ItemPreviewCardGroup: () => import('../../components/item/ItemPreviewCardGroup'),
      RelatedCollections: () => import('../../components/generic/RelatedCollections'),
      SummaryInfo: () => import('../../components/item/SummaryInfo'),
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
          this.similarItems = similar.items;
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
      edmRights() {
        return this.fields.edmRights ? this.fields.edmRights.def[0] : '';
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
        if (isEmpty(this.descriptionInCurrentLanguage)) return '';
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
        return Boolean(Number(process.env.ENABLE_LINKS_TO_CLASSIC));
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

        if (this.$auth.loggedIn) {
          return this.$recommendations.recommend('record', this.identifier)
            .then(recommendResponse => recommendResponse);
        }

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
          .then(response => response)
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
  .related-collections {
    margin-top: -0.5rem;
    margin-bottom: 2rem;
    padding: 0;
  }
  .footer-margin {
    margin-bottom: 7rem;
  }
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
