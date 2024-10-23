<template>
  <transition
    appear
    name="fade"
  >
    <div
      ref="mediaThumbnailsContainer"
      class="media-thumbnails"
    >
      <ol
        ref="mediaThumbnailsList"
        class="d-flex flex-row flex-lg-column mb-0 pl-0"
      >
        <!-- The ref array does not guarantee the same order as the source array. This causes issues when prepending resources.
       Workaround: Read list elements from the list parent's children to get them at the actual rendered index. -->
        <!-- Unique key for each resource to prevent prepended resources reusing existing elements and causing jumpiness -->
        <li
          v-for="(resource, index) in resourcesToRender"
          :key="resource.about"
        >
          <!-- TODO: calc offset/page separately -->
          <ItemMediaThumbnail
            :offset="firstRenderedResourceIndex + index"
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
  import useItemMediaPresentation from '@/composables/itemMediaPresentation.js';
  import useScrollTo from '@/composables/scrollTo.js';
  import ItemMediaThumbnail from './ItemMediaThumbnail.vue';

  const perPage = 10;

  export default {
    name: 'ItemMediaThumbnails',

    components: {
      ItemMediaThumbnail
    },

    props: {
      edmType: {
        type: String,
        default: null
      }
    },

    setup() {
      const { page, resources } = useItemMediaPresentation();
      const { scrollElementToCentre, scrollToElement, scrolling: scrollToScrolling } = useScrollTo();
      return {  page, resources, scrollElementToCentre, scrollToElement, scrollToScrolling };
    },

    data() {
      return {
        resourcesToRender: this.page < perPage ? this.resources.slice(0, perPage * 2) :
          this.resources.slice(Math.max(this.page - perPage - 1, 0), Math.min(this.page + perPage, this.resources.length - 1))
      };
    },

    computed: {
      firstRenderedResourceIndex() {
        return this.resources.findIndex(resource => resource === this.resourcesToRender[0]);
      },

      lastRenderedResourceIndex() {
        return this.resources.findIndex(resource => resource === this.resourcesToRender[this.resourcesToRender.length - 1]);
      },

      selectedIndex() {
        return this.page - this.firstRenderedResourceIndex - 1;
      }
    },

    watch: {
      page() {
        this.updateThumbnailScroll();
      }
    },

    mounted() {
      if (this.page > 1) {
        this.$nextTick(() => {
          // instant scroll when first loaded, so that browser skips loading of
          // images not in view
          this.updateThumbnailScroll('instant');
        });
      }

      // TODO: can we have just one observer? Move out of mounted?
      const ioFirst = new IntersectionObserver((entries) => {
        entries.forEach(async(entry) => {
          if (entry.intersectionRatio > 0) {
            ioFirst.unobserve(this.$refs.mediaThumbnailsList.children[0]);
            this.resourcesToRender = this.resources.slice(Math.max(this.firstRenderedResourceIndex - perPage, 0), this.firstRenderedResourceIndex).concat(this.resourcesToRender);

            await this.$nextTick();
            if (this.firstRenderedResourceIndex > 0) {
              const firstRenderedThumbnail = this.$refs.mediaThumbnailsList.children[0];
              // On the horizontal scroll bar (small screens), items are prepended and push the scroll container. This scrolls back to the offset where the prepend was triggered.
              // TODO: ideally this should be less jumpy
              const leftScrollOffset = entry.boundingClientRect.left;
              if (leftScrollOffset < 0) {
                this.scrollToElement(this.$refs.mediaThumbnailsList.children[perPage], {
                  behavior: 'instant',
                  container: this.$refs.mediaThumbnailsContainer,
                  left: leftScrollOffset
                });
              }
              // Is this nextTick needed?
              await this.$nextTick();
              ioFirst.observe(firstRenderedThumbnail);
            }
          }
        });
      });

      const ioLast = new IntersectionObserver((entries) => {
        entries.forEach(async(entry) => {
          if (entry.intersectionRatio > 0) {
            ioLast.unobserve(this.$refs.mediaThumbnailsList.children[this.$refs.mediaThumbnailsList.children.length - 1]);
            this.resourcesToRender = this.resourcesToRender.concat(this.resources.slice(this.lastRenderedResourceIndex + 1, this.lastRenderedResourceIndex + perPage + 1));

            await this.$nextTick();
            const lastRenderedThumbnail = this.$refs.mediaThumbnailsList.children[this.$refs.mediaThumbnailsList.children.length - 1];
            ioLast.observe(lastRenderedThumbnail);
          }
        });
      });

      const firstRenderedThumbnail = this.$refs.mediaThumbnailsList.children[0];
      const lastRenderedThumbnail = this.$refs.mediaThumbnailsList.children[this.$refs.mediaThumbnailsList.children.length - 1];

      if (this.page > perPage) {
        ioFirst.observe(firstRenderedThumbnail);
      }
      ioLast.observe(lastRenderedThumbnail);

      // TODO: pause observing on resize
      window.addEventListener('resize', this.handleWindowResize);
    },

    destroyed() {
      window.removeEventListener('resize', this.handleWindowResize);
    },

    methods: {
      handleWindowResize() {
        this.updateThumbnailScroll();
      },

      updateThumbnailScroll(behavior = 'smooth') {
        this.scrollElementToCentre(
          this.$refs.mediaThumbnailsList.children?.[this.selectedIndex],
          {
            behavior,
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
      flex-shrink: 0;
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
