<template>
  <div>
    <div id="viewer" />
  </div>
</template>

<script>
  export default {
    layout: 'minimal',

    data() {
      return {
        MIRADOR_BUILD_PATH: 'https://unpkg.com/mirador@3.0.0-alpha.16/dist/',
        uri: null
      };
    },

    asyncData({ query }) {
      return {
        uri: query.uri
      };
    },

    mounted() {
      this.$nextTick(() => {
        Mirador.viewer({ // eslint-disable-line no-undef
          id: 'viewer',
          windows: [{
            manifestId: this.uri,
            thumbnailNavigationPosition: 'far-bottom'
          }]
        });
      });
    },

    head() {
      return {
        title: 'IIIF',

        script: [
          { src: `${this.MIRADOR_BUILD_PATH}/mirador.min.js` }
        ]
      };
    }
  };
</script>

<style lang="scss" scoped>
  #viewer {
    width: 100%;
    height: 100%;
    position: fixed;
  }
</style>
