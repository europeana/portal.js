<template>
  <span
    class="colour-palette"
    :style="`backgroundColor: ${hexCode}`"
    :data-qa="`colour swatch ${label}`"
    :aria-label="`${$t('colourSwatch')} - ${label}`"
  />
</template>

<script>
  import { localiseFilterLabel } from '../../mixins';

  export default {
    name: 'ColourSwatch',

    mixins: [localiseFilterLabel],

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
