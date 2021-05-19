<template>
  <b-modal
    id="feedbackModal"
    v-model="modalShow"
    title="Send feedback"
    hide-header-close
    hide-footer
    data-qa="feedback modal"
    no-close-on-backdrop
    hide-backdrop
    content-class="shadow"
    scrollable
    static
    :modal-class="show ? 'showFeedbackModal' : null"
    @show.prevent="resetModal"
  >
    <b-form
      data-qa="feedback modal form"
      @submit.prevent="sendFeedback"
    >
      <b-form-group>
        <b-form-textarea
          v-if="currentStep === 1"
          id="step1"
          ref="input"
          v-model="feedback"
          name="feedback"
          placeholder="Enter your feedback here"
          rows="5"
          data-qa="feedback textarea"
        />
        <div
          v-if="currentStep === 2"
          id="step2"
        >
          <!-- invalid is only set on submit)-->
          <b-form-input
            v-model="email"
            autofocus
            type="email"
            name="email"
            placeholder="Enter your email address"
            :state="emailState"
            aria-describedby="input-live-feedback"
            data-qa="feedback email input"
            @invalid="invalidEmail"
          />
          <b-form-invalid-feedback
            id="input-live-feedback"
            data-qa="feedback email invalid"
          >
            {{ $t('feedback.validEmail') }}
          </b-form-invalid-feedback>
          <b-form-text id="input-live-help">
            <p class="mb-0">
              {{ $t('feedback.emailOptional') }}
            </p>
            <i18n
              :path="'feedback.policies'"
              tag="span"
            >
              <b-link
                :to="this.$path('/rights')"
                target="_blank"
              >
                {{ $t('feedback.termsOfService') }}
              </b-link>
              <b-link
                :to="this.$path('/rights/privacy-policy')"
                target="_blank"
              >
                {{ $t('feedback.privacyPolicy') }}
              </b-link>
            </i18n>
          </b-form-text>
        </div>
        <div
          v-if="currentStep == 3"
          id="step3"
          class="feedback-success d-flex align-items-center"
        >
          <span :class="requestSuccess ? 'icon-check_circle pr-3' : 'icon-cancel-circle pr-3'" />
          <span
            v-if="requestSuccess"
          >
            <p class="mb-0">{{ $t('feedback.success') }}</p>
            <p class="mb-0">{{ $t('feedback.thankYou') }}</p>
          </span>
          <span
            v-else
          >
            <p class="mb-0">{{ $t('feedback.failed') }}</p>
          </span>
        </div>
        <b-button
          v-if="currentStep !== 3 || !requestSuccess"
          :variant="'outline-primary'"
          class="mt-3"
          @click.prevent="resetModal"
        >
          {{ $t('actions.cancel') }}
        </b-button>
        <div class="button-group-right">
          <b-button
            v-if="currentStep === 2"
            data-qa="feedback skip button"
            :variant="'outline-primary'"
            class="mt-3"
            @click.prevent="sendFeedback(true)"
          >
            {{ $t('actions.skip') }}
          </b-button>
          <b-button
            v-if="currentStep !== 2"
            data-qa="feedback next button"
            variant="primary"
            class="button-next-step mt-3"
            :disabled="disableButton"
            @click.prevent="clickNextButton"
          >
            {{ $t(nextButtonTextKey) }}
          </b-button>
          <!-- Separate submit button needed for email format validation as it only validates on submit -->
          <b-button
            v-if="currentStep === 2"
            data-qa="feedback next button"
            variant="primary"
            class="button-next-step mt-3"
            :disabled="disableButton"
            type="submit"
          >
            {{ $t('actions.next') }}
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
        email: '',
        emailState: true,
        requestSuccess: false,
        show: false
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
      },

      nextButtonTextKey() {
        let key = 'actions.next';
        if (this.currentStep === 3) {
          if (this.requestSuccess) {
            key = 'actions.close';
          } else {
            key = 'actions.send';
          }
        }
        return key;
      }
    },

    methods: {
      clickNextButton() {
        if (this.currentStep === 3) {
          if (this.requestSuccess) {
            this.resetModal();
          } else {
            this.sendFeedback(true, true);
          }
        } else {
          this.goToStep(this.currentStep + 1);
        }
      },

      resetModal() {
        this.show = !this.show;
        this.currentStep = 1;
        this.feedback = '';
        this.email = '';
        this.emailState = true;
        this.requestSuccess = false;
        if (this.show) {
          const textarea = this.$refs.input;
          setTimeout(() => {
            textarea.focus();
          }, 100);
        }
      },

      goToStep(step) {
        this.currentStep = step;
      },

      invalidEmail() {
        this.emailState = false;
      },

      sendFeedback(skip, sendAgain) {
        if (this.emailState || skip || sendAgain) {
          // TODO: post request to Jira Service Desk API
          if (this.requestSuccess) {
            console.log('Feedback has been send');
          } else if (sendAgain) {
            console.log('Send request again');
            this.requestSuccess = true;
          }
          if (this.currentStep !== 3) {
            this.goToStep(this.currentStep + 1);
          }
        }
      }
    }
  };
</script>

<style lang="scss">
  @import '../../assets/scss/variables.scss';

  #feedbackModal {
    position: relative;
    color: $mediumgrey;
    overflow: hidden;
    display: block !important;
    .modal-dialog {
      position: fixed;
      left: 1rem;
      right: 1rem;
      bottom: 1rem;
      margin: 0;
      @media (min-width: $bp-small) {
        left: auto;
        width: 360px;
      }
    }
    &.modal.fade {
      transition: opacity 0.15s linear;
      .modal-dialog {
        transform: translate(0, 50px);
        visibility: hidden;
        transition: visibility 0.15s linear, transform 0.3s ease-out;
      }
    }
    &.modal.showFeedbackModal {
      opacity: 1;
      .modal-dialog {
        visibility: visible;
        transform: none;
      }
    }
    .modal-content {
      .modal-header {
        background-color: $innovationblue;
        padding: 0.75rem 1rem 0.75rem 1rem;
      }
      .modal-title {
        color: $white;
        font-size: 1rem;
      }
      .modal-body {
        padding: 1rem;
        form .form-control {
          padding: 0.75rem;
        }
      }
    }

    .form-group {
      margin-bottom: 0;
    }

    .form-text {
      font-size: 0.875rem;
      margin: 0.75rem 0 0 0;
      a {
        color: $mediumgrey;
      }
    }

    .feedback-success {
      color: $black;
    }

    .button-group-right {
      display: inline;
      float: right;
    }

    .icon-check_circle::before {
      color: $innovationblue;
      font-size: 2.0625rem;
    }

    .icon-cancel-circle::before {
      color: $red;
      font-size: 2.0625rem;
    }
  }
</style>
