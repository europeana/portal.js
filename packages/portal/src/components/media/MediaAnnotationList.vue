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
      v-else
      class="iiif-annotation-list list-group"
    >
      <li
        v-for="(anno, index) in annotationList"
        :key="index"
        ref="annotationListItems"
        :lang="anno.body.language"
        class="list-group-item list-group-item-action"
        :class="{ active: anno.id === activeAnnotation?.id }"
        data-qa="annotation list item"
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

      await Promise.all([this.fetchCanvasAnnotations()].join(this.searching ? this.searchAnnotations(`"${this.query}"`) : null));

      this.setActiveAnnotationFromRouteQuery();

      this.$emit('fetched', this.annotations.length);
    },

    computed: {
      annotationList() {
        return this.searching ? this.annotationSearchResults : this.annotations;
      },

      searching() {
        return !!this.query;
      }
    },

    watch: {
      activeAnnotation: {
        deep: true,
        handler() {
          this.scrollActiveAnnotationToCentre();
        }
      },
      // TODO: should this watcher go into useItemMediaPresentation?
      annotationUri() {
        !this.searching && this.$fetch();
      },
      '$route.hash'() {
        this.scrollActiveAnnotationToCentre();
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
            anno: anno.id,
            page: this.pageForAnnotationTarget(anno.target)
          }
        };
      },

      async scrollActiveAnnotationToCentre(behavior = 'smooth') {
        if (!this.active) {
          return;
        }
        await this.$nextTick();

        if (this.activeAnnotation && this.annotationScrollToContainerSelector && this.$refs.annotationListItems) {
          this.scrollElementToCentre(
            this.$refs.annotationListItems[this.annotationList.indexOf(this.activeAnnotation)],
            {
              behavior,
              container: document.querySelector(this.annotationScrollToContainerSelector)
            }
          );
        }
      },

      setActiveAnnotationFromRouteQuery() {
        if (this.$route.query.anno) {
          this.setActiveAnnotation(this.annotationList.find((anno) => anno.id === this.$route.query.anno) || null);
          process.client && this.scrollActiveAnnotationToCentre('instant');
        }
      }
    }
  };
</script>

<style lang="scss">
  @import '@europeana/style/scss/variables';

  .iiif-annotation-list {
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
