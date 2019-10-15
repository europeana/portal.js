<template>
  <div
    data-qa="browse page"
  >
    <HeroBanner
      v-if="hero"
      :image-url="heroImage.url"
      :image-content-type="heroImage.contentType"
      :headline="heroHeadline"
      :description="page.description"
      :identifier="hero.identifier"
      :citation="hero.citation"
      :rights-statement="hero.license"
      :name="hero.name"
      :provider="hero.provider"
      :creator="hero.creator"
      :url="hero.url"
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
    computed: {
      hero() {
        return this.page.primaryImageOfPage ? this.page.primaryImageOfPage.fields : null;
      },
      heroHeadline() {
        return this.page.headline || this.hero.headline || this.page.name;
      },
      heroImage() {
        return this.hero ? this.hero.image.fields.file : null;
      }
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
        title: this.page.name
      };
    }
  };
</script>
