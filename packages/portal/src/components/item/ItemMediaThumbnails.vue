<template>
  <transition
    appear
    name="fade"
  >
    <div
      ref="mediaThumbnailsContainer"
      class="media-thumbnails"
      @scroll="handleScrollMediaThumbnailsContainer"
    >
      <ol
        class="d-flex flex-row flex-lg-column mb-0 pl-0"
      >
        <li
          v-for="(resource, index) in resources"
          ref="mediaThumbnails"
          :key="index"
        >
          <ItemMediaThumbnail
            v-if="isToRender(index)"
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
  import useScrollTo from '@/composables/scrollTo.js';
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

    setup() {
      const { scrollElementToCentre, scrolling: scrollToScrolling } = useScrollTo();
      return { scrollElementToCentre, scrollToScrolling };
    },

    data() {
      return {
        middleVisibleElementIndex: this.selectedIndex
      };
    },

    computed: {
      firstVisibleElementIndex() {
        return Math.max(this.middleVisibleElementIndex - 5, 0);
      },

      lastVisibleElementIndex() {
        return Math.min(this.middleVisibleElementIndex + 5, this.resources.length - 1);
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
      handleScrollMediaThumbnailsContainer() {
        // wait for useScrollTo to finish what it's doing
        if (this.scrollToScrolling) {
          setTimeout(this.handleScrollMediaThumbnailsContainer, 100);
          return;
        }

        // find the thumbnail nearest the middle of the container
        const visibleElementIndices = [];
        for (let i = this.firstVisibleElementIndex; i <= this.lastVisibleElementIndex; i = i + 1) {
          if (this.isVisible(this.$refs.mediaThumbnails[i])) {
            visibleElementIndices.push(i);
          }
        }
        this.middleVisibleElementIndex = visibleElementIndices[Math.ceil(visibleElementIndices.length / 2) - 1];
      },

      isToRender(index) {
        return (index >= this.firstVisibleElementIndex) && (index <= this.lastVisibleElementIndex);
      },

      isVisible(thumb) {
        const container = this.$refs.mediaThumbnailsContainer;
        const containerRect = container.getBoundingClientRect();
        const thumbRect = thumb.getBoundingClientRect();

        const thumbTopVisible = (thumbRect.top < (containerRect.top + containerRect.height)) &&
          (thumbRect.top > containerRect.top);
        const thumbLeftVisible = (thumbRect.left < (containerRect.left + containerRect.width)) &&
          (thumbRect.left > containerRect.left);

        return thumbTopVisible && thumbLeftVisible;
      },

      updateThumbnailScroll() {
        this.scrollElementToCentre(
          this.$refs.mediaThumbnails?.[this.selectedIndex],
          {
            behavior: 'smooth',
            container: this.$refs.mediaThumbnailsContainer
          }
        );
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
    position: relative;
    z-index: 3;
    padding: 2px 1rem 1rem;
    flex: 1 1 auto;
    background-color: $white;
    overflow-x: auto;
    scrollbar-width: thin;

    li {
      list-style-type: none;
    }

    @media (min-width: $bp-large) {
      margin-top: 0;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
      overflow-x: hidden;
      overflow-y: auto;
      padding: 1rem 1rem 3.25rem;
      width: 13rem;
      height: 100%;
    }
  }
</style>
