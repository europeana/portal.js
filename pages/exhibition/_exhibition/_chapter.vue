<template>
  <div data-qa="exhibition chapter">
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
    <b-container>
      <b-row>
        <b-col
          cols="9"
          class="pb-3"
        >
          <h1
            v-if="!hero"
            data-qa="exhibition chapter title"
          >
            {{ page.name }}
          </h1>
          <article>
            <h2>{{ page.description }}</h2>
            {{ page.text }}
          </article>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <BrowseSections
            v-if="page"
            :sections="page.hasPart"
          />
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <!-- TODO: add links to chapters, remove h2, move to component -->
          <h2>Chapters</h2>
          <ul v-if="chapters">
            <li
              v-for="chapter in chapters"
              :key="chapter.fields.identifier"
            >
              <b-link :to="'/exhibition/' + exhibition + '/' + chapter.fields.identifier">
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
  import createClient from '../../../plugins/contentful';
  import BrowseSections from '../../../components/browse/BrowseSections';
  import HeroImage from '../../../components/generic/HeroImage';

  export default {
    components: {
      BrowseSections,
      HeroImage
    },
    computed: {
      hero() {
        return this.page.primaryImageOfPage ? this.page.primaryImageOfPage.fields : null;
      },
      heroImage() {
        return this.hero ? this.hero.image.fields.file : null;
      }
    },
    asyncData({ params, query, error, app, store }) {
      console.log('in chapter');
      const contentfulClient = createClient(query.mode);
      return contentfulClient.getEntries({
        'locale': app.i18n.isoLocale(),
        'content_type': 'exhibitionPage',
        'fields.identifier': params.exhibition,
        'include': 3,
        'limit': 1
      })
        .then((response) => {
          console.log(response);
          if (response.total !== 0 && response.items.total !== 0 && response.items[0].fields['hasPart'].total !== 0) {
            const chapter = response.items[0].fields['hasPart'].find(c => c && c.fields.identifier === params.chapter);
            if (chapter === undefined) {
              error({ statusCode: 404, message: app.i18n.t('messages.notFound') });
              return;
            }
            store.commit('breadcrumb/setBreadcrumbs', [
              {
                text:  app.i18n.t('exhibitions.exhibitions'),
                href: '/exhibitions'
              },
              {
                text: response.items[0].fields.name,
                href: '/exhibition/' + response.items[0].fields.identifier
              },
              {
                text: chapter.fields.name,
                active: true
              }
            ]);
            return {
              chapters: response.items[0].fields['hasPart'],
              exhibition: params.exhibition,
              page: chapter.fields
            };
          }
          error({ statusCode: 404, message: app.i18n.t('messages.notFound') });
          return;
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
          // TODO: link description when it's available
          { hid: 'title', name: 'title', content: this.page.name },
          // { hid: 'description', name: 'description', content: this.page.description },
          { hid: 'og:title', property: 'og:title', content: this.page.name }
          // { hid: 'og:description', property: 'og:description', content: this.page.description }
        ]
      };
    }
  };
</script>
