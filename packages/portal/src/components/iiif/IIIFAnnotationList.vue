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
  import IIIFFactory from '@europeana/iiif/src/index.js';
  import LoadingSpinner from '@/components/generic/LoadingSpinner';

  export default {
    name: 'IIIFAnnotationList',

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
      const annotationPage = await IIIFFactory.fetch(this.uri);

      await annotationPage.deferenceAnnotations?.();

      this.annotations = annotationPage.annotations;
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
