<template>
  <div
    data-qa="exhibition chapter"
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
    </template>
  </div>
</template>

<script>
  import { BBreadcrumb } from 'bootstrap-vue';
  import ClientOnly from 'vue-client-only';
  import ContentSection from '@/components/content/ContentSection';
  import ShareSocialModal from '@/components/share/ShareSocialModal.vue';
  import ShareButton from '@/components/share/ShareButton.vue';
  import { useLogEvent } from '@/composables/logEvent.js';
  import exhibitionChapterPageGraphql from '@/graphql/queries/exhibitionChapterPage.graphql';
  import exhibitionChapters from '@/mixins/exhibitionChapters';
  import pageMetaMixin from '@/mixins/pageMeta';

  export default {
    name: 'ExhibitionChapterPage',

    components: {
      AuthoredHead: () => import('@/components/authored/AuthoredHead'),
      BBreadcrumb,
      ClientOnly,
      ContentSection,
      ContentWarningModal: () => import('@/components/content/ContentWarningModal'),
      EntityBadges: () => import('@/components/entity/EntityBadges'),
      ErrorMessage: () => import('@/components/error/ErrorMessage'),
      LoadingSpinner: () => import('@/components/generic/LoadingSpinner'),
      LinkList: () => import('@/components/generic/LinkList'),
      RelatedCategoryTags: () => import('@/components/related/RelatedCategoryTags'),
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
        chapters: null,
        credits: null,
        exhibitionIdentifier: this.$route.params.exhibition,
        exhibitionTitle: null,
        exhibitionContentWarning: null,
        relatedLink: null,
        genre: null,
        page: {}
      };
    },
    async fetch() {
      try {
        const variables = {
          identifier: this.$route.params.exhibition,
          locale: this.$i18n.localeProperties.iso,
          preview: this.$route.query.mode === 'preview'
        };

        const response = await this.$contentful.query(exhibitionChapterPageGraphql, variables);
        const data = response.data;

        let chapter;
        let exhibition;

        if (data.exhibitionPageCollection.total === 1) {
          exhibition = data.exhibitionPageCollection.items[0];
          chapter = exhibition.hasPartCollection.items.find((item) => item.identifier === this.$route.params.chapter);
        }

        if (!chapter || !exhibition) {
          this.$error(404, { scope: 'page' });
          return;
        }

        this.chapters = exhibition.hasPartCollection.items;
        this.credits = exhibition.credits;
        this.exhibitionTitle = exhibition.name;
        this.exhibitionContentWarning = exhibition.contentWarning;
        this.relatedLink = exhibition.relatedLink;
        this.genre = exhibition.genre;
        this.page = chapter;
      } catch (e) {
        this.$error(e, { scope: 'page' });
      }
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
      this.logEvent('view', `${this.$config.app.baseUrl}/exhibitions/${this.exhibitionIdentifier}`, this.$session);
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
