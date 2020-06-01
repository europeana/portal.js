<template>
  <div
    data-qa="exhibition page"
  >
    <HeroImage
      v-if="hero"
      :image-url="heroImage.url"
      :image-content-type="heroImage.contentType"
      :header="name"
      :lead="headline"
      :rights-statement="hero.license"
      :name="hero.name"
      :provider="hero.provider"
      :creator="hero.creator"
      :url="hero.url"
    />
    <b-container class="pb-3">
      <b-row>
        <b-col
          cols="12"
          lg="9"
          class="pb-0 pb-lg-3"
        >
          <article>
            <!-- eslint-disable vue/no-v-html -->
            <div
              data-qa="exhibition text"
              v-html="mainContent"
            />
            <!-- eslint-enable vue/no-v-html -->
          </article>
        </b-col>
        <b-col
          cols="12"
          lg="3"
          class="pb-3 text-left text-lg-right"
        >
          <SocialShare
            :media-url="heroImage.url"
          />
        </b-col>
      </b-row>
      <b-row v-if="hasPartCollection">
        <b-col class="my-3">
          <h2 class="is-size-1-5">
            {{ $t('exhibitions.chapters') }}
          </h2>
          <ExhibitionChapters
            :exhibition-identifier="identifier"
            :chapters="hasPartCollection.items"
            :credits="credits"
          />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  import marked from 'marked';
  // import createClient from '../../../plugins/contentful';
  import ExhibitionChapters from '../../../components/exhibition/ExhibitionChapters';
  import HeroImage from '../../../components/generic/HeroImage';
  import SocialShare from '../../../components/generic/SocialShare';

  export default {
    components: {
      ExhibitionChapters,
      HeroImage,
      SocialShare
    },
    computed: {
      hero() {
        return this.primaryImageOfPage ? this.primaryImageOfPage : null;
      },
      heroImage() {
        return this.hero ? this.hero.image : null;
      },
      mainContent() {
        if (this.text === undefined) return;
        return marked(this.text);
      }
    },
    asyncData({ params, query, error, app, store, redirect }) {
      if (params.exhibition === undefined) redirect(app.$path({ name: 'exhibitions' }));

      const fetchLinkGroups = !(store.state['link-group'].data.mainNavigation);
      const variables = {
        identifier: params.exhibition,
        locale: app.i18n.isoLocale(),
        preview: query.mode === 'preview',
        linkGroups: fetchLinkGroups
      };

      return app.$contentful.query('exhibitionLandingPage', variables)
        .then(response => response.data.data)
        .then(data => {
          if (fetchLinkGroups) store.commit('link-group/setLinks', data);

          if (data.exhibitionPageCollection.items.length === 0) {
            error({ statusCode: 404, message: app.i18n.t('messages.notFound') });
            return;
          }

          return data.exhibitionPageCollection.items[0];
        })
        .catch((e) => {
          error({ statusCode: 500, message: e.toString() });
        });

      // const contentfulClient = createClient(query.mode);
      // return contentfulClient.getEntries({
      //   'locale': app.i18n.isoLocale(),
      //   'content_type': 'exhibitionPage',
      //   'fields.identifier': params.exhibition,
      //   'include': 2,
      //   'limit': 1
      // })
      //   .then((response) => {
      //     if (response.total === 0) {
      //       error({ statusCode: 404, message: app.i18n.t('messages.notFound') });
      //       return;
      //     }
      //     store.commit('breadcrumb/setBreadcrumbs', [
      //       {
      //         text:  app.i18n.tc('exhibitions.exhibitions', 2),
      //         to: app.$path({ name: 'exhibitions' })
      //       },
      //       {
      //         text: response.items[0].fields.name,
      //         active: true
      //       }
      //     ]);
      //     return {
      //       page: response.items[0].fields
      //     };
      //   })
      //   .catch((e) => {
      //     error({ statusCode: 500, message: e.toString() });
      //   });
    },
    beforeRouteLeave(to, from, next) {
      this.$store.commit('breadcrumb/clearBreadcrumb');
      next();
    },
    head() {
      return {
        title: this.name,
        meta: [
          { hid: 'title', name: 'title', content: this.name },
          { hid: 'og:title', property: 'og:title', content: this.name },
          { hid: 'og:type', property: 'og:type', content: 'article' }
        ].concat(this.description ? [
          { hid: 'description', name: 'description', content: this.description },
          { hid: 'og:description', property: 'og:description', content: this.description }
        ] : []).concat(this.heroImage ? [
          { hid: 'og:image', property: 'og:image', content: this.$options.filters.urlWithProtocol(this.heroImage.url) }
        ] : [])
      };
    }
  };
</script>
