<template>
  <div
    data-qa="exhibition credits page"
    class="page text-page"
  >
    <LoadingSpinner
      v-if="$fetchState.pending"
      class="flex-md-row py-4 text-center"
    />
    <ErrorMessage
      v-else-if="$fetchState.error"
      data-qa="error message container"
      :error="$fetchState.error"
    />
    <template v-else>
      <b-breadcrumb
        :items="breadcrumbs"
      />
      <!-- TODO: use the AuthoredHead component here, so it matches the exhibition chapters -->
      <b-container
        class="footer-margin"
      >
        <b-row class="justify-content-center">
          <b-col
            cols="12"
            class="col-lg-8 mb-4"
          >
            <div
              class="context-label"
            >
              {{ $tc('exhibitions.exhibitions', 1) }}
            </div>
            <h2
              v-if="exhibitionTitle"
              class="subtitle"
            >
              {{ exhibitionTitle }}
            </h2>
            <h1>{{ $t('exhibitions.credits') }}</h1>
          </b-col>
        </b-row>
        <b-row class="justify-content-center">
          <b-col
            cols="12"
            class="col-lg-8 mb-3"
          >
            <article>
              <ShareButton class="mb-4" />
              <ShareSocialModal />
              <!-- eslint-disable vue/no-v-html -->
              <div
                data-qa="credits text"
                v-html="htmlCredits"
              />
              <!-- eslint-enable vue/no-v-html -->
            </article>
          </b-col>
        </b-row>
        <client-only>
          <b-row
            v-if="hasPartCollection"
            class="justify-content-center"
          >
            <b-col
              cols="12"
              class="mt-3 col-lg-8"
            >
              <LinkList
                :items="chapterPagesToLinkListItems(hasPartCollection.items, identifier)"
                :title="$t('exhibitions.chapters')"
              />
            </b-col>
          </b-row>
          <b-row
            v-if="relatedLink"
            class="related-container justify-content-center"
          >
            <b-col
              cols="12"
              class="col-lg-8"
            >
              <EntityBadges
                :entity-uris="relatedLink"
              />
            </b-col>
          </b-row>
          <b-row
            v-if="genre"
            class="related-container justify-content-center"
          >
            <b-col
              cols="12"
              class="col-lg-8"
            >
              <ThemeBadges
                :themes-identifiers="genre"
              />
            </b-col>
          </b-row>
        </client-only>
      </b-container>
    </template>
  </div>
</template>

<script>
  import { BBreadcrumb } from 'bootstrap-vue';
  import ClientOnly from 'vue-client-only';
  import { marked } from 'marked';

  import ShareSocialModal from '../../../components/share/ShareSocialModal.vue';
  import ShareButton from '../../../components/share/ShareButton.vue';
  import { useLogEvent } from '@/composables/logEvent.js';
  import exhibitionChapters from '../../../mixins/exhibitionChapters';
  import pageMetaMixin from '@/mixins/pageMeta';

  export default {
    name: 'ExhibitionCreditsPage',
    components: {
      BBreadcrumb,
      ClientOnly,
      EntityBadges: () => import('@/components/entity/EntityBadges'),
      ErrorMessage: () => import('@/components/error/ErrorMessage'),
      LoadingSpinner: () => import('@/components/generic/LoadingSpinner'),
      LinkList: () => import('../../../components/generic/LinkList'),
      ShareButton,
      ShareSocialModal,
      ThemeBadges: () => import('@/components/theme/ThemeBadges')
    },
    mixins: [
      exhibitionChapters,
      pageMetaMixin
    ],
    setup() {
      const { logEvent } = useLogEvent();
      return { logEvent };
    },
    data() {
      return {
        name: null,
        identifier: null,
        credits: '',
        relatedLink: null,
        hasPartCollection: null,
        genre: null
      };
    },
    async fetch() {
      try {
        const variables = {
          identifier: this.$route.params.exhibition,
          locale: this.$i18n.localeProperties.iso,
          preview: this.$route.query.mode === 'preview'
        };

        const response = await this.$contentful.query('exhibitionCreditsPage', variables);
        const data = response.data.data;

        if (data.exhibitionPageCollection.items.length === 0) {
          this.$error(404, { scope: 'page' });
          return;
        }

        const exhibition = data.exhibitionPageCollection.items[0];

        this.name = exhibition.name;
        this.identifier = exhibition.identifier;
        this.credits = exhibition.credits;
        this.relatedLink = exhibition.relatedLink;
        this.hasPartCollection = exhibition.hasPartCollection;
        this.genre = exhibition.genre;
      } catch (e) {
        this.$error(e, { scope: 'page' });
      }
    },

    computed: {
      breadcrumbs() {
        return [
          {
            text: this.$t('exhibitions.breadcrumbPrefix', { title: this.exhibitionTitle }),
            to: this.localePath({ name: 'exhibitions-exhibition', params: { exhibition: this.identifier } })
          },
          {
            text: this.$t('exhibitions.credits'),
            active: true
          }
        ];
      },
      pageMeta() {
        return {
          title: `${this.name} - ${this.$t('exhibitions.credits')}`,
          ogType: 'article'
        };
      },
      htmlCredits() {
        if (this.credits === undefined) {
          return false;
        }
        return marked.parse(this.credits);
      },
      exhibitionTitle() {
        return this.name;
      }
    },

    mounted() {
      this.logEvent('view', `${this.$config.app.baseUrl}/exhibitions/${this.identifier}`, this.$session);
    }
  };
</script>

<style lang="scss" scoped>
  ::v-deep img {
    display: block;
    margin: 1rem 0;
  }
</style>
