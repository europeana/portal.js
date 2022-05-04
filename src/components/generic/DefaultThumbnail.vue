<template>
  <div
    class="card-img default-thumbnail"
    :style="{ 'background-color': placeholderColor }"
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
      },

      offset: {
        type: Number,
        default: null
      }
    },

    data() {
      return {
        COLORS: ['#00B5E3', '#26B5B3', '#D690C6', '#E66388', '#FFC64D', '#D9D4CA', '#DFC48D', '#E36D00', '#CDB4D9', '#837F99', '#B4D9C7']
      };
    },

    computed: {
      placeholderColor() {
        let color;

        if (this.offset === null) {
          color = this.COLORS[Math.floor(Math.random() * this.COLORS.length)];
        } else {
          color = this.COLORS[this.offset % this.COLORS.length];
        }

        return color;
      },

      iconClass() {
        return `icon-${this.mediaType.toLowerCase()}`;
      }
    }
  };
</script>
