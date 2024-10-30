<template>
  <div>
    <b-form
      id="media-annotation-search-form"
      class="px-3"
      @submit.prevent="handleSubmitForm"
    >
      <b-form-group>
        <b-form-input
          id="media-annotation-search-query"
          v-model="query"
          name="query"
          type="text"
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
