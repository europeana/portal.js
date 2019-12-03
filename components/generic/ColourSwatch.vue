<template>
  <span
    class="colour-palette"
    :style="`backgroundColor: ${hexCode}`"
    :data-qa="`colour swatch ${hexCode}`"
    :aria-labelledby="ariaLabelledby"
  />
</template>

<script>
  export default {
    name: 'ColourSwatch',

    props: {
      ariaLabelledby: {
        type: String,
        default: ''
      },

      hexCode: {
        type: String,
        default: ''
      }
    }
  };
</script>
