<template>
  <div class="account">
    <b-container
      fluid
    >
      <b-row class="bg-white">
        <b-col class="mt-4 pt-4">
          <h1 class="text-center mb-1">
            <!-- TODO: When the connection with Keycloak is done, here show the user's username -->
            {{ $t('account.text') }}
          </h1>
        </b-col>
      </b-row>
      <TabbedLayout
        :selected-tab="selectedTab"
        :tabs="tabs"
      />
    </b-container>
  </div>
</template>

<script>
  import TabbedLayout from '../../components/generic/TabbedLayout';

  export default {
    components: {
      TabbedLayout
    },
    data() {
      return {
        selectedTab: 0,
        // TODO: Fill the card properties appropriately, based on the Sets API
        tabs: [
          {
            'id': 0,
            'title': this.$t('account.likes'),
            'view': 'grid',
            'card': 'https://api.europeana.eu/record/search.json?facet=&profile=minimal&query=red%20shoes&rows=24&start=1&wskey=nLbaXYaiH'
          },
          {
            'id': 1,
            'title': this.$t('account.publicCollections'),
            'view': 'grid',
            'card': 'https://api.europeana.eu/record/search.json?facet=&profile=minimal&query=blue%20shoes&rows=24&start=1&wskey=nLbaXYaiH'
          },
          {
            'id': 2,
            'title': this.$t('account.privateCollections'),
            'view': 'grid',
            'card': 'https://api.europeana.eu/record/search.json?facet=&profile=minimal&query=green%20shoes&rows=24&start=1&wskey=nLbaXYaiH'
          }
        ]
      };
    },
    head() {
      return {
        title: this.$t('account.text')
      };
    }
  };

</script>

<style lang="scss" scoped>
  div.account {
    position: relative;
    margin-top: -1.5%;
  }
</style>
