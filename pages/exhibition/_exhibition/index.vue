<template>
  <div
    data-qa="exhibition page"
  >
    <HeroImage
      v-if="hero"
      :image-url="heroImage.url"
      :image-content-type="heroImage.contentType"
      :header="page.name"
      :lead="page.headline"
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
          <article>
            <!-- eslint-disable vue/no-v-html -->
            <div
              data-qa="exhibition text"
              v-html="mainContent"
            />
            <!-- TODO: remove when credits go to their own page? -->
            <div
              v-html="credits"
            />
            <!-- eslint-enable vue/no-v-html -->
          </article>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <!-- TODO: add links to chapters, remove h2, move to component -->
          <h2>Chapters</h2>
          <ul v-if="page.hasPart">
            <li
              v-for="chapter in page.hasPart"
              :key="chapter.fields.identifier"
            >
              <b-link :to="'/exhibition/' + page.identifier + '/' + chapter.fields.identifier">
                {{ chapter.fields.name }}
              </b-link>
            </li>
          </ul>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  import marked from 'marked';
  import createClient from '../../../plugins/contentful';
  import HeroImage from '../../../components/generic/HeroImage';

  export default {
    components: {
      HeroImage
    },
    computed: {
      hero() {
        return this.page.primaryImageOfPage ? this.page.primaryImageOfPage.fields : null;
      },
      heroImage() {
        return this.hero ? this.hero.image.fields.file : null;
      },
      mainContent() {
        return marked(this.page.text);
      },
      // TODO: remove when credits go to their own page
      credits() {
        return marked(this.page.credits);
      }
    },
    asyncData({ params, query, error, app }) {
      const contentfulClient = createClient(query.mode);
      return contentfulClient.getEntries({
        'locale': app.i18n.isoLocale(),
        'content_type': 'exhibitionPage',
        'fields.identifier': params.exhibition,
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
        title: this.page.name,
        meta: [
          { hid: 'title', name: 'title', content: this.page.name },
          { hid: 'description', name: 'description', content: this.page.description },
          { hid: 'og:title', property: 'og:title', content: this.page.name },
          { hid: 'og:description', property: 'og:description', content: this.page.description }
        ]
      };
    }
  };
</script>
