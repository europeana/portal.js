<template>
  <span
    class="colour-palette"
    :style="`backgroundColor: ${hexCode}`"
    :data-qa="`colour swatch ${label}`"
    :aria-label="`${$t('colourSwatch')} - ${label}`"
  />
</template>

<script>
  export default {
    name: 'ColourSwatch',

    props: {
      label: {
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
