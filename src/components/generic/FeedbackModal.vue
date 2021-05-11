<template>
  <b-modal
    id="feedbackModal"
    v-model="modalShow"
    title="Send feedback"
    hide-header-close
    hide-footer
    data-qa="feedback modal"
  >
    <b-form>
      <b-form-group>
        <b-form-textarea
          v-if="currentStep === 1"
          id="step1"
          v-model="feedback"
          name="feedback"
          placeholder="Enter your feedback here"
          rows="5"
        />
        <div
          v-if="currentStep === 2"
          id="step2"
        >
          <b-form-input
            v-model="email"
            type="email"
            name="email"
            placeholder="Enter your email address"
          />
          <b-form-text id="input-live-help">
            By continuing, you agree to our Terms of Service and acknowledge our Privacy Policy.
          </b-form-text>
        </div>
        <div
          v-if="currentStep == 3"
          id="step3"
          class="d-flex align-items-center"
        >
          <span class="icon-check_circle pr-3" />
          {{ $t('feedback.success') }}
        </div>
        <b-button
          v-if="currentStep !== 3"
          :variant="'outline-primary'"
          class="mt-3"
          @click.prevent="$bvModal.hide('feedbackModal')"
        >
          {{ $t('actions.cancel') }}
        </b-button>
        <div class="button-group-right">
          <b-button
            v-if="currentStep === 2"
            :variant="'outline-primary'"
            class="mt-3"
            @click.prevent="sendFeedback"
          >
            {{ $t('actions.skip') }}
          </b-button>
          <b-button
            variant="primary"
            class="button-next-step mt-3"
            :disabled="disableButton"
            @click.prevent="currentStep === 3 ? $bvModal.hide('feedbackModal') : currentStep === 2 ? sendFeedback() : goToStep(currentStep + 1)"
          >
            {{ currentStep === 3 ? $t('actions.close') : $t('actions.next') }}
          </b-button>
        </div>
      </b-form-group>
    </b-form>
  </b-modal>
</template>

<script>

  export default {
    name: 'FeedbackModal',

    data() {
      return {
        modalShow: false,
        currentStep: 1,
        feedback: '',
        email: ''

      };
    },
    computed: {
      disableButton() {
        if (this.currentStep === 1) {
          return !this.feedback;
        } else if (this.currentStep === 2) {
          return !this.email;
        } else {
          return false;
        }
      }
    },

    methods: {
      goToStep(step) {
        this.currentStep = step;
      },
      sendFeedback() {
        // TODO: post request to Jira Service Desk API
        console.log('Feedback has been send');
        this.goToStep(this.currentStep + 1);
      }
    }
  };
</script>

<style lang="scss">
  @import '../../assets/scss/variables.scss';

  #feedbackModal {
    color: $mediumgrey;
    .modal-dialog {
      position: absolute;
      right: 1rem;
      bottom: 1rem;
      margin: 0;
      @media (min-width: $bp-small) {
        width: 360px;
      }
    }
    .modal-content {
      .modal-header {
        background-color: $innovationblue;
        // border-bottom: none;
        padding: 0.75rem 1rem 0.75rem 1rem;
      }
      .modal-title {
        color: $white;
        font-size: 1rem;
        // font-weight: 600;
      }
      .modal-body {
        padding: 1rem;
        form .form-control {
          padding: 0.75rem;
        }
      }
    }

    .form-text {
      font-size: 0.875rem;
      margin: 0.75rem 0 0 0;
    }

    .button-group-right {
      display: inline;
      float: right;
    }

    .icon-check_circle::before {
      color: $innovationblue;
      font-size: 2.5rem;
    }
  }
</style>
