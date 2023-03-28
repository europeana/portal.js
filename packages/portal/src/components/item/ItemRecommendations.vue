<template>
  <b-row
    v-if="!$fetchState.pending && !$fetchState.error && items.length > 0"
    class="mb-3 justify-content-center"
  >
    <b-col
      cols="12"
      class="col-lg-10"
    >
      <h2
        class="related-heading text-uppercase mb-2"
      >
        {{ $t('record.exploreMore') }}
      </h2>
      <ItemPreviewCardGroup
        :items="items"
        view="explore"
        class="mb-0"
        data-qa="similar items"
      />
    </b-col>
  </b-row>
</template>

<script>
  import ItemPreviewCardGroup from '@/components/item/ItemPreviewCardGroup';

  export default {
    name: 'ItemRecommendations',

    components: {
      ItemPreviewCardGroup
    },

    props: {
      identifier: {
        type: String,
        required: true
      }
    },

    data() {
      return {
        items: []
      };
    },

    async fetch() {
      const response = await this.$apis.recommendation.recommend('record', this.identifier);

      response.items = response.items
        // Remove any recommendations that are the same as the active item,
        // because the Recommendation API/Engine is broken.
        // TODO: remove if/when recommendations become useful.
        .filter((item) => item.id !== this.identifier)
        .slice(0, 8);

      this.items = response.items;
    }
  };
</script>
