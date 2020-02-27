<template>
  <div>
    <figure>
      <OptimisedImage
        :src="src"
        :width="width"
        :height="height"
        :content-type="contentType"
        :max-width="1100"
        data-qa="image"
      />
      <figcaption>
        <CiteAttribution
          :name="attribution.name"
          :creator="attribution.creator"
          :provider="attribution.provider"
          :rights-statement="attribution.rightsStatement"
          :url="attribution.url"
          data-qa="attribution"
        />
      </figcaption>
    </figure>
  </div>
</template>

<script>
  import CiteAttribution from './CiteAttribution';
  import OptimisedImage from './OptimisedImage';

  export default {
    name: 'ImageWithAttribution',

    components: {
      CiteAttribution,
      OptimisedImage
    },

    props: {
      src: {
        type: String,
        required: true
      },
      width: {
        type: Number,
        default: null
      },
      height: {
        type: Number,
        default: null
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
