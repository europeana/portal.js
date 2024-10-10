<template>
  <div>
    <b-form
      @submit.prevent="handleSubmitForm"
    >
      <b-form-group
        id="input-group-1"
      >
        <b-form-input
          id="media-annotation-search-query"
          v-model="query"
          name="query"
          type="text"
        />
      </b-form-group>
    </b-form>
    <MediaAnnotationList
      v-if="query"
      :uri="uriWithQuery"
      :text-granularity="textGranularity"
      @selectAnno="onSelectAnno"
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
      targetId: {
        type: String,
        default: null
      },

      textGranularity: {
        type: [Array, String],
        default: null
      },

      uri: {
        type: String,
        required: true
      }
    },

    data() {
      return {
        query: this.$route.query.query || null
      };
    },

    computed: {
      uriWithQuery() {
        const url = new URL(this.uri);
        url.searchParams.set('query', this.query);
        return url.toString();
      }
    },

    watch: {
      '$route.query.query'() {
        this.query = this.$route.query.query || null;
      }
    },

    methods: {
      handleSubmitForm() {
        // console.log
        this.$router.push({ ...this.$route, query: { ...this.$route.query, query: this.query } });
      },

      onSelectAnno(anno) {
        this.$emit('selectAnno', anno);
      }
    }
  };
</script>
