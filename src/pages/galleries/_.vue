<template>
  <b-container>
    <ContentWarningModal
      v-if="contentWarning"
      :title="contentWarning.name"
      :description="contentWarning.description"
      :page-slug="`galleries/${identifier}`"
    />
    <ContentHeader
      :title="title"
      :description="htmlDescription"
      :media-url="shareMediaUrl"
      :context-label="$tc('galleries.galleries', 1)"
    />
    <b-row class="flex-md-row pb-5">
      <b-col cols="12">
        <div
          v-masonry
          transition-duration="0"
          item-selector=".card"
          horizontal-order="true"
          column-width=".masonry-container .card"
          class="masonry-container"
          data-qa="gallery images"
        >
          <ContentCard
            v-for="image in images"
            :key="image.identifier"
            v-masonry-tile
            :title="imageTitle(image)"
            :image-url="imageUrl(image)"
            :lazy="false"
            :url="{ name: 'item-all', params: { pathMatch: image.identifier.slice(1) } }"
          />
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import ContentHeader from '../../components/generic/ContentHeader';

  import { marked } from 'marked';
  import stripMarkdown from '@/mixins/stripMarkdown';

  export default {
    name: 'GalleryPage',
    components: {
      ContentHeader,
      ContentCard: () => import('../../components/generic/ContentCard'),
      ContentWarningModal: () => import('@/components/generic/ContentWarningModal')
    },
    mixins: [
      stripMarkdown
    ],
    data() {
      return {
        set: null,
        identifier: null,
        images: [],
        title: null,
        rawDescription: null,
        contentWarning: null
      };
    },
    async fetch() {
      if (this.setGalleriesEnabled) {
        await this.fetchSetGallery();
      } else {
        await this.fetchContentfulGallery();
      }
    },
    head() {
      return {
        title: this.$pageHeadTitle(this.title),
        meta: [
          { hid: 'title', name: 'title', content: this.title },
          { hid: 'og:title', property: 'og:title', content: this.title },
          { hid: 'og:image', property: 'og:image', content: this.shareMediaUrl },
          { hid: 'og:type', property: 'og:type', content: 'article' }
        ]
          .concat(this.description ? [
            { hid: 'description', name: 'description', content: this.description },
            { hid: 'og:description', property: 'og:description', content: this.description }
          ] : [])
      };
    },
    computed: {
      setGalleriesEnabled() {
        return this.$features.setGalleries;
      },
      shareMediaUrl() {
        return this.images.length === 0 ? null : this.imageUrl(this.images[0]);
      },
      description() {
        return this.stripMarkdown(this.rawDescription);
      },
      htmlDescription() {
        return marked.parse(this.rawDescription);
      }
    },

    mounted() {
      if (typeof this.$redrawVueMasonry === 'function') {
        this.$redrawVueMasonry();
      }
    },

    methods: {
      async fetchSetGallery() {
        const id = this.$route.params.pathMatch.split('-')[0];
        const setGetResponse = await this.$apis.set.get(id, { withMinimalItemPreviews: true });
        this.set = setGetResponse.data;
      },
      async fetchContentfulGallery() {
        const variables = {
          identifier: this.$route.params.pathMatch,
          locale: this.$i18n.isoLocale(),
          preview: this.$route.query.mode === 'preview'
        };

        await this.$contentful.query('galleryPage', variables)
          .then(response => response.data.data)
          .then(data => {
            if (data.imageGalleryCollection.items.length === 0) {
              this.error({ statusCode: 404, message: this.i18n.t('messages.notFound') });
              return null;
            }

            const gallery = data.imageGalleryCollection.items[0];

            this.contentWarning = gallery.contentWarning;
            this.identifier = variables.identifier;
            this.images = gallery.hasPartCollection.items.filter(image => image !== null);
            this.rawDescription = gallery.description;
            this.title = gallery.name;
          })
          .catch((e) => {
            this.error({ statusCode: 500, message: e.toString() });
          });
      },
      imageTitle(data) {
        if (data.encoding) {
          return data.encoding.dcTitleLangAware || data.encoding.dcDescriptionLangAware || this.$t('record.record');
        }
        return data.name;
      },
      imageUrl(data) {
        const edmPreview = data.encoding?.edmPreview?.[0] || data.thumbnailUrl;
        return this.$apis.thumbnail.edmPreview(edmPreview, { size: 400 });
      }
    }
  };
</script>
