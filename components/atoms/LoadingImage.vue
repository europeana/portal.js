<template>
  <nuxt-link
    :to="{ path: url }"
    :style="[ isLoaded ? { 'backgroundImage': 'url(' + thumbnail + ')' } : {} ]"
    :class="[ isLoaded ? 'card-img' : 'card-img loading']">
    <img
      v-show="false"
      :src="thumbnail"
      @load="imgLoaded">
  </nuxt-link>
</template>

<script>
export default{
  props: {
    thumbnail: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    }
  },
  data() {
    return { isLoaded: false };
  },
  methods: {
    imgLoaded() {
      this.isLoaded = true;
    }
  }
};
</script>

<style lang="scss" scoped>

  $animation-colour-1: #fafafa;
  $animation-colour-2: #ededed;

  $white: #fff;

  .card-img{
    background-position: center;
    background-size:     cover;
    display:             block;
    height:              100%;
    width:               100%;

    &.loading {
      animation-duration: 1.8s;
      animation-fill-mode: forwards;
      animation-iteration-count: infinite;
      animation-name: placeHolderShimmer;
      animation-timing-function: linear;
      background: $white;
      background: linear-gradient(to right, $animation-colour-1 8%, $animation-colour-2 38%, $animation-colour-1 54%);
      background-size: 1000px 640px;
      position: relative;
      transform: translate3d(0, 0, 0) rotateZ(360deg);
    }
  }


  @keyframes placeHolderShimmer {
    0% {
      background-position: -468px 0;
    }
    100% {
      background-position: 468px 0;
    }
  }
</style>
