<template>
  <b-button
    class="text-decoration-none text-nowrap ml-2"
    data-qa="request publish set button"
    :disabled="submitted"
    @click="submitForPublication"
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
        submitted: false
      };
    },

    computed: {
      publishedSet() {
        return this.set.visibility === 'published';
      },
      buttonText() {
        if (this.submitted) {
          return this.$t('actions.submittedForPublication');
        } else {
          return this.$t('actions.submitForPublication');
        }
      }
    },

    methods: {
      submitForPublication() {
        this.submitted = true;

        const postData = {
          submission: `Set ID: ${this.set.id}\
          Set creator: ${this.set.creator.nickname}\
          Set creator email: ${this.$store.state.auth.user.email}`
        };

        return axios.create({
          baseURL: this.$config.app.baseUrl
        }).post(
          '/_api/jira/gallery-publication',
          postData
        )
          .then(this.makeToast('This gallery is now submitted for publication. You can check Europeana.eu/galleries to see if it has been published.'));
      }
    }
  };
</script>
