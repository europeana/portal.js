<template>
  <b-card class="m-1 popup-content">
    PIN POPUP {{ id }}
  </b-card>
</template>

<script>
  export default {
    name: 'EntityOrganisationsMapPinPopup',

    props: {
      id: {
        type: String,
        default: ''
      }
    }
  };
</script>
