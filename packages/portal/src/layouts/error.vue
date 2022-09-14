<template>
  <div
    data-qa="error page"
  >
    <b-container>
      <b-row>
        <b-col>
          <main role="main">
            <h1>{{ $t('error') }}</h1>
            <div data-qa="error notice">
              <p class="lead">
                {{ error.message }}
              </p>
            </div>
          </main>
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
    },

    head() {
      return {
        title: this.$pageHeadTitle(this.$t('error'))
      };
    }
  };
</script>
