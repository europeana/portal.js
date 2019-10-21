<template>
  <div>
    <img
      :src="imageSrc | optimisedImageSrc(imageContentType)"
    >
    <CiteAttribution
      :name="attribution.name"
      :creator="attribution.creator"
      :provider="attribution.provider"
      :rights-statement="attribution.rightsStatement"
      :url="attribution.url"
    />
  </div>
</template>

<script>
  import CiteAttribution from './CiteAttribution';

  export default {
    components: {
      CiteAttribution
    },

    props: {
      imageSrc: {
        type: String,
        required: true
      },
      imageContentType: {
        type: String,
        default: null
      },
      attribution: {
        type: Object,
        required: true
      }
    }
  };
</script>
