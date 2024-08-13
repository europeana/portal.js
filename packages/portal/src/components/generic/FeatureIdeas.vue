<template>
  <div>
    <template v-if="features?.length">
      <ContentCard
        v-for="feature, i in features"
        :key="i"
        :title="feature.name"
        :texts="[feature.text]"
        :image-url="feature.image.image.url"
        :image-content-type="feature.image.image.contentType"
        :image-width="feature.image.image.width"
        :image-height="feature.image.image.height"
        variant="list"
      />
    </template>
  </div>
</template>

<script>
  import ContentCard from '@/components/content/ContentCard';

  export default {
    name: 'FeatureIdeas',

    components: {
      ContentCard
    },

    props: {
      features: {
        type: Array,
        default: () => []
      }
    }
  };
</script>
