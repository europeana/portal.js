<template>
  <transition
    appear
    name="fade"
  >
    <div>
      <ol
        ref="mediaThumbnails"
        class="media-thumbnails d-flex flex-row flex-lg-column mb-0"
      >
        <li
          v-for="(resource, index) in resources"
          :key="index"
        >
          <ItemMediaThumbnail
            :offset="index"
            class="d-flex-inline mr-2"
            :class="{ 'selected': index === selectedIndex }"
            :resource="resource"
            :edm-type="edmType"
          />
        </li>
      </ol>
    </div>
  </transition>
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
  @import '@europeana/style/scss/transitions';

  .media-thumbnails {
    padding: 1rem;
    flex: 1 1 auto;
    background-color: $white;
    overflow-x: scroll;
    scrollbar-width: thin;
    height: 100%;
    transition: $standard-transition;

    li {
      list-style-type: none;
    }

    @media (min-width: $bp-large) {
      overflow-x: hidden;
      overflow-y: auto;
      padding: 1rem;
      width: 13rem;
    }
  }
</style>
