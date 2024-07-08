<template>
  <div
    class="d-flex flex-column align-items-center"
  >
    <h2>IIIF</h2>
    <dl>
      <dt>uri</dt>
      <dd>{{ uri }}</dd>
      <dt>itemId</dt>
      <dd>{{ itemId }}</dd>
      <dt>searchQuery</dt>
      <dd>{{ searchQuery }}</dd>
      <dt>providerUrl</dt>
      <dd>{{ providerUrl }}</dd>
    </dl>
  </div>
</template>

<script>
  export default {
    name: 'IIIFListProps',

    props: {
      uri: {
        type: String,
        required: true
      },

      itemId: {
        type: String,
        default: null
      },

      searchQuery: {
        type: String,
        default: null
      },

      providerUrl: {
        type: String,
        default: null
      }
    }
  };
</script>
