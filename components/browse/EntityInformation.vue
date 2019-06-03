<template>
  <div>
    <b-img
      v-if="depiction.id"
      :src="depiction.id"
      class="mb-3"
      fluid
      alt=""
    />
    <b-link
      v-if="depiction.source"
      :href="depiction.source"
      target="_blank"
    >
      Attribution
    </b-link>
  </div>
</template>

<script>
  export default {
    props: {
      depiction: {
        type: Object,
        default: () => {}
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "./assets/scss/variables.scss";

  img {
    border-radius: $border-radius-small;
    box-shadow: $boxshadow-small;
  }
</style>
