<template>
  <div>
    {{ entries }}
    <BrowseContentCard
      v-for="card in entries.entries"
      :key="card.sys.id"
      :fields="card.fields"
      :card-type="card.sys.contentType ? card.sys.contentType.sys.id : ''"
    />
    {{ entries.total }}
  </div>
</template>

<script>
  import { getLatestEntries } from '../../plugins/europeana/latest-entries';
  import BrowseContentCard from './BrowseContentCard';

  export default {
    components: {
      BrowseContentCard
    },

    props: {
      category: {
        type: String,
        required: true
      }
    },

    data() {
      return {
        entries: []
      };
    },

    computed: {
      contentType() {
        return 'exhibitionPage';
      }
    },

    created() {
      this.entries = this.getEntries();
    },

    methods: {
      async getEntries() {
        return await getLatestEntries(this.contentType, this.$i18n.isoLocale());
      }
    }
  };

</script>
