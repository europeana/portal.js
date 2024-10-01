<template>
  <transition
    appear
    name="fade"
  >
    <div
      ref="mediaThumbnails"
      class="media-thumbnails"
    >
      <ol
        ref="mediaThumbnailsList"
        class="d-flex flex-row flex-lg-column mb-0 pl-0"
      >
        <li
          v-for="(resource, index) in resources"
          :key="index"
        >
          <ItemMediaThumbnail
            :offset="index"
            class="d-flex-inline mr-3 mr-lg-auto"
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

    mounted() {
      if (this.selectedIndex > 0) {
        this.$nextTick(() => {
          this.updateThumbnailScroll();
        });
      }
    },

    destroyed() {
      window.removeEventListener('resize', this.updateThumbnailScroll);
    },

    methods: {
      updateThumbnailScroll() {
        const mediaThumbnailsElement = this.$refs.mediaThumbnails;
        if (!mediaThumbnailsElement) {
          return;
        }

        const elementWidth = mediaThumbnailsElement.offsetWidth;
        const elementHeight = mediaThumbnailsElement.offsetHeight;

        if (window.innerWidth <= 991) {
          let cardWidth = 184;
          const padding = 16;
          if (window.innerWidth <= 767) {
            cardWidth = 90;
          }
          const scrollLeft = padding + (this.selectedIndex * cardWidth) - ((elementWidth / 2) - (cardWidth / 2));
          mediaThumbnailsElement.scroll(scrollLeft, 0);
        } else {
          const cardHeight = 140; // includes bottom padding
          const scrollHeight = (this.selectedIndex * cardHeight) - ((elementHeight / 2) - (cardHeight / 2));
          mediaThumbnailsElement.scroll(0, scrollHeight);
        }
      }
    }
  };
</script>

<style lang="scss">
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/transitions';

  .media-thumbnails {
    // overlap 2px to save space for focus outline
    margin-top: -2px;
    padding: 2px 1rem 1rem;
    flex: 1 1 auto;
    background-color: $white;
    overflow-x: auto;
    scrollbar-width: thin;

    li {
      list-style-type: none;
    }

    @media (min-width: $bp-large) {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
      overflow-x: hidden;
      overflow-y: auto;
      padding: 1rem;
      width: 13rem;
      height: 100%;
    }
  }
</style>
