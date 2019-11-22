<template>
  <div
    data-qa="error page"
  >
    <b-container>
      <b-row>
        <b-col>
          <h1>Error {{ error.statusCode }}</h1>
          <p>{{ error.message }}</p>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  export default {
    name: 'ErrorPage',

    props: {
      error: {
        type: Object,
        required: true
      }
    }
  };
</script>
