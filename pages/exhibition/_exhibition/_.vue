<template>
  <div data-qa="exhibition chapter">
    <!-- TODO: hero banner can go here -->
    <b-container>
      <b-row>
        <b-col
          cols="9"
          class="pb-3"
        >
          <h1
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
      <!-- TODO: add chapters -->
    </b-container>
  </div>
</template>

<script>
  import createClient from '../../../plugins/contentful';
  import BrowseSections from '../../../components/browse/BrowseSections';

  export default {
    components: {
      BrowseSections
    },
    asyncData({ params, query, error, app }) {
      const contentfulClient = createClient(query.mode);
      return contentfulClient.getEntries({
        'locale': app.i18n.isoLocale(),
        'content_type': 'exhibitionChapterPage',
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
        title: this.page.name
      };
    }
  };
</script>
