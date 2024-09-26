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
  import EuropeanaMediaAnnotationList from '@/utils/europeana/media/AnnotationList.js';
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

      const list = new EuropeanaMediaAnnotationList(this.annotationUri);
      await list.fetch({ params: { textGranularity } });
      const annos = list.annotationsForTarget(this.resourceUri);

      // NOTE: this may result in duplicate network requests for the same body resource
      //       if there are multiple external annotations with the same resource URL,
      //       e.g. with just a different hash char selector.
      //       we use an axios caching interceptor to alleviate this.
      await Promise.all(annos.map((anno) => anno.embedBodies()));

      for (const anno of annos) {
        if (Array.isArray(anno.body)) {
          anno.body = anno.body[0];
        }
      }

      this.annotations = Object.freeze(annos);
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
