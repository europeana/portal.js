<template>
  <b-row
    class="flex-md-row"
    data-qa="blog author"
  >
    <b-col
      cols="12"
    >
      {{ name }} {{ organisation }} {{ url }}
    </b-col>
  </b-row>
</template>

<script>
  export default {
    name: 'Author',

    props: {
      name: {
        type: String,
        required: true
      },

      organisation: {
        type: String,
        default: ''
      },

      url: {
        type: String,
        default: ''
      }
    }
  };
</script>
