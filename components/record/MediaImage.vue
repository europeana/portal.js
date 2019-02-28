<template>
  <a
    v-if="image.link && image.src"
    :href="image.link"
  >
    <img
      :src="image.src"
      class="mw-100 mb-3"
    >
  </a>
  <img
    v-else-if="!image.link && image.src"
    :src="image.src"
    class="mw-100 mb-3"
  >
</template>

<script>
  export default {
    props: {
      image: {
        type: Object,
        default: () => {}
      }
    }
  };
</script>
