<template>
  <div class="page white-page xxl-page">
    <b-container>
      <ContentHeader
        :title="pageMeta.title"
        :description="pageMeta.description"
        :media-url="pageMeta.ogImage"
        button-variant="secondary"
        class="half-col"
      />
      <b-row class="flex-md-row pb-5">
        <b-col cols="12">
          <b-card-group
            class="card-deck-4-cols"
            deck
            data-qa="hub page card group"
          >
            <ContentCard
              v-for="(item, index) in items"
              :key="item.identifier || item.slug"
              :title="item.name || item.title"
              :url="{ name: cardUrlName, params: { pathMatch: item.identifier || item.slug, exhibition: item.identifier } }"
              :image-url="item.thumbnail || imageUrl(item.primaryImageOfPage)"
              :image-content-type="imageContentType(item.primaryImageOfPage)"
              :image-optimisation-options="{ width: 510 }"
              :image-alt="imageAlt(item.primaryImageOfPage)"
              :texts="[item.description]"
              :offset="index"
              :lazy="index >= 4"
            />
          </b-card-group>
        </b-col>
      </b-row>
      <b-row v-if="total > perPage">
        <b-col>
          <PaginationNavInput
            :total-results="total"
            :per-page="perPage"
          />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  import ContentHeader from '@/components/content/ContentHeader';
  import ContentCard from '@/components/content/ContentCard';
  import PaginationNavInput from '@/components/generic/PaginationNavInput';

  export default {
    name: 'ContentHubPage',

    components: {
      ContentHeader,
      ContentCard,
      PaginationNavInput
    },

    props: {
      pageMeta: {
        type: Object,
        default: null
      },
      items: {
        type: Array,
        default: () => []
      },
      perPage: {
        type: Number,
        default: null
      },
      total: {
        type: Number,
        default: null
      },
      cardUrlName: {
        type: String,
        default: null
      }
    },

    methods: {
      imageUrl(image) {
        return image?.image?.url;
      },
      imageContentType(image) {
        return image?.image?.contentType;
      },
      imageAlt(image) {
        return image?.image?.description || '';
      }
    }
  };
  </script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .page {
    padding-bottom: 1rem;
    padding-top: 1rem;
    margin-top: -1rem;

    @media (min-width: $bp-4k) {
      padding-bottom: 1.5rem;
      padding-top: 1.5rem;
      margin-top: -1.5rem;
    }
  }
</style>
