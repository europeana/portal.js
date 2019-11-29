<template>
  <b-form inline>
    <label
      class="sr-only"
      for="inline-form-input-name"
    >
      Name
    </label>
    <b-input
      id="inline-form-input-name"
      class="mb-2 mr-sm-2 mb-sm-0"
      placeholder="Jane Doe"
    />

    <label
      class="sr-only"
      for="inline-form-input-username"
    >
      Username
    </label>
    <b-input
      id="inline-form-input-username"
      placeholder="Username"
    />
  </b-form>
</template>

<script>
  export default {
    name: 'DateFilter',

    props: {
      name: {
        type: String,
        required: true
      },

      start: {
        type: String,
        default: ''
      },

      end: {
        type: String,
        default: ''
      }
    }
  };
</script>
