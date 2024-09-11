<template>
  <div
    class="p-2"
  >
    <h2>Thumbnails</h2>
    <div
      class="d-flex overflow-auto"
    >
      <img
        v-for="(image, index) in thumbnails"
        :key="index"
        class="d-flex-inline mr-2"
        :src="image.id"
        @click="$emit('clickThumbnail', index)"
      >
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ItemMediaThumbnails',

    props: {
      thumbnails: {
        type: Array,
        required: true
      }
    }
  };
</script>
