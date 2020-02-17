<template>
  <figure>
    <b-img-lazy
      :src="src | optimisedImageUrl(contentType)"
      alt=""
    />
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
      src: {
        type: String,
        required: true
      },
      contentType: {
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
