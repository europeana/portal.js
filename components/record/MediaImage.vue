<template>
  <a
    v-if="image"
    :href="image.link"
  >
    <img
      :src="image.src"
      class="mw-100 mb-3"
    >
  </a>
  <img
    v-else
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
