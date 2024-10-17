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
        :action="true"
        :active="anno.id === activeAnnotation?.id"
        :lang="anno.body.language"
        @click="handleClickListItem(anno)"
      >
        {{ anno.body.value }}
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
  import useItemMediaPresentation from '@/composables/itemMediaPresentation.js';
  import LoadingSpinner from '../generic/LoadingSpinner.vue';

  export default {
    name: 'MediaAnnotationList',

    components: {
      LoadingSpinner
    },

    props: {
      query: {
        type: String,
        default: null
      }
    },

    setup() {
      const {
        annotations,
        annotationSearchResults,
        activeAnnotation,
        annotationUri,
        fetchCanvasAnnotations,
        pageForAnnotationTarget,
        searchAnnotations,
        selectAnnotation
      } = useItemMediaPresentation();

      return {
        annotations,
        annotationSearchResults,
        annotationUri,
        activeAnnotation,
        fetchCanvasAnnotations,
        pageForAnnotationTarget,
        searchAnnotations,
        selectAnnotation
      };
    },

    // TODO: filter by motivation(s)
    // TODO: prevent re-fetching if the page/query/whatever hasn't changed but
    //       the component has been hidden/shown/whatever in the meantime,
    //       i.e. in the itemMediaPresentation composable
    async fetch() {
      await (this.searching ? this.searchAnnotations(this.query) : this.fetchCanvasAnnotations());

      if (this.$route.query.anno) {
        this.selectAnnotation(this.$route.query.anno);
        // TODO: would be nice to scroll to the active annotation, but that is
        //       made awkward by the scrollbar being on the ancestor sidebar component...
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
      // TODO: should this watcher go into useItemMediaPresentation?
      annotationUri() {
        !this.searching && this.$fetch();
      },
      query() {
        this.searching && this.$fetch();
      }
    },

    methods: {
      handleClickListItem(anno) {
        this.selectAnnotation(anno);
        this.updateAnnoRoute();
      },

      updateAnnoRoute() {
        let page = null;
        let anno = null;
        if (this.activeAnnotation) {
          // store the annotation id in the route, to pre-highlight it on page reload
          // TODO: md5 this else the url will too long
          anno = this.activeAnnotation.id;
          page = this.pageForAnnotationTarget(this.activeAnnotation.target);
        }

        this.$router.push({ ...this.$route, query: { ...this.$route.query, anno, page } });
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
