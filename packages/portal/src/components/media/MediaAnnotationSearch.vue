<template>
  <div>
    <b-form
      id="media-annotation-search-form"
      class="search-form position-relative"
      inline
      role="search"
      @submit.prevent="handleSubmitForm"
    >
      <b-form-group>
        <b-form-input
          id="media-annotation-search-query"
          v-model="query"
          :placeholder="$t('media.sidebar.searchPlaceholder')"
          name="query"
          type="search"
          aria-labelledby="item-media-sidebar-search-title"
          class="form-control"
        />
      </b-form-group>
    </b-form>
    <MediaAnnotationList
      v-if="annoQuery"
      :active="active"
      :query="annoQuery"
    />
  </div>
</template>

<script>
  import MediaAnnotationList from './MediaAnnotationList.vue';

  export default {
    name: 'MediaAnnotationSearch',

    components: {
      MediaAnnotationList
    },

    props: {
      active: {
        type: Boolean,
        default: true
      }
    },

    data() {
      return {
        annoQuery: this.$route.query.fulltext || null,
        query: this.$route.query.fulltext || null
      };
    },

    watch: {
      '$route.query.fulltext'() {
        this.annoQuery = this.$route.query.fulltext || null;
      }
    },

    methods: {
      handleSubmitForm() {
        this.$router.push({ ...this.$route, query: { ...this.$route.query, fulltext: this.query } });
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .search-form {
    width: auto;
    margin: 0 0.75rem 1.5rem;
    padding-left: 2rem;

    &::before {
      top: 0.75rem;
      left: 0.75rem;
    }

    &.form-inline .form-group {
      flex-shrink: 1;
      margin-bottom: 0;
    }

    .form-control {
      padding: 0.75rem;
      border-radius: 0.5rem
    }
  }
</style>
