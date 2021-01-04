<template>
  <div
    data-qa="static page"
    class="text-page figure-attribution"
  >
    <AuthoredHead
      :title="name"
      :description="description"
      :hero="hero"
    />
    <b-container>
      <b-row class="justify-content-center">
        <b-col
          cols="12"
          class="col-lg-8"
        >
          <article>
            <ShareButton class="mb-4" />
            <SocialShareModal :media-url="hero ? hero.image.url : null" />
            <BrowseSections
              :sections="hasPartCollection.items"
              :rich-text-is-card="false"
              class="authored-section"
              data-qa="blog-sections"
            />
          </article>
        </b-col>
      </b-row>
      <b-row
        v-if="relatedLinks"
        class="justify-content-center mt-3"
      >
        <b-col
          cols="12"
          class="mt-3 col-lg-8"
        >
          <Chapters
            :title="relatedLinks.name"
            :chapters="relatedLinks.links.items"
          />
        </b-col>
      </b-row>
      <b-row class="footer-margin" />
    </b-container>
  </div>
</template>

<script>
  import SocialShareModal from '../../components/sharing/SocialShareModal.vue';
  import ShareButton from '../../components/sharing/ShareButton.vue';
  import BrowseSections from '../../components/browse/BrowseSections';
  import Chapters from '../../components/generic/Chapters';

  export default {
    components: {
      AuthoredHead: () => import('../../components/authored/AuthoredHead'),
      SocialShareModal,
      ShareButton,
      BrowseSections,
      Chapters
    },

    asyncData({ params, query, error, app }) {
      const variables = {
        identifier: params.pathMatch,
        locale: app.i18n.isoLocale(),
        preview: query.mode === 'preview'
      };

      return app.$contentful.query('staticPage', variables)
        .then(response => response.data.data)
        .then(data => {
          if (data.staticPageCollection.items.length === 0) {
            error({ statusCode: 404, message: app.i18n.t('messages.notFound') });
            return;
          }
          return data.staticPageCollection.items[0];
        })
        .catch((e) => {
          error({ statusCode: 500, message: e.toString() });
        });
    },

    computed: {
      hero() {
        return this.primaryImageOfPage ? this.primaryImageOfPage : null;
      },
      optimisedImageUrl() {
        // use social media image if set in Contentful, otherwise use hero image
        let img = this.image === null ? this.hero : this.image;
        return this.$options.filters.optimisedImageUrl(
          img.url,
          img.contentType,
          { width: 800, height: 800 }
        );
      }
    },

    head() {
      return {
        title: this.$pageHeadTitle(this.name),
        meta: [
          { hid: 'og:type', property: 'og:type', content: 'article' },
          { hid: 'title', name: 'title', content: this.name },
          { hid: 'og:title', property: 'og:title', content: this.name }
        ].concat(this.description ? [
          { hid: 'description', name: 'description', content: this.description },
          { hid: 'og:description', property: 'og:description', content: this.description }
        ] : []).concat(this.heroImage ? [
          { hid: 'og:image', property: 'og:image', content: this.optimisedImageUrl }
        ] : [])
      };
    }
  };
</script>
