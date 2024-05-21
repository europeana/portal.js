<template>
  <!--
    `key` attribute is needed to force replacement of the entire audio element
    when `src` updates as `source` elements may not have their `src` attribute
    updated after render.
  -->
  <audio
    :key="src"
    :controls="controls"
    :autoplay="autoplay"
    :loop="loop"
    class="w-100"
    data-qa="audio player"
  >
    <source
      :src="$apis.mediaProxy.url(src, europeanaIdentifier, { recordApiUrl: $apis.record.baseURL })"
      :type="type"
      data-qa="audio source"
    >
  </audio>
</template>

<script>
  export default {
    name: 'MediaAudioPlayer',

    props: {
      europeanaIdentifier: {
        type: String,
        required: true
      },
      src: {
        type: String,
        required: true
      },
      type: {
        type: String,
        required: true
      },
      controls: {
        type: Boolean,
        default: true
      },
      autoplay: {
        type: Boolean,
        default: false
      },
      loop: {
        type: Boolean,
        default: false
      }
    }
  };
</script>
