<template>
  <div class="m-1 popup-content">
    PIN POPUP {{ id }}
  </div>
</template>

<script>
  export default {
    name: 'EntityOrganisationsMapPinPopup',

    props: {
      id: {
        type: String,
        required: true
      }
    },

    data() {
      return {};
    },

    // computed: {
    //   property() {
    //     return null;
    //   }
    // },
  };
</script>

<style lang="scss" scoped>
@import '@europeana/style/scss/variables';

.popup-content {
  color: $blue;
}
</style>
