<template>
  <section class="container">
    <b-container>
      <b-row>
        <b-col>
          <EuropeanaCollectionsLogo />
          <h1 class="title">
            Transforming the world with {{ what }}
          </h1>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
  import EuropeanaCollectionsLogo from '~/components/EuropeanaCollectionsLogo.vue';
  export default {
    asyncData (context) {
      return { what: (context.query.what ? context.query.what : 'culture') };
    },
    components: {
      EuropeanaCollectionsLogo
    }
  };
</script>

<style>

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

</style>
