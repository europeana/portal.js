<template>
  <b-img-lazy
    v-if="lazy"
    :src="optimisedSrc"
    blank-color="#fff"
    :blank-width="optimisedWidth"
    :blank-height="optimisedHeight"
    :alt="alt"
  />
  <b-img
    v-else
    :src="optimisedSrc"
    :width="optimisedWidth"
    :height="optimisedHeight"
    :alt="alt"
  />
</template>

<script>
  export default {
    name: 'OptimisedImage',

    props: {
      src: {
        type: String,
        required: true
      },
      width: {
        type: Number,
        required: true
      },
      height: {
        type: Number,
        required: true
      },
      alt: {
        type: String,
        default: ''
      },
      contentType: {
        // TODO: required?
        type: String,
        default: null
      },
      quality: {
        type: Number,
        default: 80
      },
      maxWidth: {
        type: Number,
        default: null
      },
      lazy: {
        type: Boolean,
        default: true
      }
    },

    computed: {
      aspectRatio() {
        return this.width / this.height;
      },

      optimisedWidth() {
        return (this.maxWidth === null || this.width <= this.maxWidth) ? this.width : this.maxWidth;
      },

      optimisedHeight() {
        return Math.round(this.optimisedWidth / this.aspectRatio);
      },

      forContentfulAsset() {
        const hostnameMatch = this.src.match(/\/\/([^/]+)\//);
        return hostnameMatch && (hostnameMatch[1] === 'images.ctfassets.net');
      },

      optimisedSrc() {
        if (typeof this.contentType !== 'string') {
          return this.src;
        }

        let imageUrl = this.src;
        const imageQueryParams = [];

        if (this.forContentfulAsset) {
          // TODO: are optimisations possible on any other content types?
          if (this.contentType === 'image/jpeg') {
            imageQueryParams.push('fm=jpg&fl=progressive');
            imageQueryParams.push(`q=${this.quality}`);
          }

          if (this.maxWidth) {
            imageQueryParams.push(`w=${this.maxWidth}`);
          }
        }

        if (imageQueryParams.length > 0) {
          imageUrl += '?' + imageQueryParams.join('&');
        }

        return imageUrl;
      }
    }
  };
</script>
