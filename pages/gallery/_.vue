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
        <p
          v-if="description"
        >
          {{ description }}
        </p>
      </b-col>
      <b-col cols="12">
        <b-card-group
          class="masonry"
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
            description: response.items[0].fields.description,
            images: response.items[0].fields.hasPart,
            title: response.items[0].fields.name
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
          { hid: 'description', name: 'description', content: this.description },
          { hid: 'og:title', property: 'og:title', content: this.title },
          { hid: 'og:description', property: 'og:description', content: this.description }
        ]
      };
    }
  };
</script>

<style lang="scss" scoped>
  @import "./assets/scss/variables.scss";

  .masonry {
    display: inline-block;
    width: 100%;
    columns: 1;
    column-gap: 0;

    @media (min-width: $bp-small) {
      columns: 2;
      column-gap: 1rem;
    }

    @media (min-width: $bp-large) {
      columns: 4;
    }

    .content-card {
      break-inside: avoid;
      min-height: initial;
      transform: translateZ(0);
      width: 100%;

      /deep/ .card-img {
        min-height: initial;
        max-height: initial;
      }
    }
  }
</style>
