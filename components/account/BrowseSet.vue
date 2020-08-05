<template>
  <div>
    <b-row class="flex-md-row mt-3 pb-5">
      <b-col cols="12">
        <b-card-group
          class="masonry"
          deck
          data-qa="gallery items"
        >
          <client-only>
            <ContentCard
              v-for="result in items"
              :key="result.europeanaId"
              :title="result.dcTitle || result.dcDescription"
              :url="{ name: 'item-all', params: { pathMatch: result.europeanaId.slice(1) } }"
              :image-url="result.edmPreview"
              :texts="cardTexts(result)"
              data-qa="search result"
              :limit-values-within-each-text="3"
              :omit-all-uris="true"
              :blank-image-height="280"
            />
          </client-only>
        </b-card-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <client-only>
          <PaginationNav
            v-if="showPagination"
            v-model="page"
            :limit="pageSize"
            :total-results="total"
            :per-page="pageSize"
            :link-gen="paginationLink"
          />
        </client-only>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  import ClientOnly from 'vue-client-only';

  export default {
    name: 'BrowseSet',
    components: {
      ClientOnly,
      ContentCard: () => import('../generic/ContentCard'),
      PaginationNav: () => import('../generic/PaginationNav')
    },
    props: {
      setId: {
        type: String,
        default: () => ''
      },
      items: {
        type: Array,
        default: () => []
      },
      total: {
        type: Number,
        default: () => 0
      },
      page: {
        type: Number,
        default: () => 1
      },
      pageSize: {
        type: Number,
        default: () => 24
      }
    },
    computed: {
      showPagination() {
        return this.total > this.pageSize;
      }
    },
    methods: {
      paginationLink(val) {
        return this.$route.path + '?page=' + val;
      },
      cardTexts(result, variant) {
        const texts = [result.edmDataProvider];
        if (result.dcCreator) texts.unshift(result.dcCreator);
        if (variant === 'list') {
          if (!result.selector && result.dcDescription) texts.unshift(result.dcDescription);
        }
        return texts;
      }
    }
  };
</script>
