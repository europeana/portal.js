<template>
  <div
    class="d-flex flex-column position-relative"
  >
    <div
      ref="mediaThumbnails"
      class="media-thumbnails d-flex flex-row flex-lg-column"
    >
      <ItemMediaThumbnail
        v-for="(resource, index) in resources"
        :key="index"
        :offset="index"
        class="d-flex-inline mr-2"
        :class="index === selectedIndex ? 'selected' : ''"
        :resource="resource"
        :edm-type="edmType"
        alt=""
        @click.native="clickThumbnail(index)"
      />
    </div>
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
      }
    },

    watch: {
      selectedIndex: 'updateThubmnailScroll'
      // TODO: consider watching resize/orientation changes to re-center thumbnails
    },

    methods: {
      clickThumbnail(index) {
        this.$router.push({ ...this.$route, query: { ...this.$route.query, page: index + 1 } });
      },
      updateThubmnailScroll() {
        const mediaThumbnailsElement = this.$refs.mediaThumbnails;
        const elementWidth = mediaThumbnailsElement.offsetWidth;
        const elementHeight = mediaThumbnailsElement.offsetHeight;

        if  (window?.innerWidth <= 991) {
          let cardWidth = 192;
          const gutter = 16;
          if (window?.innerWidth <= 767) {
            cardWidth = 96;
          }
          mediaThumbnailsElement?.scroll(gutter + (this.selectedIndex * cardWidth) - ((elementWidth / 2) + (cardWidth / 2)), 0);
        } else {
          const cardHeight = 138;
          mediaThumbnailsElement?.scroll(0, (this.selectedIndex * cardHeight) - ((elementHeight / 2) + (cardHeight / 2)));
        }
      }
    }
  };
</script>

<style lang="scss">
  @import '@europeana/style/scss/variables';

  .media-thumbnails {
    padding: 1rem;
    flex: 1 1 auto;
    background-color: $white;
    overflow-x: scroll;
    scrollbar-width: thin;

    @media (min-width: $bp-large) {
      overflow-x: hidden;
      overflow-y: auto;
      width: 13rem;
    }
  }
</style>
