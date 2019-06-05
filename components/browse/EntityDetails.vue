<template>
  <div>
    <b-img
      v-if="depiction"
      :src="depiction"
      class="mb-3"
      fluid
      center
      alt=""
    />
    <p>
      <b-link
        v-if="attribution"
        :href="attribution"
        target="_blank"
      >
        Attribution
      </b-link>
    </p>
    <p>{{ description }}</p>
  </div>
</template>

<script>
  export default {
    props: {
      depiction: {
        type: String,
        default: ''
      },
      attribution: {
        type: String,
        default: ''
      },
      description: {
        type: String,
        default: ''
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
