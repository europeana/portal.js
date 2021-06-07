<template>
  <div
    class="feedback-container"
  >
    <b-button
      ref="button"
      variant="primary"
      data-qa="feedback button"
      size="lg"
      class="feedback-button text-decoration-none"
      :class="showWidget ? 'hide-button' : null"
      @click="showFeedbackForm"
    >
      <span class="icon-ic-feedback d-inline-flex" />
      {{ $t('actions.feedback') }}
    </b-button>
    <div
      role="dialog"
      aria-labelledby="dialogHeader"
      class="feedback-widget shadow"
      data-qa="feedback widget"
      content-class="shadow"
      :class="showWidget ? 'show-feedback-widget' : null"
    >
      <div
        id="dialogHeader"
        class="feedback-header"
      >
        <h5>{{ $t('feedback.title') }}</h5>
      </div>
      <b-form
        class="feedback-form"
        data-qa="feedback widget form"
        @submit.prevent="submitForm"
      >
        <b-form-group>
          <b-form-textarea
            v-if="currentStep === 1"
            ref="input"
            v-model="feedback"
            name="feedback"
            required="required"
            :placeholder="$t('feedback.form.placeholders.feedback')"
            :state="feedbackInputState"
            rows="5"
            data-qa="feedback textarea"
            @invalid="flagInvalidFeedback"
          />
          <div
            v-if="currentStep === 2"
            id="step2"
          >
            <b-form-input
              v-model="email"
              autofocus
              type="email"
              name="email"
              :placeholder="$t('feedback.form.placeholders.email')"
              :state="emailInputState"
              aria-describedby="input-live-feedback"
              data-qa="feedback email input"
              @invalid="flagInvalidEmail"
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
                path="feedback.policies"
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
              v-else-if="requestSuccess === false"
            >
              <p class="mb-0">{{ $t('feedback.failed') }}</p>
            </span>
          </div>
          <b-button
            v-if="showCancelButton"
            data-qa="feedback cancel button"
            variant="outline-primary"
            class="mt-3"
            @click.prevent="hideFeedbackForm"
          >
            {{ $t('actions.cancel') }}
          </b-button>
          <div class="button-group-right">
            <b-button
              v-if="showSkipButton"
              data-qa="feedback skip button"
              variant="outline-primary"
              class="mt-3"
              @click="skipEmail"
            >
              {{ $t('actions.skip') }}
            </b-button>
            <b-button
              v-if="showNextButton"
              data-qa="feedback next button"
              variant="primary"
              class="button-next-step mt-3"
              type="submit"
              :disabled="disableNextButton"
            >
              {{ $t('actions.next') }}
            </b-button>
            <b-button
              v-if="showSendButton"
              data-qa="feedback send button"
              variant="primary"
              class="mt-3"
              type="submit"
            >
              {{ $t('actions.send') }}
            </b-button>
            <b-button
              v-if="showCloseButton"
              data-qa="feedback close button"
              variant="primary"
              class="mt-3"
              @click.prevent="hideFeedbackForm"
            >
              {{ $t('actions.close') }}
            </b-button>
          </div>
        </b-form-group>
      </b-form>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    name: 'FeedbackWidget',

    data() {
      return {
        showWidget: false,
        currentStep: 1,
        feedback: '',
        feedbackInputState: true,
        email: '',
        emailInputState: true,
        requestSuccess: null
      };
    },

    computed: {
      showCancelButton() {
        return (this.currentStep < 3) || !this.requestSuccess;
      },

      showNextButton() {
        return this.currentStep < 3;
      },

      disableNextButton() {
        return ((this.currentStep === 1) && (this.feedback === '')) ||
          ((this.currentStep === 2) && (this.email === ''));
      },

      showSkipButton() {
        return this.currentStep === 2;
      },

      showSendButton() {
        return (this.currentStep === 3) && !this.requestSuccess;
      },

      showCloseButton() {
        return !this.showCancelButton;
      }
    },

    methods: {
      resetForm() {
        this.currentStep = 1;
        this.feedback = '';
        this.feedbackInputState = true;
        this.email = '';
        this.emailInputState = true;
        this.requestSuccess = null;
      },

      showFeedbackForm() {
        this.resetForm();
        this.showWidget = true;
        this.$nextTick(() => {
          const textarea = this.$refs.input;
          textarea.focus();
        });
      },

      hideFeedbackForm() {
        this.showWidget = false;
        this.$nextTick(() => {
          const button = this.$refs.button;
          button.focus();
        });
      },

      goToStep(step) {
        this.currentStep = step;
      },

      flagInvalidEmail() {
        this.emailInputState = false;
      },

      flagInvalidFeedback() {
        this.feedbackInputState = false;
      },

      skipEmail() {
        this.email = '';
        this.submitForm();
      },

      async submitForm() {
        // If this handler gets called, then the fields are valid
        this.feedbackInputState = true;
        this.emailInputState = true;

        if (this.currentStep > 1) {
          await this.sendFeedback();
        }
        if (this.currentStep < 3) {
          this.goToStep(this.currentStep + 1);
        }
      },

      sendFeedback() {
        return this.postFeedbackMessage()
          .then(() => {
            this.requestSuccess = true;
            if (this.currentStep < 3) {
              this.goToStep(this.currentStep + 1);
            }
          })
          .catch(() => {
            this.requestSuccess = false;
          });
      },

      postFeedbackMessage() {
        const postData = {
          feedback: this.feedback,
          pageUrl: window.location.href,
          browser: navigator.userAgent,
          screensize: `${window.innerWidth} x ${window.innerHeight}`
        };
        if (this.email && (this.email !== '')) {
          postData.email = this.email;
        }

        // For testing purposes, uncomment the following `if` block to cause the
        // request always to fail on the first attempt, showing the error message,
        // but then succeeding on subsequent attempts.
        // if (this.requestSuccess === null) {
        //   delete postData.summary;
        // }

        return axios.create({
          baseURL: this.$config.app.baseUrl
        }).post(
          '/_api/jira/service-desk',
          postData
        );
      }
    }
  };
