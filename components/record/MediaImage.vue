<template>
  <a
    v-if="link && src"
    :href="link"
  >
    <img
      :src="src"
      class="mw-100"
      alt="View at the provider's website"
    >
  </a>
  <img
    v-else-if="!link && src"
    :src="src"
    alt=""
    class="mw-100"
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
