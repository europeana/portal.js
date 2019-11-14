<template>
  <section>
    <b-img
      v-for="thumbnail of thumbnails"
      :key="thumbnail.key"
      :src="thumbnail.src"
    />
  </section>
</template>

<script>
  import { thumbnailUrl } from  '../../plugins/europeana/utils';

  export default {
    name: 'MediaThumbnailGrid',

    props: {
      media: {
        type: Array,
        required: true
      },

      size: {
        type: String,
        default: 'w200'
      }
    },

    computed: {
      thumbnails() {
        return this.media.map((item) => {
          return {
            key: item.about,
            // TODO: derive `type` for the web resource, and pass to API
            src: thumbnailUrl(item.about, { size: this.size })
          };
        });
      }
    }
  };
</script>
