<template>
  <div>
    <b-list-group
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
  export default {
    name: 'MediaAnnotationList',

    props: {
      /**
       * Individual annotations
       */
      annotations: {
        type: Array,
        required: true
      }
    },

    data() {
      return {
        activeAnnotation: null
      };
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
