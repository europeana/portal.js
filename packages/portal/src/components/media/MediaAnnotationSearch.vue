<template>
  <div class="position-relative">
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
          ref="searchinput"
          v-model="query"
          :placeholder="$t('media.sidebar.searchPlaceholder')"
          name="query"
          type="search"
          aria-labelledby="item-media-sidebar-search-title"
          class="form-control"
        />
      </b-form-group>
    </b-form>
    <b-button
      v-show="query"
      data-qa="clear button"
      class="clear-button icon-only"
      variant="light"
      :aria-label="$t('actions.clear')"
      @click="clearQuery"
    >
      <span class="icon-clear" />
    </b-button>
    <MediaAnnotationList
      v-if="annoQuery"
      :active="active"
      :query="annoQuery"
    />
  </div>
</template>

<script>
  import useItemMediaPresentation from '@/composables/itemMediaPresentation.js';
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

    setup() {
      const {
        searchAnnotations
      } = useItemMediaPresentation();

      return {
        searchAnnotations
      };
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
      },

      clearQuery() {
        this.query = null;
        this.searchAnnotations(null);
        this.handleSubmitForm();
        this.$nextTick(() => {
          this.$refs.searchinput.$el.focus();
        });
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
      border-radius: 0.5rem;
      box-shadow: 0 0 0px 1000px $white inset !important; // override webkit search input style
    }

    input[type='search']::-webkit-search-decoration,
    input[type='search']::-webkit-search-cancel-button {
      appearance: none;
    }

    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus {
      -webkit-text-fill-color: $mediumgrey;
      -webkit-box-shadow: 0 0 0px 1000px $white inset;
    }
  }

  .clear-button {
    position: absolute;
    z-index: 4;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0.625rem;
    right: 1.25rem;
    padding: 0.5rem;

    .icon-clear {
      font-size: $font-size-small;
    }
  }
</style>
