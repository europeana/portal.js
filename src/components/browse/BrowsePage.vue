<template>
  <div data-qa="browse page">
    <slot />
    <HeroHeader
      v-if="heroImage"
      :hero-image="heroImage"
      :title="heroTitle"
      :description="heroDescription"
      :cta="heroCta"
    />
    <b-container>
      <ContentHeader
        v-if="!hero"
        :title="name"
        :description="headline"
      />
      <BrowseSections :sections="hasPartCollection.items" />
      <ItemPreviewSlide
        :item="item"
        variant="parallax"
      />
    </b-container>
  </div>
</template>

<script>
  import ContentHeader from '../generic/ContentHeader';
  import BrowseSections from '../browse/BrowseSections';
  import HeroHeader from '../browse/HeroHeader';
  import ItemPreviewSlide from '@/components/item/ItemPreviewSlide';

  export default {
    components: {
      ContentHeader,
      BrowseSections,
      HeroHeader,
      ItemPreviewSlide
    },
    props: {
      name: {
        type: String,
        default: null
      },
      headline: {
        type: String,
        default: null
      },
      description: {
        type: String,
        default: null
      },
      hasPartCollection: {
        type: Object,
        default: null
      },
      hero: {
        type: Object,
        default: null
      },
      heroImage: {
        type: Object,
        default: null
      }
    },

    async fetch() {
      let randomItem;
      // let randomIndex = Math.floor(Math.random() * testItems.length);
      // randomItem = testItems[randomIndex];
      await this.$apis.record.search({
        qf: 'contentTier:4',
        rows: 1,
        facet: {
          'TYPE': 'IMAGE',
          'MIME_TYPE': 'image/jpeg',
          'IMAGE_SIZE': ['MEDIUM', 'LARGE', 'EXTRA_LARGE']
        },
        sort: 'random'
      })
        .then(response => {
          randomItem = response.items[0].id;
        })
        .catch(error => {
          return { error: error.message };
        });

      return this.$apis.record
        .getRecord(randomItem)
        .then(result => {
          return this.item = result.record;
        })
        .catch(error => {
          return { error: error.message };
        });
    },

    data() {
      return {
        item: {}
      };
    },

    computed: {
      heroCta() {
        return this.hero?.link || null;
      },
      heroTitle() {
        return this.hero?.title || null;
      },
      heroDescription() {
        return this.hero?.headline || null;
      }
    }
  };
</script>
