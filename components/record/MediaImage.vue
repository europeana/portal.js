<template>
  <a
    v-if="link && src"
    :href="link"
  >
    <img
      :src="src"
      class="mw-100 mb-3"
      alt="Depiction of this record"
    >
  </a>
  <img
    v-else-if="!link && src"
    :src="src"
    alt="Image"
    class="mw-100 mb-3"
  >
</template>

<script>
  export default {
    props: {
      link: {
        type: String,
        default: ''
      },
      src: {
        type: String,
        default: ''
      }
    }
  };
</script>
