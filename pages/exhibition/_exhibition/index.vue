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
              v-if="credits"
              v-html="credits"
            />
            <!-- eslint-enable vue/no-v-html -->
          </article>
        </b-col>
      </b-row>
      <b-row v-if="page.hasPart">
        <b-col>
          <ExhibitionChapters
            :exhibition-identifier="page.identifier"
            :chapters="page.hasPart"
          />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  import marked from 'marked';
  import createClient from '../../../plugins/contentful';
  import ExhibitionChapters from '../../../components/exhibition/ExhibitionChapters';
  import HeroImage from '../../../components/generic/HeroImage';

  export default {
    components: {
      ExhibitionChapters,
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
        if (this.page.credits === undefined) return false;
        return marked(this.page.credits);
      }
    },
    asyncData({ params, query, error, app, store }) {
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
          store.commit('breadcrumb/setBreadcrumbs', [
            {
              // TODO: Add named language aware route for exhibitions
              text:  app.i18n.t('exhibitions.exhibitions'),
              to: '/exhibitions'
            },
            {
              text: response.items[0].fields.name,
              active: true
            }
          ]);
          return {
            page: response.items[0].fields
          };
        })
        .catch((e) => {
          error({ statusCode: 500, message: e.toString() });
        });
    },
    beforeRouteLeave(to, from, next) {
      this.$store.commit('breadcrumb/clearBreadcrumb');
      next();
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
