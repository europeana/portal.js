<template>
  <div>
    <b-button
      class="text-decoration-none text-nowrap ml-2 h-100"
      data-qa="request publish set button"
      :disabled="submitted"
      @click="$bvModal.show('request-publish-set-modal')"
    >
      {{ buttonText }}
    </b-button>
    <b-modal
      id="request-publish-set-modal"
      :title="$t('set.publication.title')"
      :static="modalStatic"
      hide-header-close
      hide-footer
    >
      <p>{{ $t('set.publication.description') }}</p>
      <h6>{{ $t('set.publication.process.title') }}</h6>
      <p>{{ $t('set.publication.process.description') }}</p>
      <h6>{{ $t('set.publication.time.title') }}</h6>
      <p>{{ $t('set.publication.time.description') }}</p>

      <div class="modal-footer">
        <b-button
          variant="outline-primary"
          data-qa="close button"
          @click="$bvModal.hide('request-publish-set-modal')"
        >
          {{ $t('actions.goBack') }}
        </b-button>
        <b-button
          variant="primary"
          @click="submitForPublication"
        >
          {{ $t('actions.submitForPublication') }}
        </b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import makeToastMixin from '@/mixins/makeToast';
  import axios from 'axios';

  export default {
    name: 'RequestPublishSetWidget',

    mixins: [makeToastMixin],

    props: {
      /**
       * Set
       */
      set: {
        type: Object,
        required: true
      },
      modalStatic: {
        type: Boolean,
        default: false
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
          Set creator: ${this.set.creator.nickname}`,
          email: this.$store.state.auth.user.email
        };

        return axios.create({
          baseURL: this.$config.app.baseUrl
        }).post(
          '/_api/jira/gallery-publication',
          postData
        )
          .then(this.$bvModal.hide('request-publish-set-modal'))
          .then(this.makeToast('This gallery is now submitted for publication. You can check Europeana.eu/galleries to see if it has been published.'));
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables';

  #request-publish-set-modal {

    h6 {
      font-weight: 600;
    }

    p {
      color: $mediumgrey;
      margin-top: 0.25rem;
    }
  }
</style>
