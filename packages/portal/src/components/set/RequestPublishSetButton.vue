<template>
  <b-button
    class="text-decoration-none text-nowrap ml-2"
    data-qa="request publish set button"
    :disabled="submitted"
    @click="handleClick"
  >
    {{ buttonText }}
  </b-button>
</template>

<script>
  import makeToastMixin from '@/mixins/makeToast';
  import axios from 'axios';

  export default {
    name: 'RequestPublishSetButton',

    mixins: [makeToastMixin],

    props: {
      /**
       * Set
       */
      set: {
        type: Object,
        required: true
      }
    },

    data() {
      return {
        // TODO: logic to check if set is submitted
        submitted: false
      };
    },

    computed: {
      publishedSet() {
        return this.set.visibility === 'published';
      },
      buttonText() {
        if (this.publishedSet) {
          return this.$t('actions.requestDepublication');
        } else if (this.submitted) {
          return this.$t('actions.submittedForPublication');
        } else {
          return this.$t('actions.submitForPublication');
        }
      }
    },

    methods: {
      handleClick() {
        this.set.visibility === 'published' ? this.requestDepublication() : this.submitForPublication();
      },
      submitForPublication() {
        this.submitted = true;

        const postData = {
          submission: this.set.id,
          email: this.$store.state.auth.user.email
        };

        console.log('running');
        return axios.create({
          baseURL: this.$config.app.baseUrl
        }).post(
          '/_api/jira/gallery-publication',
          postData
        )
          .then(this.makeToast('This gallery is now submitted for publication. You can check Europeana.eu/galleries to see if it has been published.'));
      },
      requestDepublication() {
        // TODO: create depublication request
      }
    }
  };
</script>
