<template>
  <div>
    <ItemPreviewSlide />
    <ItemPreviewSlide
      variant="zoom-out"
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
