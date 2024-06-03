<template>
  <div
    data-qa="exhibition chapter"
    class="text-page white-page "
  >
    <ContentWarningModal
      v-if="exhibitionContentWarning"
      :title="exhibitionContentWarning.name"
      :description="exhibitionContentWarning.description"
      :page-slug="`exhibition/${exhibitionIdentifier}`"
    />
    <AuthoredHead
      :title="page.name"
      :exhibition-title="exhibitionTitle"
      :description="page.headline"
      :hero="hero"
      :context-label="$tc('exhibitions.exhibitions', 1)"
    />
    <b-container
      class="footer-margin"
    >
      <b-row>
        <b-col
          cols="12"
          class="col-lg-8"
        >
          <h1
            v-if="!hero"
            data-qa="exhibition chapter title"
          >
            {{ page.name }}
          </h1>
        </b-col>
      </b-row>
      <b-row class="justify-content-center">
        <b-col
          cols="12"
          class="col-lg-8"
        >
          <article>
            <ShareButton class="mb-4" />
            <ShareSocialModal :media-url="optimisedImageUrl" />
            <BrowseSections
              v-if="page"
              :sections="page.hasPartCollection.items"
              :rich-text-is-card="false"
              class="authored-section"
            />
          </article>
        </b-col>
      </b-row>
      <client-only>
        <b-row
          v-if="chapters"
          class="justify-content-center"
        >
          <b-col
            cols="12"
            class="mt-3 col-lg-8"
          >
            <LinkList
              :items="chapterPagesToLinkListItems(chapters, exhibitionIdentifier)"
              :title="$t('exhibitions.chapters')"
            />
          </b-col>
        </b-row>
        <b-row
          v-if="hasRelatedCategoryTags"
          class="related-container justify-content-center"
        >
          <b-col
            cols="12"
            class="col-lg-8"
          >
            <RelatedCategoryTags
              :tags="page.categoriesCollection.items"
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
  </div>
</template>

<script>
  import ClientOnly from 'vue-client-only';
  import BrowseSections from '@/components/browse/BrowseSections';
  import ShareSocialModal from '@/components/share/ShareSocialModal.vue';
  import ShareButton from '@/components/share/ShareButton.vue';
  import exhibitionChapters from '@/mixins/exhibitionChapters';
  import pageMetaMixin from '@/mixins/pageMeta';
  import logEventMixin from '@/mixins/logEvent';
  import { optimisedContentfulImageUrl } from '@/utils/contentful/assets.js';

  export default {
    name: 'ExhibitionChapterPage',

    components: {
      BrowseSections,
      ClientOnly,
      ShareButton,
      ShareSocialModal,
      AuthoredHead: () => import('@/components/authored/AuthoredHead'),
      LinkList: () => import('@/components/generic/LinkList'),
      ContentWarningModal: () => import('@/components/content/ContentWarningModal'),
      RelatedCategoryTags: () => import('@/components/related/RelatedCategoryTags'),
      EntityBadges: () => import('@/components/entity/EntityBadges'),
      ThemeBadges: () => import('@/components/theme/ThemeBadges')
    },
    mixins: [
      exhibitionChapters,
      logEventMixin,
      pageMetaMixin
    ],
    beforeRouteLeave(to, from, next) {
      this.$store.commit('breadcrumb/clearBreadcrumb');
      next();
    },
    asyncData({ params, query, error, app, store }) {
      const variables = {
        identifier: params.exhibition,
        locale: app.i18n.localeProperties.iso,
        preview: query.mode === 'preview'
      };

      return app.$contentful.query('exhibitionChapterPage', variables)
        .then(response => response.data.data)
        .then(data => {
          let chapter;
          let exhibition;

          if (data.exhibitionPageCollection.total === 1) {
            exhibition = data.exhibitionPageCollection.items[0];
            chapter = exhibition.hasPartCollection.items.find(item => item.identifier === params.chapter);
          }

          if (!chapter || !exhibition) {
            error({ statusCode: 404, message: app.i18n.t('messages.notFound') });
            return {};
          }

          store.commit('breadcrumb/setBreadcrumbs', [
            {
              text: app.i18n.tc('exhibitions.exhibitions', 2),
              to: app.localePath({ name: 'exhibitions' })
            },
            {
              text: exhibition.name,
              to: app.localePath({
                name: 'exhibitions-exhibition',
                params: {
                  exhibition: exhibition.identifier
                }
              })
            },
            {
              text: chapter.name,
              active: true
            }
          ]);
          return {
            chapters: exhibition.hasPartCollection.items,
            credits: exhibition.credits,
            exhibitionIdentifier: params.exhibition,
            exhibitionTitle: exhibition.name,
            exhibitionContentWarning: exhibition.contentWarning,
            relatedLink: exhibition.relatedLink,
            genre: exhibition.genre,
            page: chapter
          };
        })
        .catch((e) => {
          error({ statusCode: 500, message: e.toString() });
        });
    },

    computed: {
      pageMeta() {
        return {
          title: this.page.name,
          description: this.page.description,
          ogType: 'article',
          ogImage: this.heroImage && this.optimisedImageUrl,
          ogImageAlt: this.heroImage ? (this.heroImage.description || '') : null
        };
      },
      hasRelatedCategoryTags() {
        return (this.page?.categoriesCollection?.items?.length || 0) > 0;
      },
      chapterNavigation() {
        return this.chapters.map((chapter) => {
          return {
            identifier: chapter.identifier, name: chapter.name, url: this.chapterUrl(chapter.identifier)
          };
        });
      },
      hero() {
        return this.page.primaryImageOfPage || null;
      },
      heroImage() {
        return this.hero?.image || null;
      },
      optimisedImageUrl() {
        return optimisedContentfulImageUrl(this.heroImage, {
          params: { w: 800, h: 800 }
        });
      }
    },

    mounted() {
      this.logEvent('view', `${this.$config.app.baseUrl}/exhibitions/${this.exhibitionIdentifier}`);
    },

    methods: {
      chapterUrl(identifier) {
        return this.localePath({
          name: 'exhibitions-exhibition-chapter',
          params: {
            exhibition: this.exhibitionIdentifier, chapter: identifier
          }
        });
      }
    }
  };
</script>
