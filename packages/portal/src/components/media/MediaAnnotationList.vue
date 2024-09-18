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
    <b-list-group
      v-else-if="annotations"
      class="iiif-annotation-list"
    >
      <b-list-group-item
        v-for="(anno, index) in annotations"
        :key="index"
        :action="true"
        :active="activeAnnotation === anno.id"
        @click="onClickAnnotation(anno)"
      >
        {{ anno.body.value }}
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
  import axios from 'axios';
  import LoadingSpinner from '../generic/LoadingSpinner.vue';

  export default {
    name: 'MediaAnnotationList',

    components: {
      LoadingSpinner
    },

    props: {
      /**
       * URI of the annotation page/list
       */
      uri: {
        type: String,
        required: true
      }
    },

    data() {
      return {
        activeAnnotation: null,
        /**
         * Individual annotations
         */
        annotations: null
      };
    },

    // TODO: filter by motivation(s)
    async fetch() {
      // TODO: req in format 3 for europeana domain
      // TODO: mv fetch & normalize to another utility class, as w/ presentation
      const annotationPage = (await axios.get(this.uri)).data;
      console.log('annotationPage', annotationPage);

      // await annotationPage.deferenceAnnotations();

      // this.annotations = annotationPage.annotations;
    },

    watch: {
      uri: '$fetch'
    },

    methods: {
      onClickAnnotation(anno) {
        this.activeAnnotation = anno.id;
        this.$emit('clickAnno', anno);
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
