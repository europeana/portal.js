<template>
  <div
    id="playerElement"
    title="The media player"
    class="w-100"
    style="min-height: 70vh;"
  />
</template>
<script>
  export default {
    props: {
      identifier: {
        type: String,
        required: true
      }
    },
    mounted() {
      if (process.browser) {
        this.initPlayer();
      }
    },
    methods: {
      mediaObject() {
        return {
          source: this.iiifManifestSrc(this.identifier),
          duration: -1,
          id: this.identifier
        };
      },
      iiifManifestSrc(identifier) {
        return `https://iiif.europeana.eu/presentation${identifier}/manifest?format=3&wskey=${process.env.EUROPEANA_API_KEY}`;
      },
      initPlayer() {
        let component = document.getElementById('playerElement');
        const EuropeanaMediaPlayer = require('europeana-media-player').default;
        new EuropeanaMediaPlayer(component, this.mediaObject());
      }
    }
  };
</script>
