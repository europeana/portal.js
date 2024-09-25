<template>
  <div
    class="d-flex flex-column position-relative"
  >
    <ol
      ref="mediaThumbnails"
      class="media-thumbnails d-flex flex-row flex-lg-column"
      :class="{ 'show': show }"
    >
      <li
        v-for="(resource, index) in resources"
        :key="index"
      >
        <ItemMediaThumbnail
          :offset="index"
          class="d-flex-inline mr-2"
          :class="index === selectedIndex ? 'selected' : ''"
          :resource="resource"
          :edm-type="edmType"
          alt=""
        />
      </li>
    </ol>
  </div>
</template>

<script>
  import ItemMediaThumbnail from './ItemMediaThumbnail.vue';

  export default {
    name: 'ItemMediaThumbnails',

    components: {
      ItemMediaThumbnail
    },
    props: {
      resources: {
        type: Array,
        required: true
      },
      edmType: {
        type: String,
        default: null
      },
      selectedIndex: {
        type: Number,
        required: true
      },
      show: {
        type: Boolean,
        default: false
      }
    },

    watch: {
      selectedIndex: 'updateThumbnailScroll'
    },

    created() {
      window.addEventListener('resize', this.updateThumbnailScroll);
    },
    destroyed() {
      window.removeEventListener('resize', this.updateThumbnailScroll);
    },

    methods: {
      updateThumbnailScroll() {
        const mediaThumbnailsElement = this.$refs.mediaThumbnails;
        const elementWidth = mediaThumbnailsElement.offsetWidth;
        const elementHeight = mediaThumbnailsElement.offsetHeight;

        if (window?.innerWidth <= 991) {
          let cardWidth = 184;
          const padding = 16;
          if (window?.innerWidth <= 767) {
            cardWidth = 90;
          }
          mediaThumbnailsElement?.scroll(padding + (this.selectedIndex * cardWidth) - ((elementWidth / 2) - (cardWidth / 2)), 0);
        } else {
          const cardHeight = 140; // includes bottom padding
          mediaThumbnailsElement?.scroll(0, (this.selectedIndex * cardHeight) - ((elementHeight / 2) - (cardHeight / 2)));
        }
      }
    }
  };
</script>

<style lang="scss">
  @import '@europeana/style/scss/variables';

  .media-thumbnails {
    padding: 0 1rem;
    flex: 1 1 auto;
    background-color: $white;
    overflow-x: scroll;
    scrollbar-width: thin;
    height: 0;
    transition: $standard-transition;

    li {
      list-style-type: none;
    }

    &.show {
      transition: $standard-transition;
      padding: 1rem;
      height: auto;
    }

    @media (min-width: $bp-large) {
      overflow-x: hidden;
      overflow-y: auto;
      width: 0;
      height: auto;
      padding: 1rem 0;

      &.show {
        width: auto;
      }
    }
  }
</style>
