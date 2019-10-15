<template>
  <div
    data-qa="exhibition page"
  >
    <!-- hero banner can go here -->
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
          <h2>{{ page.description }}</h2>
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

  export default {
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
