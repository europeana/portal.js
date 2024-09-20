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
        :lang="anno.lang"
        @click="onClickAnnotation(anno)"
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
      /**
       * Annotation page/list: either a URI as a string, or an object with id
       * property being the URI
       * TODO: rename
       */
      anno: {
        type: [Object, String],
        required: true
      },

      target: {
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
        annotations: null,
        textGranularity: this.anno.textGranularity,
        uri: typeof this.anno === 'string' ? this.anno : this.anno.id
      };
    },

    // TODO: filter by motivation(s)
    async fetch() {
      if (this.uri) {
        const annotations = await (new EuropeanaMediaAnnotations({
          id: this.uri,
          textGranularity: this.textGranularity
        })).fetch();

        const annotationsFor = annotations.for(this.target);
        await Promise.all(annotationsFor.map((anno) => anno.embedBodies()));

        this.annotations = annotationsFor.map((anno) => {
          const data = {
            id: anno.id, // adds to size of data; use index instead?
            value: anno.body.value,
            lang: anno.body.language
          };

          if (anno.target.startsWith('#')) {
            const fragment = new URLSearchParams(anno.target.slice(1));
            const xywhSelector = fragment.get('xywh');
            if (xywhSelector) {
              [data.x, data.y, data.w, data.h] = xywhSelector.split(',');
            }
          }

          return data;
        });
      } else {
        // TODO: what to do!?
      }
    },

    watch: {
      // TODO: when will it change though?
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
