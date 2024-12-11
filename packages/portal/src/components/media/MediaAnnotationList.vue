<template>
  <div>
    <b-container
      v-if="$fetchState.pending"
      data-qa="loading spinner container"
    >
      <b-row class="flex-md-row py-4 text-center">
        <b-col cols="12">
          <LoadingSpinner />
        </b-col>
      </b-row>
    </b-container>
    <ol
      v-else-if="annotationList.length"
      class="media-viewer-annotation-list list-group"
    >
      <li
        v-for="(anno, index) in annotationList"
        :key="index"
        ref="annotationListItems"
        :lang="anno.body.language"
        class="list-group-item list-group-item-action"
        :class="{ active: anno.id === activeAnnotation?.id, hover: anno.id === hoveredAnnotation?.id }"
      >
        <!--
          use replace, not push, so that the back button will leave the page,
          and e.g. go back to search results instead of through myriad
          previously selected annotations
        -->
        <NuxtLink
          :to="annotationLinkRoute(anno)"
          :replace="true"
        >
          <template
            v-if="searching"
          >
            {{ annotationSearchHitSelectorFor(anno.id).prefix }}<!--
            --><strong class="has-text-highlight">{{ annotationSearchHitSelectorFor(anno.id).exact }}</strong><!--
            -->{{ annotationSearchHitSelectorFor(anno.id).suffix }}
          </template>
          <template
            v-else
          >
            {{ anno.body.value }}
          </template>
        </NuxtLink>
      </li>
    </ol>
    <div
      role="status"
      :class="{ 'visually-hidden': !noResults || $fetchState.pending }"
    >
      <p
        class="px-3"
      >
        {{ noResults ? $t('noResults') : $t('searchHasLoaded', [totalResultsLocalised]) }}
      </p>
    </div>
  </div>
</template>

<script>
  import useItemMediaPresentation from '@/composables/itemMediaPresentation.js';
  import useScrollTo from '@/composables/scrollTo.js';
  import LoadingSpinner from '../generic/LoadingSpinner.vue';

  export default {
    name: 'MediaAnnotationList',

    components: {
      LoadingSpinner
    },

    inject: ['annotationScrollToContainerSelector'],

    props: {
      active: {
        type: Boolean,
        default: true
      },

      query: {
        type: String,
        default: null
      }
    },

    setup() {
      const {
        activeAnnotation,
        annotations,
        annotationSearchHitSelectorFor,
        annotationSearchResults,
        annotationUri,
        fetchCanvasAnnotations,
        hoveredAnnotation,
        pageForAnnotationTarget,
        searchAnnotations,
        setActiveAnnotation
      } = useItemMediaPresentation();
      const { scrollElementToCentre } = useScrollTo();

      return {
        activeAnnotation,
        annotations,
        annotationSearchHitSelectorFor,
        annotationSearchResults,
        annotationUri,
        fetchCanvasAnnotations,
        hoveredAnnotation,
        pageForAnnotationTarget,
        scrollElementToCentre,
        searchAnnotations,
        setActiveAnnotation
      };
    },

    // TODO: filter by motivation(s)
    async fetch() {
      if (!this.active) {
        return;
      }
      await Promise.all([
        this.fetchCanvasAnnotations(),
        this.searching ? this.searchAnnotations(this.query) : null
      ]);
      this.setActiveAnnotationFromRouteQuery();

      this.$emit('fetched', this.annotations.length);
    },

    computed: {
      annotationList() {
        return this.searching ? this.annotationSearchResults : this.annotations;
      },

      searching() {
        return !!this.query;
      },

      noResults() {
        return this.query && (this.annotationList?.length || 0) === 0;
      },

      totalResultsLocalised() {
        return this.$i18n.n(this.annotationList.length);
      }
    },

    watch: {
      activeAnnotation: {
        deep: true,
        handler() {
          this.scrollActiveAnnotationToCentre();
        }
      },
      annotationUri() {
        this.searching ? this.fetchCanvasAnnotations() : this.$fetch();
      },
      '$route.hash'() {
        this.scrollActiveAnnotationToCentre('instant');
      },
      '$route.query.anno'() {
        this.setActiveAnnotationFromRouteQuery();
      },
      query() {
        this.searching && this.$fetch();
      }
    },

    methods: {
      // TODO: md5 the anno param to prevent the url getting too long?
      annotationLinkRoute(anno) {
        return {
          ...this.$route,
          query: {
            ...this.$route.query,
            anno: anno?.id,
            page: this.pageForAnnotationTarget(anno?.target) || this.$route.query.page
          }
        };
      },

      async scrollActiveAnnotationToCentre(behavior = 'smooth') {
        if (!this.active || !this.activeAnnotation) {
          return;
        }
        await this.$nextTick();

        if (this.activeAnnotation && this.annotationScrollToContainerSelector && this.$refs.annotationListItems) {
          const elementIndex = this.annotationList.findIndex((listItem) => listItem.id === this.activeAnnotation.id);
          this.scrollElementToCentre(
            this.$refs.annotationListItems[elementIndex],
            {
              behavior,
              container: document.querySelector(this.annotationScrollToContainerSelector)
            }
          );
        }
      },

      setActiveAnnotationFromRouteQuery() {
        if (!this.$route.query.anno) {
          this.setActiveAnnotation(null);
          return;
        }
        if (this.$route.query.anno !== this.activeAnnotation?.id) {
          const activeAnnotation = this.annotations.find((anno) => anno.id === this.$route.query.anno) || this.annotationSearchResults.find((anno) => anno.id === this.$route.query.anno);
          this.setActiveAnnotation(activeAnnotation || null);
        }
        this.$nextTick(() => {
          process.client && this.scrollActiveAnnotationToCentre('instant');
        });
      }
    }
  };
</script>

<style lang="scss">
  @import '@europeana/style/scss/variables';

  .media-viewer-annotation-list {
    background-color: $white;

    .list-group-item {
      border-radius: 0;
      border: none;
      border-top: 1px solid $middlegrey;

      &:last-child {
        border-bottom: 1px solid $middlegrey;
      }

      &:hover {
        background-color: transparent;
      }

      &.hover {
        border: 1px solid $mediumgrey;
      }

      &.active {
        background-color: transparent;
        border: 1px solid $blue;
      }

      a {
        color: $mediumgrey;
        text-decoration: none;
        font-size: $font-size-small;

        &:hover {
          color: $blue;
        }
      }

    }
  }
</style>
