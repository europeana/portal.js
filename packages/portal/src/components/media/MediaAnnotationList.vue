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
    <!-- TODO: consider what the best markup is for these annotations, for UX and a11y -->
    <b-list-group
      v-else
      class="iiif-annotation-list"
    >
      <b-list-group-item
        v-for="(anno, index) in annotationList"
        :key="index"
        ref="annotationListItems"
        :action="true"
        :active="anno.id === activeAnnotation?.id"
        :lang="anno.body.language"
        @click="handleClickListItem(anno)"
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
      </b-list-group-item>
    </b-list-group>
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

      await (this.searching ? this.searchAnnotations(`"${this.query}"`) : this.fetchCanvasAnnotations());

      if (this.$route.query.anno) {
        this.setActiveAnnotation(this.annotationList.find((anno) => anno.id === this.$route.query.anno) || null);
        process.client && this.scrollActiveAnnotationToCentre('instant');
      }
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
      query() {
        this.searching && this.$fetch();
      }
    },

    methods: {
      handleClickListItem(anno) {
        this.setActiveAnnotation(anno);
        this.updateAnnoRoute();
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

      updateAnnoRoute() {
        let page = null;
        let anno = null;
        if (this.activeAnnotation) {
          // store the annotation id in the route, to pre-highlight it on page reload
          // TODO: md5 this to prevent the url getting too long?
          anno = this.activeAnnotation.id;
          page = this.pageForAnnotationTarget(this.activeAnnotation.target);
        }

        // use replace, not push, so that the back button will leave the page,
        // and e.g. go back to search results instead of through myriad
        // previously selected annotations
        this.$router.replace({ ...this.$route, query: { ...this.$route.query, anno, page } });
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .iiif-annotation-list {
    background-color: $white;

    .list-group-item-action {
      cursor: pointer;
    }
  }
</style>
