<template>
  <div
    data-qa="exhibition chapter"
    class="text-page white-page "
  >
    <b-breadcrumb
      :items="breadcrumbs"
      class="mb-5"
    />
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
            <ShareSocialModal :media-url="pageMetaOgImage" />
            <div class="authored-section">
              <ContentSection
                v-for="(section, index) in (page?.hasPartCollection?.items || [])"
                :key="index"
                :section="section"
                :rich-text-is-card="false"
              />
            </div>
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
  import { BBreadcrumb } from 'bootstrap-vue';
  import ClientOnly from 'vue-client-only';
  import ContentSection from '@/components/content/ContentSection';
  import ShareSocialModal from '@/components/share/ShareSocialModal.vue';
  import ShareButton from '@/components/share/ShareButton.vue';
  import exhibitionChapters from '@/mixins/exhibitionChapters';
  import pageMetaMixin from '@/mixins/pageMeta';
  import logEventMixin from '@/mixins/logEvent';

  export default {
    name: 'ExhibitionChapterPage',

    components: {
      BBreadcrumb,
      ContentSection,
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
    asyncData({ params, query, error, app }) {
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
      breadcrumbs() {
        return [
          {
            text: this.$t('exhibitions.breadcrumbPrefix', { title: this.exhibitionTitle }),
            to: this.localePath({
              name: 'exhibitions-exhibition',
              params: {
                exhibition: this.exhibitionIdentifier
              }
            })
          },
          {
            text: this.page.name,
            active: true
          }
        ];
      },
      pageMeta() {
        return {
          title: this.page.name,
          description: this.page.description,
          ogType: 'article',
          ogImage: this.heroImage,
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
