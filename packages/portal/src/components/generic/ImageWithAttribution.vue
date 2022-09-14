<template>
  <b-container
    fluid
    class="image-wrapper"
  >
    <b-jumbotron
      fluid
      text-variant="white"
      class="mt-2"
      :class="hero ? 'hero' : ''"
      @click="!citeCollapsed ? toggleCite : null"
    >
      <figure
        :class="{ empty: !src }"
      >
        <OptimisedImage
          v-if="src"
          :src="src"
          :width="width"
          :height="height"
          :alt="alt"
          :content-type="contentType"
          :max-width="1100"
          data-qa="image"
        />
        <AttributionToggle
          :attribution="attribution"
        />
      </figure>
    </b-jumbotron>
  </b-container>
</template>

<script>
  import AttributionToggle from '@/components/generic/AttributionToggle';
  import OptimisedImage from './OptimisedImage';

  export default {
    name: 'ImageWithAttribution',

    components: {
      AttributionToggle,
      OptimisedImage
    },

    props: {
      header: {
        type: String,
        default: ''
      },
      lead: {
        type: String,
        default: ''
      },
      src: {
        type: String,
        required: true,
        default: null
      },
      width: {
        type: Number,
        default: 550
      },
      height: {
        type: Number,
        default: 790
      },
      alt: {
        type: String,
        default: ''
      },
      name: {
        type: String,
        default: null
      },
      contentType: {
        type: String,
        default: null
      },
      attribution: {
        type: Object,
        required: true
      },
      hero: {
        type: Boolean,
        default: false
      }
    }
  };
</script>
