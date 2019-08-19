<template>
  <div>
    <HeroBanner />
    <section class="container">
      <div class="mt-3 w-100">
        <ContentCardSection
          v-for="section in page.hasPart"
          :key="section.sys.id"
          :section="section"
        />
      </div>
    </section>
  </div>
</template>

<script>
  import ContentCardSection from '../components/browse/ContentCardSection';
  import HeroBanner from '../components/generic/HeroBanner';
  import { createClient }  from '../plugins/contentful.js';

  export default {
    components: {
      ContentCardSection,
      HeroBanner
    },
    asyncData ({ params, query, error, app }) {
      let contentfulClient;
      if (query.mode == 'preview' && process.env['CTF_PREVIEW_CDA_ACCESS_TOKEN']) {
        contentfulClient = createClient('preview');
      } else {
        contentfulClient = createClient();
      }
      // fetch the browsePage data, include set to 2 in order to get nested card data
      return contentfulClient.getEntries({
        'content_type': 'browsePage',
        'fields.identifier': params.pathMatch == '' ? '/' : params.pathMatch,
        'include': 2,
        'limit': 1
      })
        .then((response) => {
          if (response.total == 0) {
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
    head () {
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
