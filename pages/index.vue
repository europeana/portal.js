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
    <section class="container">
      <div class="mt-3 w-100">
        <template
          v-for="section in page.hasPart"
        >
          <RichText
            v-if="contentType(section, 'richText')"
            :key="section.sys.id"
            :headline="section.fields.headline"
            :text="section.fields.text"
          />
          <ContentCardSection
            v-else-if="contentType(section, 'cardGroup')"
            :key="section.sys.id"
            :section="section"
          />
        </template>
      </div>
    </section>
  </div>
</template>

<script>
  import RichText from '../components/browse/RichText';
  import ContentCardSection from '../components/browse/ContentCardSection';
  import HeroBanner from '../components/generic/HeroBanner';
  import { createClient } from '../plugins/contentful.js';

  export default {
    components: {
      RichText,
      ContentCardSection,
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
    },

    methods: {
      contentType(section, id) {
        return section.sys.contentType.sys.id === id;
      }
    }
  };
</script>
