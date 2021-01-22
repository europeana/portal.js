<template>
  <div>
    <BrowsePage
      v-if="contentType='browsePage'"
      :identifier="identifier"
      :name="name"
      :headline="headline"
      :description="description"
      :primary-image-of-page="primaryImageOfPage"
      :image="image"
      :has-part-collection="hasPartCollection"
    />
  </div>
</template>

<script>
  import BrowsePage from '../components/browse/BrowsePage.vue';
  export default {
    components: {
      BrowsePage
    },

    asyncData({ params, query, error, app }) {
      const variables = {
        identifier: params.pathMatch ? params.pathMatch : 'home',
        locale: app.i18n.isoLocale(),
        preview: query.mode === 'preview'
      };

      return app.$contentful.query('browseStaticPage', variables)
        .then(response => response.data.data)
        .then(data => {
          if (data.browsePageCollection.items.length === 0) {
            error({ statusCode: 404, message: app.i18n.t('messages.notFound') });
            return;
          }
          let itemData = data.browsePageCollection.items[0];
          itemData.contentType = 'browsePage';
          return itemData;
        })
        .catch((e) => {
          error({ statusCode: 500, message: e.toString() });
        });
    },

    data() {
      return {
        contentType: null
      };
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
