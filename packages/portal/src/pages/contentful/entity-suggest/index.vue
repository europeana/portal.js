<template>
  <ContentfulSuggestField
    :suggester="suggestEntities"
    :resolver="findEntities"
    :labeller="labelEntity"
    placeholder="Search for topics, centuries, organisations, people and places"
  />
</template>

<script>
  import ContentfulSuggestField from '@/components/contentful/ContentfulSuggestField';

  export default {
    name: 'ContentfulEntitySuggestPage',

    components: {
      ContentfulSuggestField
    },

    layout: 'contentful',

    head() {
      return {
        title: 'Entity suggest - Contentful app'
      };
    },

    watch: {
      value: 'updateContentfulField'
    },

    methods: {
      suggestEntities(val) {
        return this.$apis.entity.suggest(val, { type: 'agent,concept,timespan,organization,place' });
      },

      findEntities(val) {
        return this.$apis.entity.find(val);
      },

      labelEntity(val) {
        return val.prefLabel.en || val.hiddenLabel.en;
      }
    }
  };
</script>

<style lang="scss" scoped>
  .contentful {
    button {
      margin-right: 1rem;
    }
  }
</style>
