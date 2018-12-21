<template>
  <div
    class="inner">
    <div
      class="inner-text">

      <MultiLineEllipsis
        v-if="linkText">
        <nuxt-link
          :to="{ path: url }" >{{ linkText }}</nuxt-link>
      </MultiLineEllipsis>

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

import MultiLineEllipsis from '../atoms/MultiLineEllipsis';

export default{
  components:{
    MultiLineEllipsis
  },
  props: {
    linkText: {
      type: String,
      default: ''
    },
    texts: {
      type: Array,
      default() {}
    },
    url: {
      type: String,
      default: ''
    }
  }
};
</script>

<style lang="scss" scoped>
  .inner{
    display: flex;
    padding: 1rem;
    position: relative;
  }

  .ellipsis{
    line-height: 1.8em;
    max-height:  4.6em;
  }

</style>
