<template>
  <b-row
    class="flex-md-row"
    data-qa="blog author"
  >
    <b-col
      cols="12"
    >
      <h3 class="font-weight-bold">Author</h3>
      <p>{{ name }}</p>
      <p v-if="organisation">
        {{ organisation }}
      </p>
      <p v-if="url">
        {{ url }}
      </p>
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
