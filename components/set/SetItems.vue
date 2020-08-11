<template>
  <b-container>
    <b-row class="flex-md-row mt-3 pb-5">
      <b-col cols="12">
        <b-card-group
          class="masonry"
          deck
        >
          <ContentCard
            v-for="result in items"
            :key="result.europeanaId"
            :title="result.dcTitle || result.dcDescription"
            :url="{ name: 'item-all', params: { pathMatch: result.europeanaId.slice(1) } }"
            :image-url="result.edmPreview"
            :texts="cardTexts(result)"
            :limit-values-within-each-text="3"
            :omit-all-uris="true"
            :blank-image-height="280"
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
            :limit="pageSize"
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

  import ContentCard from '../generic/ContentCard';

  export default {
    name: 'SetItems',
    components: {
      ClientOnly,
      ContentCard,
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
    },
    methods: {
      cardTexts(result) {
        const texts = [result.edmDataProvider];

        if (result.dcCreator) texts.unshift(result.dcCreator);

        return texts;
      }
    }
  };
</script>
