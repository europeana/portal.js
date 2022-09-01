<template>
  <div data-qa="browse page">
    <slot />
    <b-container>
      <ContentHeader
        :title="name"
        :description="headline"
      />
      <BrowseSections
        :sections="hasPartCollection.items"
      />
    </b-container>
  </div>
</template>

<script>
  import ContentHeader from '../generic/ContentHeader';
  import BrowseSections from './BrowseSections';

  export default {
    components: {
      ContentHeader,
      BrowseSections
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
      hasPartCollection: {
        type: Object,
        default: null
      }
    }
  };
</script>
