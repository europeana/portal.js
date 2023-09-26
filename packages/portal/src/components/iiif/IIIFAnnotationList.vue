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
        :active="activeAnnotation === anno['@id']"
        @click="onClickAnnotation(anno)"
      >
        {{ anno.resource.value }}
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
  import axios from 'axios';
  import uniq from 'lodash/uniq';

  import EuropeanaIIIFPresentation from '@europeana/iiif/src/presentation/index.js';
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
        annotations: null,
        annotationPage: null
      };
    },

    // TODO: filter by motivation(s)
    async fetch() {
      this.annotationPage = await EuropeanaIIIFPresentation.fetch(this.uri);

      this.annotations = await this.dereferenceAnnotations(this.annotationPage.annotations);
    },

    watch: {
      uri: '$fetch'
    },

    methods: {
      // TODO: mv into @europeana/iiif/presentation
      async dereferenceAnnotations(annotations) {
        const resourceUrls = uniq(annotations.map((anno) => {
          const resourceUrl = new URL(anno.resource['@id']);
          resourceUrl.hash = '';
          return resourceUrl.toString();
        }));
        const annotationResourceResponses = await Promise.all(resourceUrls.map((resourceUrl) => axios.get(resourceUrl)));

        for (const annoResourceResponse of annotationResourceResponses) {
          const annoResourceData = annoResourceResponse.data;
          if (annoResourceData.type === 'FullTextResource') {
            for (const anno of annotations) {
              const resourceUrl = new URL(anno.resource['@id']);
              if (resourceUrl.toString().startsWith(annoResourceData.id)) {
                for (const annoResourceProperty in annoResourceData) {
                  if ((annoResourceProperty === 'value') && resourceUrl.hash.startsWith('#char=')) {
                    const charMatch = resourceUrl.hash.match(/^#char=(\d+),(\d+)$/);
                    anno.resource[annoResourceProperty] = annoResourceData[annoResourceProperty].slice(
                      Number(charMatch[1]), Number(charMatch[2]) + 1
                    );
                  } else if (!['id', '@id'].includes(annoResourceProperty)) {
                    anno.resource[annoResourceProperty] = annoResourceData[annoResourceProperty];
                  }
                }
              }
            }
          }
        }

        return annotations;
      },

      onClickAnnotation(anno) {
        this.activeAnnotation = anno['@id'];
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
