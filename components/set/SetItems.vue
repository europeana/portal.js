<template>
  <!-- TODO: this is very similar to ../search/SearchResults; refactor to DRY -->
  <b-container class="px-0">
    <b-row class="mb-3">
      <b-col cols="12">
        <b-card-group
          class="masonry"
          deck
        >
          <ItemPreviewCard
            v-for="item in items"
            :key="item.europeanaId"
            :dc-creator="item.dcCreator"
            :dc-description="item.dcDescription"
            :dc-title="item.dcTitle"
            :edm-data-provider="item.edmDataProvider"
            :edm-preview="item.edmPreview"
            :europeana-id="item.europeanaId"
            :selector="item.selector"
            data-qa="set item"
          />
        </b-card-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <client-only>
          <PaginationNav
            v-model="page"
            :total-results="total"
            :per-page="pageSize"
          />
        </client-only>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import ClientOnly from 'vue-client-only';

  import ItemPreviewCard from '../item/ItemPreviewCard';

  export default {
    name: 'SetItems',
    components: {
      ClientOnly,
      ItemPreviewCard,
      PaginationNav: () => import('../generic/PaginationNav')
    },
    props: {
      items: {
        type: Array,
        default: () => []
      },
      total: {
        type: Number,
        default: 0
      },
      page: {
        type: Number,
        default: 1
      },
      pageSize: {
        type: Number,
        default: 24
      }
    }
  };
</script>