</script>

<style lang="scss">
  @import '../../assets/scss/variables.scss';

  .feedback-container {
    position: fixed;
    right: 1rem;
    bottom: 1rem;
    z-index: 1050;
    @media (min-width: $bp-small) {
      left: auto;
    }
    .feedback-button {
      position: fixed;
      right: 1rem;
      bottom: 1rem;
      z-index: 1000;
      text-transform: capitalize;
      padding: 0.875rem;
      line-height: 1;
      border-color: $white;
      span {
        padding-right: 0.25rem;
      }
      &.hide-button {
        display: none;
      }
      @media (max-width: $bp-small) {
        font-size: 0;
        border-radius: 50%;
        span {
          padding-right: 0;
        }
      }
    }
    .icon-ic-feedback {
      font-size: 1.25rem;
    }
  }

  .feedback-widget {
    border-radius: 0.3rem;
    background-color: $white;
    color: $mediumgrey;
    visibility: hidden;
    opacity: 0;
    transform: translate(0, 50px);
    transition: opacity 0.15s linear, transform 0.3s ease-out;
    position: fixed;
    left: 1rem;
    right: 1rem;
    bottom: 1rem;
    margin: 0;
    overflow: hidden;
    @media (min-width: $bp-small) {
      left: auto;
      width: 360px;
    }
    &.show-feedback-widget {
      opacity: 1;
      visibility: visible;
      transform: none;
    }

    .feedback-header {
      background-color: $innovationblue;
      padding: 0.75rem 1rem 0.75rem 1rem;
      h5 {
        color: $white;
        font-size: 1rem;
        line-height: 1.5;
        font-weight: 600;
        margin: 0;
      }
    }

    .feedback-form {
      padding: 1rem;
      .form-control {
        padding: 0.75rem;
        background: $white;
        border: 1px solid $mediumgrey;
        border-radius: 0.375rem;
        font-size: $font-size-base;
        height: 3rem;
        color: $black;
        &:focus {
          border-color: $innovationblue;
        }
        &.is-invalid {
          border-color: $red;
        }
      }
      textarea.form-control {
        height: auto;
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
    }

    .button-group-right {
      display: inline;
      float: right;
    }
    .feedback-success {
      color: $black;
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
