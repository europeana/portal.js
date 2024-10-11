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
        v-for="(anno, index) in annotations"
        :key="index"
        :action="true"
        :active="activeAnnotation === anno.id"
        :lang="anno.body.language"
        @click="selectAnno(anno)"
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

    // TODO: support supplying annotations as a prop, e.g. from search results.
    //       if not present, then use the composable's fetchAnnotations
    props: {
      uri: {
        type: String,
        default: null
      }
    },

    setup() {
      const { annotations, annotationUri, fetchAnnotations } = useItemMediaPresentation();
      return { annotations, annotationUri, fetchAnnotations };
    },

    data() {
      return {
        activeAnnotation: null
      };
    },

    // TODO: filter by motivation(s)
    async fetch() {
      this.activeAnnotation = null;
      await this.fetchAnnotations(this.uri || this.annotationUri);
    },

    watch: {
      // TODO: should this watcher go into useItemMediaPresentation?
      annotationUri: '$fetch',
      uri: '$fetch'
    },

    methods: {
      selectAnno(anno) {
        this.activeAnnotation = anno.id;
        this.$emit('selectAnno', anno);
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
