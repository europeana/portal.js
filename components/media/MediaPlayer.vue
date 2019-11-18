<template>
  <div
    id="playerElement"
    title="The media player"
  />
</template>
<script>
  export default {
    props: {
      src: {
        type: String,
        default: null,
        require: true
      }
    },
    created() {
      console.log('created');
      if (process.browser) {
        this.initPlayer();
      }
    },
    methods: {
      videoObject() {
        return {
          source: this.iifManifestSrc(this.src),
          duration: -1,
          id: this.src
        };
      },
      iifManifestSrc(src) {
        console.log(src);
        return 'https://iiif.europeana.eu/presentation/2051906/data_euscreenXL_http___www_openbeelden_nl_media_664892/manifest?format=3&wskey=XYZ';
      },
      initPlayer() {
        let component = document.getElementById('playerElement');
        const EuropeanaMediaPlayer = require('europeana-media-player').default;
        new EuropeanaMediaPlayer(component, this.videoObject());
      }
    }
  };
</script>
