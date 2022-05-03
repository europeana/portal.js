<template>
  <div
    class="card-img default-thumbnail"
    :style="placeholderColor"
    data-qa="default thumbnail"
  >
    <span
      v-if="mediaType"
      :class="iconClass"
    />
  </div>
</template>

<script>
  export default {
    name: 'DefaultThumbnail',

    props: {
      /**
       * Type of media
       */
      mediaType: {
        type: String,
        default: null
      }
    },

    computed: {
      placeholderColor() {
        const colors = ['#00B5E3', '#26B5B3', '#D690C6', '#E66388', '#FFC64D', '#D9D4CA', '#DFC48D'];
        return `background-color: ${colors[Math.floor(Math.random() * colors.length)]}`;
      },

      iconClass() {
        return `icon-${this.mediaType.toLowerCase()}`;
      }
    }
  };
</script>
