<template>
  <div>
    <a
      class="skip-main"
      href="#main"
      data-qa="main content accessibility link"
    >
      Skip to main content
    </a>
    <PageHeader
      :lang-select-enabled="langSelectEnabled"
      :search-query="searchQuery"
    />
    <nuxt
      id="main"
    />
    <PageFooter />
  </div>
</template>

<script>
  import PageHeader from '../components/PageHeader.vue';
  import PageFooter from '../components/PageFooter.vue';

  export default {
    components: {
      PageHeader,
      PageFooter
    },
    data () {
      return {
        searchQuery: this.getQueryFromParam()
      };
    },
    computed: {
      langSelectEnabled() {
        return process.env.ENABLE_LANG_SELECT === 'true';
      }
    },
    created () {
      this.$root.$on('leaveSearchPage', () => {
        this.searchQuery = '';
      });
      this.$root.$on('updateSearchQuery', (val) => {
        this.searchQuery = val;
      });
    },
    methods: {
      getQueryFromParam () {
        return this.$route.query ? this.$route.query.query : '';
      }
    },
    watchQuery: ['query']
  };
</script>
