<template>
  <ContentfulSuggestField
    :suggester="suggestSets"
    :resolver="findSets"
    :labeller="labelSet"
    placeholder="Search for published user galleries"
  />
</template>

<script>
  import ContentfulSuggestField from '@/components/contentful/ContentfulSuggestField';

  export default {
    name: 'ContentfulSetSuggestPage',

    components: {
      ContentfulSuggestField
    },

    layout: 'contentful',

    head() {
      return {
        title: 'Set suggest - Contentful app'
      };
    },

    methods: {
      async suggestSets(val) {
        const response = await this.$apis.set.search({
          query: val, qf: 'visibility:published', profile: 'items.meta'
        });
        return response.items || [];
      },

      findSets(val) {
        // TODO: this is very inefficient, requiring a GET request for each
        //       linked set, but the Set API does not yet support searching
        //       by multiple IDs combined with OR. refactor when the API
        //       supports searching by multiple IDs.
        return Promise.all(val.map((id) => this.$apis.set.get(id, { profile: 'items' })));
      },

      labelSet(val) {
        return val.title.en || Object.values(val.title)[0];
      }
    }
  };
</script>
