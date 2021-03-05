<template>
  <div
    data-qa="exhibition page"
    class="text-page figure-attribution"
  >
    <AuthoredHead
      :title="name"
      :description="headline"
      :hero="hero"
    />
    <b-container>
      <b-row class="justify-content-center">
        <b-col
          cols="12"
          class="col-lg-8"
        >
          <article>
            <!-- eslint-disable vue/no-v-html -->
            <!-- share :media-url="" -->
            <ShareButton class="mb-4" />
            <SocialShareModal :media-url="hero.image.url" />
            <div
              data-qa="exhibition text"
              v-html="mainContent"
            />
            <!-- eslint-enable vue/no-v-html -->
          </article>
        </b-col>
      </b-row>
      <b-row
        v-if="hasPartCollection"
        class="justify-content-center mt-3"
      >
        <b-col
          cols="12"
          class="mt-3 col-lg-8"
        >
          <LinkList
            :items="chapterPagesToLinkListItems(hasPartCollection.items, identifier)"
            :title="$t('exhibitions.chapters')"
          />
        </b-col>
      </b-row>
      <b-row class="footer-margin" />
    </b-container>
  </div>
</template>

<script>
  import marked from 'marked';
  import SocialShareModal from '../../../components/sharing/SocialShareModal.vue';
  import ShareButton from '../../../components/sharing/ShareButton.vue';
  import exhibitionChapters from '../../../mixins/exhibitionChapters';

  export default {
    components: {
      LinkList: () => import('../../../components/generic/LinkList'),
      ShareButton,
      SocialShareModal,
      AuthoredHead: () => import('../../../components/authored/AuthoredHead')
    },
    mixins: [
      exhibitionChapters
    ],
    asyncData({ params, query, error, app, store, redirect }) {
      if (params.exhibition === undefined) redirect(app.$path({ name: 'exhibitions' }));

      const variables = {
        identifier: params.exhibition,
        locale: app.i18n.isoLocale(),
        preview: query.mode === 'preview'
      };

      return app.$contentful.query('exhibitionLandingPage', variables)
        .then(response => response.data.data)
        .then(data => {
          if (data.exhibitionPageCollection.items.length === 0) {
            error({ statusCode: 404, message: app.i18n.t('messages.notFound') });
            return;
          }

          store.commit('breadcrumb/setBreadcrumbs', [
            {
              text: app.i18n.tc('exhibitions.exhibitions', 2),
              to: app.$path({ name: 'exhibitions' })
            },
            {
              text: data.exhibitionPageCollection.items[0].name,
              active: true
            }
          ]);
          return data.exhibitionPageCollection.items[0];
        })
        .catch((e) => {
          error({ statusCode: 500, message: e.toString() });
        });
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
      },
      optimisedImageUrl() {
        return this.$options.filters.optimisedImageUrl(
          this.heroImage.url,
          this.heroImage.contentType,
          { width: 800, height: 800 }
        );
      }
    },
    beforeRouteLeave(to, from, next) {
      this.$store.commit('breadcrumb/clearBreadcrumb');
      next();
    },
    head() {
      return {
        title: this.$pageHeadTitle(this.name),
        meta: [
          { hid: 'title', name: 'title', content: this.name },
          { hid: 'og:title', property: 'og:title', content: this.name },
          { hid: 'og:type', property: 'og:type', content: 'article' }
        ].concat(this.description ? [
          { hid: 'description', name: 'description', content: this.description },
          { hid: 'og:description', property: 'og:description', content: this.description }
        ] : []).concat(this.heroImage ? [
          { hid: 'og:image', property: 'og:image', content: this.optimisedImageUrl },
          { hid: 'og:image:alt', property: 'og:image:alt', content: this.heroImage.description }
        ] : [])
      };
    }
  };
</script>
