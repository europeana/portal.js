<template>
  <div>
    <h1>Discover Europeana's Collections</h1>
    <h2>1. 100 viewport width, no effect (link and user buttons)</h2>
    <ItemPreviewSlide />
    <h2>2. Zoom out to 100% height (link and user buttons)</h2>
    <ItemPreviewSlide
      variant="zoom-out"
    />
    <h2>3. scrollable image (link and user buttons)</h2>
    <ItemPreviewSlide
      variant="scroll"
    />
    <h2>4. Parallax with overlay (link and user buttons)</h2>
    <ItemPreviewSlide
      background="true"
    />
  </div>
</template>

<script>
  import ItemPreviewSlide from '@/components/item/ItemPreviewSlide';

  export default {
    components: {
      ItemPreviewSlide
    }
  };

</script>
