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
        class="d-flex flex-row flex-lg-column pl-0 mb-0"
      >
        <li
          v-if="skeletonBefore"
          ref="thumbnailSkeletonBefore"
          class="thumbnail-skeleton-before"
          :style="{
            '--skeletonheightbefore': calculateSkeletonHeight(resources.slice(0, firstRenderedResourceIndex)),
            '--skeletonwidthbefore': calculateSkeletonWidth(resources.slice(0, firstRenderedResourceIndex))
          }"
          data-qa="item media thumbnail skeleton before"
        />

        <!-- The ref array does not guarantee the same order as the source array. This causes issues when prepending resources.
       Workaround: Read list elements from the list parent's children to get them at the actual rendered index. -->
        <!-- Unique key for each resource to prevent prepended resources reusing existing elements and causing jumpiness -->
        <li
          v-for="(resource, index) in resourcesToRender"
          :key="resource.id"
          :aria-setsize="resources.length"
          :aria-posinset="firstRenderedResourceIndex + index + 1"
        >
          <ItemMediaThumbnail
            :offset="firstRenderedResourceIndex + index"
            class="d-flex-inline mr-3 mr-lg-auto"
            :class="{ 'selected': index === selectedIndex }"
            :resource="resource"
            :edm-type="edmType"
            :lazy="true"
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
          data-qa="item media thumbnail skeleton after"
        />
      </ol>
    </div>
  </transition>
</template>

<script>
  import useItemMediaPresentation from '@/composables/itemMediaPresentation.js';
  import useScrollTo from '@/composables/scrollTo.js';
  import ItemMediaThumbnail from './ItemMediaThumbnail.vue';

  const perPage = 5;

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
      const { scrollElementToCentre } = useScrollTo();
      return {  page, resources, scrollElementToCentre };
    },

    data() {
      return {
        resourcesToRender: null,
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
      },

      resources: {
        deep: true,
        handler() {
          this.initResourcesToRender();
        }
      }
    },

    created() {
      this.initResourcesToRender();
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
      handleWindowResize() {
        this.updateThumbnailScroll();
      },

      initResourcesToRender() {
        if (this.resources) {
          this.resourcesToRender = this.page <= perPage ? this.resources.slice(0, perPage) :
            this.resources.slice(Math.max(this.page - perPage, 0), Math.min(this.page + perPage, this.resources.length));
        } else {
          this.resourcesToRender = null;
        }
      },

      updateThumbnailScroll(behavior = 'smooth') {
        this.scrollElementToCentre(
          // + 1 to account for the skeleton li
          this.$refs.mediaThumbnailsList.children?.[this.skeletonBefore ? this.selectedIndex + 1 : this.selectedIndex],
          {
            behavior,
            container: this.$refs.mediaThumbnailsContainer
          }
        );
      },

      observeSkeleton() {
        // Render all list items when IntersectionObserver not fully supported
        if (!('IntersectionObserver' in window) ||
          !('IntersectionObserverEntry' in window)) {
          this.resourcesToRender = this.resources;
          return;
        }

        this.skeletonObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach(async(entry) => {
              // intersectionRatio is supported by older browsers, isIntersecting is not always
              if (entry.isIntersecting || entry.intersectionRatio > 0) {
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
          { root: this.$refs.mediaThumbnailsContainer }
        );

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

        return `${Math.round(skeletonHeight)}px`;
      },

      calculateSkeletonWidth(skeletonResources) {
        const skeletonWidth = skeletonResources.reduce((accumulatedWidth, resource) => {
          let imageWidth;
          if (resource.ebucoreHeight && resource.ebucoreWidth) {
            imageWidth = (resource.ebucoreWidth / resource.ebucoreHeight) * 124; // CSS height 7.75rem
          } else {
            imageWidth = 48; // CSS min-width 3rem
          }
          const renderedWidth = imageWidth < 200 ? imageWidth : 200;
          return accumulatedWidth + renderedWidth + 16; // add 16px margin
        }, 0);

        return `${Math.round(skeletonWidth)}px`;
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
      bottom: 3.25rem;
      z-index: 1;
      overflow-x: hidden;
      overflow-y: auto;
      padding: 1rem;
      width: 13rem;
    }
  }
</style>
