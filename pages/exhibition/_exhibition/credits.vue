<template>
  <div
    data-qa="exhibition credits page"
  >
    <b-container class="pb-3">
      <b-row>
        <b-col
          cols="9"
          class="pb-3"
        >
          <h1>{{ $t('exhibitions.credits') }}</h1>
          <!-- eslint-disable vue/no-v-html -->
          <div
            data-qa="credits text"
            v-html="credits"
          />
          <!-- eslint-enable vue/no-v-html -->
        </b-col>
      </b-row>
      <b-row v-if="page.hasPart">
        <b-col>
          <ExhibitionChapters
            :exhibition-identifier="page.identifier"
            :chapters="page.hasPart"
            :credits="page.credits"
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

  export default {
    components: {
      ExhibitionChapters
    },
    computed: {
      credits() {
        if (this.page.credits === undefined) return false;
        return marked(this.page.credits);
      },
      title() {
        return `${this.page.name} - ${this.$t('exhibitions.credits')}`;
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
        title: this.title,
        meta: [
          { hid: 'title', name: 'title', content: this.title },
          { hid: 'og:title', property: 'og:title', content: this.title }
        ]
      };
    }
  };
</script>
