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
        class="d-flex flex-row flex-lg-column pl-0"
      >
        <li
          v-if="skeletonBefore"
          ref="thumbnailSkeletonBefore"
          class="thumbnail-skeleton-before"
          :style="{
            '--skeletonheightbefore': calculateSkeletonHeight(resources.slice(0, firstRenderedResourceIndex)),
            '--skeletonwidthbefore': calculateSkeletonWidth(resources.slice(0, firstRenderedResourceIndex))
          }"
        />

        <!-- The ref array does not guarantee the same order as the source array. This causes issues when prepending resources.
       Workaround: Read list elements from the list parent's children to get them at the actual rendered index. -->
        <!-- Unique key for each resource to prevent prepended resources reusing existing elements and causing jumpiness -->
        <li
          v-for="(resource, index) in resourcesToRender"
          :key="resource.about"
          :aria-setsize="resources.length"
          :aria-posinset="firstRenderedResourceIndex + index + 1"
        >
          <ItemMediaThumbnail
            :offset="firstRenderedResourceIndex + index"
            class="d-flex-inline mr-3 mr-lg-auto"
            :class="{ 'selected': index === selectedIndex }"
            :resource="resource"
            :edm-type="edmType"
          />
        </li>
        <li
          v-if="skeletonAfter"
          ref="thumbnailSkeletonAfter"
          class="thumbnail-skeleton-after"
          :style="{
            '--skeletonheightafter': calculateSkeletonHeight(resources.slice(lastRenderedResourceIndex, resources.length - 1)),
            '--skeletonwidthafter': calculateSkeletonWidth(resources.slice(lastRenderedResourceIndex, resources.length - 1))
          }"
        />
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
        resourcesToRender: !!this.resources && (this.page <= perPage ? this.resources.slice(0, perPage * 2) :
          this.resources.slice(Math.max(this.page - perPage, 0), Math.min(this.page + perPage, this.resources.length - 1))),
        skeletonObserver: null
      };
    },

    computed: {
      firstRenderedResourceIndex() {
        return this.resources?.findIndex(resource => resource === this.resourcesToRender[0]);
      },

      lastRenderedResourceIndex() {
        return this.resources?.findIndex(resource => resource === this.resourcesToRender[this.resourcesToRender.length - 1]);
      },

      selectedIndex() {
        return this.page - this.firstRenderedResourceIndex - 1;
      },

      skeletonBefore() {
        return this.page > perPage;
      },

      skeletonAfter() {
        return this.lastRenderedResourceIndex < this.resources?.length - 1;
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

      if (this.skeletonBefore || this.skeletonAfter) {
        this.observeSkeleton();
      }

      window.addEventListener('resize', this.handleWindowResize);
    },

    destroyed() {
      window.removeEventListener('resize', this.handleWindowResize);
    },

    methods: {
      async handleWindowResize() {
        this.updateThumbnailScroll();
      },

      updateThumbnailScroll(behavior = 'smooth') {
        this.scrollElementToCentre(
          // + 1 to account for the skeleton li
          this.$refs.mediaThumbnailsList.children?.[this.firstRenderedResourceIndex > 0 ? this.selectedIndex + 1 : 0],
          {
            behavior,
            container: this.$refs.mediaThumbnailsContainer
          }
        );
      },

      observeSkeleton() {
        // Render all list items when IntersectionObserver not fully supported
        if (!('IntersectionObserver' in window) ||
          !('IntersectionObserverEntry' in window) ||
          !('isIntersecting' in window.IntersectionObserverEntry.prototype)) {
          this.resourcesToRender = this.resources;
        }

        this.skeletonObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach(async(entry) => {
              if (entry.isIntersecting) {
                if (entry.target === thumbnailSkeletonBefore) {
                  this.resourcesToRender = this.resources.slice(Math.max(this.firstRenderedResourceIndex - perPage, 0), this.firstRenderedResourceIndex).concat(this.resourcesToRender);
                }

                if (entry.target === thumbnailSkeletonAfter) {
                  this.resourcesToRender = this.resourcesToRender.concat(this.resources.slice(this.lastRenderedResourceIndex + 1, this.lastRenderedResourceIndex + perPage + 1));
                }

                await this.$nextTick();
                // refresh observing the list item to see if after pre/appending still intersecting (This can happen when scrolling fast and far)
                this.skeletonObserver.unobserve(entry.target);
                this.skeletonObserver.observe(entry.target);
              }
            });
          },
          { root: this.$refs.mediaThumbnailsContainer });

        const thumbnailSkeletonBefore = this.$refs.thumbnailSkeletonBefore;
        const thumbnailSkeletonAfter = this.$refs.thumbnailSkeletonAfter;

        if (thumbnailSkeletonBefore) {
          this.skeletonObserver.observe(thumbnailSkeletonBefore);
        }
        if (thumbnailSkeletonAfter) {
          this.skeletonObserver.observe(thumbnailSkeletonAfter);
        }
      },

      calculateSkeletonHeight(skeletonResources) {
        if (!skeletonResources.length) {
          return;
        }
        const skeletonHeight = skeletonResources.reduce((accumulatedHeight, resource) => {
          let imageHeight;
          if (resource.ebucoreHeight && resource.ebucoreWidth) {
            imageHeight = (resource.ebucoreHeight / resource.ebucoreWidth) * 176; // CSS width 11rem
          } else {
            imageHeight = 80; // CSS min-height 5rem
          }
          const renderedHeight = imageHeight < 480 ? imageHeight : 480;
          return accumulatedHeight + renderedHeight + 16; // add 16px margin
        }, 0);

        return `${skeletonHeight}px`;
      },

      calculateSkeletonWidth(skeletonResources) {
        if (!skeletonResources.length) {
          return;
        }
        const skeletonWidth = skeletonResources.reduce((accumulatedWidth, resource) => {
          const cssHeight = window.innerWidth < 768 ? 58 : 124; // CSS height bp-small 3.625rem, bp-medium 7.75rem
          let imageWidth;
          if (resource.ebucoreHeight && resource.ebucoreWidth) {
            imageWidth = (resource.ebucoreWidth / resource.ebucoreHeight) * cssHeight;
          } else {
            imageWidth = 48; // CSS min-width 3rem
          }
          const renderedWidth = imageWidth < 200 ? imageWidth : 200;
          return accumulatedWidth + renderedWidth + 16; // add 16px margin
        }, 0);

        return `${skeletonWidth}px`;
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

    .thumbnail-skeleton-before {
      width: var(--skeletonwidthbefore);

      @media (min-width: $bp-large) {
        width: auto;
        height: var(--skeletonheightbefore);
      }
    }

    .thumbnail-skeleton-after {
      width: var(--skeletonwidthafter);

      @media (min-width: $bp-large) {
        width: auto;
        height: var(--skeletonheightafter);
      }
    }

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
