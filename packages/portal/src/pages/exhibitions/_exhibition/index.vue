<template>
  <div
    data-qa="exhibition page"
    class="page text-page"
  >
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
              {{ $t('authored.publishedDate', { date: $d(new Date(datePublished), 'short') }) }}
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
  import pageMetaMixin from '@/mixins/pageMeta';

  export default {
    name: 'ExhibitionPage',
    components: {
      AuthoredHead: () => import('@/components/authored/AuthoredHead'),
      BBreadcrumb,
      ClientOnly,
      ContentWarningModal: () => import('@/components/content/ContentWarningModal'),
      EntityBadges: () => import('@/components/entity/EntityBadges'),
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
    asyncData({ params, query, error, app, redirect }) {
      if (params.exhibition === undefined) {
        redirect(app.localePath({ name: 'exhibitions' }));
      }

      const variables = {
        identifier: params.exhibition,
        locale: app.i18n.localeProperties.iso,
        preview: query.mode === 'preview'
      };

      return app.$contentful.query('exhibitionLandingPage', variables)
        .then(response => response.data.data)
        .then(data => {
          if (data.exhibitionPageCollection.items.length === 0) {
            error({ statusCode: 404, message: app.i18n.t('messages.notFound') });
            return null;
          }

          return data.exhibitionPageCollection.items[0];
        })
        .catch((e) => {
          error({ statusCode: 500, message: e.toString() });
        });
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
