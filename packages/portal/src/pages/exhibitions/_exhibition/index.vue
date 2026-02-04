<template>
  <div
    data-qa="exhibition page"
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
      <ContentWarningModal
        v-if="contentWarning"
        :title="contentWarning.name"
        :description="contentWarning.description"
        :page-slug="`exhibition/${identifier}`"
      />
      <AuthoredHead
        :title="name"
        :description="headline"
        :hero="hero"
        :context-label="$tc('exhibitions.exhibitions')"
      />
      <b-container
        class="footer-margin"
      >
        <b-row class="justify-content-center">
          <b-col
            cols="12"
            class="col-lg-8 mb-3"
          >
            <article>
              <time
                v-if="datePublished"
                data-qa="date"
                :datetime="datePublished"
                class="font-small font-weight-bold d-block mb-4"
              >
                {{ $t('authored.publishedDate', { date: $d(new Date(datePublished), 'short', $i18n.localeProperties.iso) }) }}
              </time>
              <div class="mb-4 d-flex align-items-center">
                <ShareButton class="mr-4" />
                <ShareSocialModal :media-url="pageMetaOgImage" />
                <ViewCount />
              </div>
              <!-- eslint-disable vue/no-v-html -->
              <div
                data-qa="exhibition text"
                v-html="mainContent"
              />
              <!-- eslint-enable vue/no-v-html -->
            </article>
          </b-col>
        </b-row>
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
        <client-only>
          <b-row
            v-if="hasRelatedCategoryTags"
            data-qa="related category tags"
            class="related-container justify-content-center"
          >
            <b-col
              cols="12"
              class="col-lg-8"
            >
              <RelatedCategoryTags
                :tags="categoriesCollection.items"
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
  import ShareSocialModal from '@/components/share/ShareSocialModal.vue';
  import ShareButton from '@/components/share/ShareButton.vue';
  import ViewCount from '@/components/generic/ViewCount.vue';
  import { useLogEvent } from '@/composables/logEvent.js';
  import exhibitionChapters from '@/mixins/exhibitionChapters';
  import exhibitionLandingPageGraphql from '@/graphql/queries/exhibitionLandingPage.graphql';
  import pageMetaMixin from '@/mixins/pageMeta';

  export default {
    name: 'ExhibitionPage',
    components: {
      AuthoredHead: () => import('@/components/authored/AuthoredHead'),
      BBreadcrumb,
      ClientOnly,
      ContentWarningModal: () => import('@/components/content/ContentWarningModal'),
      EntityBadges: () => import('@/components/entity/EntityBadges'),
      ErrorMessage: () => import('@/components/error/ErrorMessage'),
      LoadingSpinner: () => import('@/components/generic/LoadingSpinner'),
      LinkList: () => import('@/components/generic/LinkList'),
      RelatedCategoryTags: () => import('@/components/related/RelatedCategoryTags'),
      ShareButton,
      ShareSocialModal,
      ThemeBadges: () => import('@/components/theme/ThemeBadges'),
      ViewCount
    },
    mixins: [
      exhibitionChapters,
      pageMetaMixin
    ],
    inject: [
      'canonicalUrl'
    ],
    setup() {
      const { logEvent } = useLogEvent();

      return { logEvent };
    },
    data() {
      return {
        categoriesCollection: null,
        contentWarning: null,
        credits: null,
        datePublished: null,
        description: null,
        genre: null,
        hasPartCollection: null,
        headline: null,
        identifier: null,
        name: null,
        primaryImageOfPage: null,
        relatedLink: null,
        text: null
      };
    },
    async fetch() {
      try {
        const variables = {
          identifier: this.$route.params.exhibition,
          locale: this.$i18n.localeProperties.iso,
          preview: this.$route.query.mode === 'preview'
        };

        const response = await this.$contentful.query(exhibitionLandingPageGraphql, variables);
        const data = response.data;

        if (data.exhibitionPageCollection.items.length === 0) {
          this.$error(404, { scope: 'page' });
          return;
        }

        const page = data.exhibitionPageCollection.items[0];

        for (const key in page) {
          this[key] = page[key];
        }
      } catch (e) {
        this.$error(e, { scope: 'page' });
      }
    },

    computed: {
      breadcrumbs() {
        return [
          { text: this.$t('exhibitions.breadcrumbPrefix', { title: this.name }) }
        ];
      },
      pageMeta() {
        return {
          title: this.name,
          description: this.description,
          ogType: 'article',
          ogImage: this.heroImage,
          ogImageAlt: this.heroImage ? (this.heroImage.description || '') : null
        };
      },
      hasRelatedCategoryTags() {
        return (this.categoriesCollection?.items?.length || 0) > 0;
      },
      hero() {
        return this.primaryImageOfPage || null;
      },
      heroImage() {
        return this.hero?.image || null;
      },
      mainContent() {
        return this.text ? marked.parse(this.text) : null;
      }
    },

    mounted() {
      this.logEvent('view', this.canonicalUrl.withOnlyQuery, this.$session);
    }
  };
</script>
