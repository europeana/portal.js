<template>
  <component
    :is="lazy ? 'b-img-lazy' : 'b-img'"
    :alt="alt"
    :blank-color="lazy && blankColor"
    :blank-width="lazy && width"
    :blank-height="lazy && height"
    :src="src"
    :srcset="srcset"
    :sizes="sizes"
    :width="!lazy && width"
    :height="!lazy && height"
  />
</template>

<script>
  export default {
    name: 'ImageEagerOrLazy',

    props: {
      alt: {
        type: String,
        default: null
      },

      blankColor: {
        type: String,
        default: null
      },

      height: {
        type: [Number, String],
        required: true
      },

      lazy: {
        type: Boolean,
        default: false
      },

      sizes: {
        type: String,
        default: null
      },

      src: {
        type: String,
        required: true
      },

      srcset: {
        type: String,
        default: null
      },

      width: {
        type: [Number, String],
        required: true
      }
    }
  };
</script>
