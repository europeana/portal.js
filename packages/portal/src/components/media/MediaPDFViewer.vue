<template>
  <iframe
    :src="url"
    class="w-100 h-100"
  />
</template>

<script>
  export default {
    name: 'MediaPDFViewer',

    props: {
      url: {
        type: String,
        required: true
      }
    }
  };
</script>
