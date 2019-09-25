<template>
  <div
    data-qa="browse page"
  >
    <HeroBanner
      v-if="page.primaryImageOfPage"
      :hero-image="page.primaryImageOfPage.fields.image.fields.file.url"
      :headline="page.primaryImageOfPage.fields.headline"
      :description="page.primaryImageOfPage.fields.description"
      :identifier="page.primaryImageOfPage.fields.identifier"
      :attribution="page.primaryImageOfPage.fields.citation"
      :rights-statement="page.primaryImageOfPage.fields.license"
    />
    <b-container>
      <BrowseSection
        v-if="page"
        :sections="page.hasPart"
      />
    </b-container>
  </div>
</template>

<script>
  import BrowseSection from '../components/browse/BrowseSection';
  import HeroBanner from '../components/generic/HeroBanner';
  import { createClient } from '../plugins/contentful.js';

  export default {
    components: {
      BrowseSection,
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

<style scoped>
  .container {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .title {
    font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    display: block;
    font-weight: 300;
    font-size: 100px;
    color: #35495e;
    letter-spacing: 1px;
  }

  .subtitle {
    font-weight: 300;
    font-size: 42px;
    color: #526488;
    word-spacing: 5px;
    padding-bottom: 15px;
  }

  .banner {
    text-align: center;
  }

  .banner ul {
    margin: auto;
  }
</style>
