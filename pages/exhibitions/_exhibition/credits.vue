<template>
  <div
    data-qa="exhibition credits page"
    class="text-page"
  >
    <b-container>
      <b-row class="justify-content-center">
        <b-col
          cols="12"
          class="col-lg-8 pt-large mb-4"
        >
          <h2
            v-if="exhibitionTitle"
            class="subtitle"
          >
            {{ exhibitionTitle }}
          </h2>
          <h1>{{ $t('exhibitions.credits') }}</h1>
        </b-col>
      </b-row>
      <b-row class="justify-content-center">
        <b-col
          cols="12"
          class="col-lg-8"
        >
          <article>
            <ShareButton class="mb-4" />
            <SocialShareModal />
            <!-- eslint-disable vue/no-v-html -->
            <div
              data-qa="credits text"
              v-html="htmlCredits"
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
          <ExhibitionChapters
            :exhibition-identifier="identifier"
            :chapters="hasPartCollection.items"
            :credits="credits"
          />
        </b-col>
      </b-row>
      <b-row class="footer-margin" />
    </b-container>
  </div>
</template>

<script>
  import marked from 'marked';
  import ExhibitionChapters from '../../../components/exhibition/ExhibitionChapters';
  import SocialShareModal from '../../../components/sharing/SocialShareModal.vue';
  import ShareButton from '../../../components/sharing/ShareButton.vue';

  export default {
    components: {
      ExhibitionChapters,
      ShareButton,
      SocialShareModal
    },

    asyncData({ params, query, error, app, store }) {
      const variables = {
        identifier: params.exhibition,
        locale: app.i18n.isoLocale(),
        preview: query.mode === 'preview'
      };

      return app.$contentful.query('exhibitionCreditsPage', variables)
        .then(response => response.data.data)
        .then(data => {
          if (data.exhibitionPageCollection.items.length === 0) {
            error({ statusCode: 404, message: app.i18n.t('messages.notFound') });
            return;
          }

          const exhibition = data.exhibitionPageCollection.items[0];

          store.commit('breadcrumb/setBreadcrumbs', [
            {
              text: app.i18n.tc('exhibitions.exhibitions', 2),
              to: app.$path({ name: 'exhibitions' })
            },
            {
              text: exhibition.name,
              to: app.$path({
                name: 'exhibitions-exhibition',
                params: {
                  exhibition: exhibition.identifier
                }
              })
            },
            {
              text: app.i18n.t('exhibitions.credits'),
              active: true
            }
          ]);
          return exhibition;
        })
        .catch((e) => {
          error({ statusCode: 500, message: e.toString() });
        });
    },
    computed: {
      htmlCredits() {
        if (this.credits === undefined) return false;
        return marked(this.credits);
      },
      title() {
        return `${this.name} - ${this.$t('exhibitions.credits')}`;
      },
      exhibitionTitle() {
        return this.name;
      }
    },
    beforeRouteLeave(to, from, next) {
      this.$store.commit('breadcrumb/clearBreadcrumb');
      next();
    },
    head() {
      return {
        title: this.title + this.$t('pageTitleBranding'),
        meta: [
          { hid: 'title', name: 'title', content: this.title },
          { hid: 'og:title', property: 'og:title', content: this.title },
          { hid: 'og:type', property: 'og:type', content: 'article' }
        ]
      };
    }
  };
</script>

<style lang="scss" scoped>
  /deep/ img {
    display: block;
    margin: 1rem 0;
  }
</style>
