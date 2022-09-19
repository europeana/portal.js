<template>
  <div
    data-qa="exhibition page"
    class="text-page white-page figure-attribution"
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
    <b-container>
      <b-row class="justify-content-center">
        <b-col
          cols="12"
          class="col-lg-8"
        >
          <article>
            <ShareButton class="mb-4" />
            <SocialShareModal :media-url="hero.image.url" />
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
        class="justify-content-center mt-3"
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
        v-if="categoriesCollection && categoriesCollection.items"
        class="justify-content-center"
      >
        <b-col
          cols="12"
          class="mt-4 col-lg-8"
        >
          <RelatedCategoryTags
            :tags="categoriesCollection.items"
          />
        </b-col>
      </b-row>
      <b-row
        v-if="relatedLink"
        class="justify-content-center"
      >
        <b-col
          cols="12"
          class="mt-4 col-lg-8"
        >
          <client-only>
            <RelatedCollections
              :entity-uris="relatedLink"
              :title="$t('youMightAlsoLike')"
            />
          </client-only>
        </b-col>
      </b-row>
      <b-row class="footer-margin" />
    </b-container>
  </div>
</template>

<script>
  import ClientOnly from 'vue-client-only';
  import { marked } from 'marked';
  import SocialShareModal from '../../../components/sharing/SocialShareModal.vue';
  import ShareButton from '../../../components/sharing/ShareButton.vue';
  import exhibitionChapters from '../../../mixins/exhibitionChapters';

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
      exhibitionChapters
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
    head() {
      return {
        title: this.$pageHeadTitle(this.name),
        meta: [
          { hid: 'title', name: 'title', content: this.name },
          { hid: 'og:title', property: 'og:title', content: this.name },
          { hid: 'og:type', property: 'og:type', content: 'article' }
        ].concat(this.description ? [
          { hid: 'description', name: 'description', content: this.description },
          { hid: 'og:description', property: 'og:description', content: this.description }
        ] : []).concat(this.heroImage ? [
          { hid: 'og:image', property: 'og:image', content: this.optimisedImageUrl },
          { hid: 'og:image:alt', property: 'og:image:alt', content: this.heroImage.description || '' }
        ] : [])
      };
    },
    computed: {
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
