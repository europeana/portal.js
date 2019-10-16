<template>
  <div
    data-qa="exhibition page"
  >
    <HeroBanner
      v-if="hero"
      :image-url="heroImage.url"
      :image-content-type="heroImage.contentType"
      :headline="heroHeadline"
      :description="heroDescription"
      :identifier="hero.identifier"
      :citation="hero.citation"
      :rights-statement="hero.license"
      :name="hero.name"
      :provider="hero.provider"
      :creator="hero.creator"
      :url="hero.url"
    />
    <b-container class="pb-3">
      <b-row>
        <b-col
          cols="9"
          class="pb-3"
        >
          <h1
            data-qa="exhibition title"
          >
            {{ page.headline }}
          </h1>
          <h2>{{ page.alternativeHeadline }}</h2>
          <p>{{ page.description }}</p>
          {{ page.text }}
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <!-- chapters can go here -->
          <h2>Chapters</h2>
          <ul>
            <li
              v-for="chapter in page.hasPart"
              :key="chapter.fields.identifier"
            >
              {{ chapter.fields.headline }}
            </li>
          </ul>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  import createClient from '../../plugins/contentful';
  import HeroBanner from '../../components/generic/HeroBanner';

  export default {
    components: {
      HeroBanner
    },
    computed: {
      hero() {
        return this.page.primaryImageOfPage ? this.page.primaryImageOfPage.fields : null;
      },
      heroDescription() {
        return this.page.description;
      },
      heroHeadline() {
        return this.page.headline;
      },
      heroImage() {
        return this.hero ? this.hero.image.fields.file : null;
      }
    },
    asyncData({ params, query, error, app }) {

      const contentfulClient = createClient(query.mode);

      return contentfulClient.getEntries({
        'locale': app.i18n.isoLocale(),
        'content_type': 'exhibitionPage',
        'fields.identifier': params.pathMatch,
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
