<template>
  <span
    class="colour-palette"
    :style="`backgroundColor: ${hexCode}`"
    :data-qa="`colour swatch ${hexCode}`"
  />
</template>

<script>
  export default {
    name: 'ColourSwatch',

    props: {
      hexCode: {
        type: String,
        default: ''
      }
    }
  };
</script>
