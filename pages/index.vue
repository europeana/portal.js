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
