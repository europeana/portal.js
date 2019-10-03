<template>
  <div
    data-qa="browse page"
  >
    <HeroBanner
      v-if="page.primaryImageOfPage"
      :image-url="page.primaryImageOfPage.fields.image.fields.file.url"
      :image-content-type="page.primaryImageOfPage.fields.image.fields.file.contentType"
      :headline="page.primaryImageOfPage.fields.headline"
      :description="page.primaryImageOfPage.fields.description"
      :identifier="page.primaryImageOfPage.fields.identifier"
      :attribution="page.primaryImageOfPage.fields.citation"
      :rights-statement="page.primaryImageOfPage.fields.license"
    />
    <b-container>
      <BrowseSections
        v-if="page"
        :sections="page.hasPart"
      />
    </b-container>
  </div>
</template>

<script>
  import BrowseSections from '../components/browse/BrowseSections';
  import HeroBanner from '../components/generic/HeroBanner';
  import createClient from '../plugins/contentful';

  export default {
    components: {
      BrowseSections,
      HeroBanner
    },
    asyncData({ params, query, error, app }) {
      const contentfulClient = createClient(query.mode);

      // fetch the browsePage data, include set to 2 in order to get nested card data
      return contentfulClient.getEntries({
        'locale': app.i18n.isoLocale(),
        'content_type': 'browsePage',
        'fields.identifier': params.pathMatch ? params.pathMatch : 'home',
        'include': 2,
        'limit': 1
      })
        .then((response) => {
          if (response.total === 0) {
            error({ statusCode: 404, message: app.i18n.t('messages.notFound') });
            return;
          }
          return {
            page: response.items[0].fields
          };
        })
        .catch((e) => {
          error({ statusCode: 500, message: e.toString() });
        });
    },
    head() {
      return {
        title: this.page.headline
      };
    }
  };
</script>
