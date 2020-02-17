<template>
  <b-container>
    <b-row class="flex-md-row pb-5">
      <b-col
        cols="12"
        lg="9"
        class="pb-0 pb-lg-3"
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
      <b-col
        cols="12"
        lg="3"
        class="pt-0 pb-3 py-lg-3 text-left text-lg-right"
      >
        <SocialShare
          :media-url="shareMediaUrl"
        />
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
  import SocialShare from '../../components/generic/SocialShare';

  export default {
    name: 'ImageGallery',
    components: {
      ContentCard,
      SocialShare
    },
    computed: {
      shareMediaUrl() {
        if (this.images.length <= 0) return null;
        if (!this.images[0].fields.thumbnailUrl) return null;
        return this.images[0].fields.thumbnailUrl;
      }
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
          { hid: 'og:image', property: 'og:image', content: this.shareMediaUrl },
          { hid: 'og:type', property: 'og:type', content: 'article' }
        ].concat(this.description ? [
          { hid: 'og:description', property: 'og:description', content: this.description }
        ] : [])
      };
    }
  };
</script>
