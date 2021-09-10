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
      <ItemPreviewSlide />
      <BrowseSections :sections="hasPartCollection.items" />
    </b-container>
  </div>
</template>

<script>
  import ContentHeader from '../generic/ContentHeader';
  import BrowseSections from '../browse/BrowseSections';
  import HeroHeader from '../browse/HeroHeader';
  import ItemPreviewSlide from '../item/ItemPreviewSlide';

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
