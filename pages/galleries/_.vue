<template>
  <b-container>
    <ContentHeader
      :title="title"
      :description="htmlDescription"
      :media-url="shareMediaUrl"
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

  import marked from 'marked';

  export default {
    name: 'ImageGallery',
    components: {
      ContentHeader,
      ContentCard: () => import('../../components/generic/ContentCard')
    },
    asyncData({ params, query, error, app }) {
      const variables = {
        identifier: params.pathMatch,
        locale: app.i18n.isoLocale(),
        preview: query.mode === 'preview'
      };

      return app.$contentful.query('galleryPage', variables)
        .then(response => response.data.data)
        .then(data => {
          if (data.imageGalleryCollection.items.length === 0) {
            error({ statusCode: 404, message: app.i18n.t('messages.notFound') });
            return;
          }

          const gallery = data.imageGalleryCollection.items[0];

          return {
            rawDescription: gallery.description,
            images: gallery.hasPartCollection.items,
            title: gallery.name
          };
        })
        .catch((e) => {
          error({ statusCode: 500, message: e.toString() });
        });
    },
    computed: {
      shareMediaUrl() {
        return this.images.length === 0 ? null : this.imageUrl(this.images[0]);
      },
      description() {
        return this.$options.filters.stripMarkdown(this.rawDescription);
      },
      htmlDescription() {
        return marked(this.rawDescription);
      }
    },

    mounted() {
      if (typeof this.$redrawVueMasonry === 'function') {
        this.$redrawVueMasonry();
      }
    },

    methods: {
      imageTitle(data) {
        if (data.encoding) {
          if (data.encoding.dcTitleLangAware) {
            return data.encoding.dcTitleLangAware;
          } else if (data.encoding.dcDescriptionLangAware) {
            return data.encoding.dcDescriptionLangAware;
          } else {
            return this.$t('record.record');
          }
        }
        return data.name;
      },
      imageUrl(data) {
        return (data.encoding ? data.encoding.edmPreview : data.thumbnailUrl) + '&size=w400';
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
    }
  };
</script>
