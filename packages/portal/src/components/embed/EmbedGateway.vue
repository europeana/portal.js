<template>
  <div>
    <slot
      v-if="opened"
      class="embed-gateway-opened"
    />
    <div
      v-else
      :style="thumbnail ? `background-image: url(${thumbnail})` : null"
    >
      <p>This content is hosted by a third party and its use is subject to their terms, conditions and privacy policy.</p>
      <b-button
        :pressed.sync="opened"
        variant="primary"
      >
        Load content
      </b-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'EmbedGateway',

    props: {
      thumbnail: {
        type: String,
        default: null
      }
    },

    data() {
      return {
        opened: false
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .embed-gateway-opened {
    transition: $standard-transition;
  }
</style>
