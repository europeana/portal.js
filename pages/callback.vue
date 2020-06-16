<template>
  <b-col class="container">
    <b-row
      align-h="center"
    >
      <b-col
        class="p-4 m-4"
        cols="10"
        md="6"
      >
        Loading...
      </b-col>
    </b-row>
  </b-col>
</template>

<script>
// TODO: Replace page content with loading overlay
  export default {
    auth: false,
    beforeCreate() {
    },
    beforeMount() {
    },
    async mounted() {
      await this.$nextTick(() => {
        this.$nuxt.$loading.start();
      });
    },
    methods: {
    }
  };
</script>


<style scoped>
.container {
  min-height: 70vh;
}
</style>
