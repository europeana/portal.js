<template>
  <div
    class="inner">
    <div
      class="inner-text">
      <p
        v-if="linkText"
        class="ellipsis">
        <nuxt-link
          :to="{ path: url }">{{ linkText }}</nuxt-link>
      </p>
      <p v-if="texts">
        <span
          v-for="item in texts"
          :key="item">
          {{ item }}
        </span>
      </p>
    </div>
  </div>
</template>

<script>
export default{
  props: {
    linkText: {
      type: String,
      default: ''
    },
    texts: {
      type: Array,
      default(){}
    },
    url: {
      type: String,
      default: ''
    }
  }
};
</script>

<style scoped>
  .inner{
    display: flex;
    padding: 1rem;
    position: relative;
  }
</style>
