<template>
  <b-container>
    <b-row class="flex-md-row pb-5">
      <b-col
        cols="9"
        class="pb-3"
      >
        <h1 data-qa="gallery title">
          {{ title }}
        </h1>
        <!-- eslint-disable vue/no-v-html -->
        <div
          v-html="htmlDescription"
          v-if="htmlDescription"
        />
        <!-- eslint-enable vue/no-v-html -->
      </b-col>
      <b-col cols="12">
        <b-card-group
          class="card-deck-4-cols"
          deck
          data-qa="gallery images"
        >
          <ContentCard
            v-for="image in images"
            :key="image.fields.identifier"
            :title="image.fields.name"
            :image-url="image.fields.thumbnailUrl"
            :texts="[image.fields.description]"
            :url="{ name: 'record-all', params: { pathMatch: image.fields.identifier.slice(1) } }"
          />
        </b-card-group>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import createClient from '../../plugins/contentful';
  import ContentCard from '../../components/generic/ContentCard';
  import marked from 'marked';

  export default {
    name: 'ImageGallery',
    components: {
      ContentCard
    },
    asyncData({ params, query, error, app }) {
      const contentfulClient = createClient(query.mode);
      return contentfulClient.getEntries({
        'locale': app.i18n.isoLocale(),
        'content_type': 'imageGallery',
        'fields.identifier': params.pathMatch
      })
        .then((response) => {
          return {
            rawDescription: response.items[0].fields.description,
            images: response.items[0].fields.hasPart,
            title: response.items[0].fields.name
          };
        })
        .catch((e) => {
          error({ statusCode: 500, message: e.toString() });
        });
    },
    computed: {
      htmlDescription() {
        return marked(this.rawDescription);
      },
      description() {
        return this.$options.filters.stripMarkdown(this.rawDescription);
      }
    },
    head() {
      return {
        title: this.title,
        meta: [
          { hid: 'title', name: 'title', content: this.title },
          { hid: 'description', name: 'description', content: this.description },
          { hid: 'og:title', property: 'og:title', content: this.title },
          { hid: 'og:description', property: 'og:description', content: this.description }
        ]
      };
    }
  };
</script>
