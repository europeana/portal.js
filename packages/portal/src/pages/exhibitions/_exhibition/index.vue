<template>
  <div
    data-qa="exhibition page"
    class="text-page white-page "
  >
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
            <ShareButton class="mb-4" />
            <SocialShareModal :media-url="heroImage && heroImage.url" />
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
            <RelatedCollections
              :entity-uris="relatedLink"
            />
          </b-col>
        </b-row>
      </client-only>
    </b-container>
  </div>
</template>

<script>
  import ClientOnly from 'vue-client-only';
  import { marked } from 'marked';
  import SocialShareModal from '../../../components/sharing/SocialShareModal.vue';
  import ShareButton from '../../../components/sharing/ShareButton.vue';
  import exhibitionChapters from '../../../mixins/exhibitionChapters';
  import pageMetaMixin from '@/mixins/pageMeta';

  export default {
    name: 'ExhibitionPage',
    components: {
      ClientOnly,
      LinkList: () => import('../../../components/generic/LinkList'),
      ShareButton,
      SocialShareModal,
      AuthoredHead: () => import('../../../components/authored/AuthoredHead'),
      ContentWarningModal: () => import('@/components/generic/ContentWarningModal'),
      RelatedCategoryTags: () => import('@/components/related/RelatedCategoryTags'),
      RelatedCollections: () => import('@/components/related/RelatedCollections')
    },
    mixins: [
      exhibitionChapters,
      pageMetaMixin
    ],
    beforeRouteLeave(to, from, next) {
      this.$store.commit('breadcrumb/clearBreadcrumb');
      next();
    },
    asyncData({ params, query, error, app, store, redirect }) {
      if (params.exhibition === undefined) {
        redirect(app.$path({ name: 'exhibitions' }));
      }

      const variables = {
        identifier: params.exhibition,
        locale: app.i18n.isoLocale(),
        preview: query.mode === 'preview'
      };

      return app.$contentful.query('exhibitionLandingPage', variables)
        .then(response => response.data.data)
        .then(data => {
          if (data.exhibitionPageCollection.items.length === 0) {
            error({ statusCode: 404, message: app.i18n.t('messages.notFound') });
            return null;
          }

          store.commit('breadcrumb/setBreadcrumbs', [
            {
              text: app.i18n.tc('exhibitions.exhibitions', 2),
              to: app.$path({ name: 'exhibitions' })
            },
            {
              text: data.exhibitionPageCollection.items[0].name,
              active: true
            }
          ]);
          return data.exhibitionPageCollection.items[0];
        })
        .catch((e) => {
          error({ statusCode: 500, message: e.toString() });
        });
    },
    computed: {
      pageMeta() {
        return {
          title: this.name,
          description: this.description,
          ogType: 'article',
          ogImage: this.heroImage && this.optimisedImageUrl,
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
      },
      optimisedImageUrl() {
        return this.$contentful.assets.optimisedSrc(
          this.heroImage,
          { w: 800, h: 800 }
        );
      }
    }
  };
</script>

<style lang="scss" scoped>
  ::v-deep .related-collections {
    &.container {
      padding: 0;
    }

    .badge-pill {
      margin-top: 0.25rem;
      margin-right: 0.5rem;
    }
  }

</style>
