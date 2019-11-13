<template>
  <section>
    <b-img
      v-for="thumbnail of thumbnails"
      :key="thumbnail.key"
      :src="thumbnail.src"
    />
  </section>
</template>

<script>
  export default {
    props: {
      thumbnails: {
        type: Array,
        required: true
      }
    }
  };
</script>
