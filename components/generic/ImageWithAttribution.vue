<template>
  <figure>
    <img
      :src="imageSrc | optimisedImageUrl(imageContentType)"
    >
    <figcaption>
      <CiteAttribution
        :name="attribution.name"
        :creator="attribution.creator"
        :provider="attribution.provider"
        :rights-statement="attribution.rightsStatement"
        :url="attribution.url"
      />
    </figcaption>
  </figure>
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
