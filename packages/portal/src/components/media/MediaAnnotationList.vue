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
        :lang="anno.lang"
        @click="selectAnno(anno)"
      >
        {{ anno.value }}
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
  import EuropeanaMediaAnnotations from '@/utils/europeana/media/annotations.js';
  import LoadingSpinner from '../generic/LoadingSpinner.vue';

  export default {
    name: 'MediaAnnotationList',

    components: {
      LoadingSpinner
    },

    props: {
      annotationUri: {
        type: String,
        default: null
      },
      resourceUri: {
        type: String,
        default: null
      },
      textGranularity: {
        type: Array, String,
        default: null
      }
    },

    data() {
      return {
        activeAnnotation: null,
        annotations: null
      };
    },

    // TODO: filter by motivation(s)
    async fetch() {
      this.activeAnnotation = null;
      if (!this.annotationUri || !this.resourceUri) {
        return;
      }

      const textGranularity = [].concat(this.textGranularity).includes('line') ? 'line' : this.textGranularity[0];

      const annos = new EuropeanaMediaAnnotations(this.annotationUri);
      await annos.fetch({ params: { textGranularity } });
      this.annotations = Object.freeze(await annos.for(this.resourceUri, { embed: true, reduce: true }));
    },

    watch: {
      annotationUri: '$fetch'
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
