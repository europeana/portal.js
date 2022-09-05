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
      :class="buttonClasses"
      @click="showFeedbackForm"
      @mouseover="bigButton = true"
      @mouseleave="bigButton = false"
    >
      <span class="icon-ic-feedback d-inline-flex" />
      <span
        class="feedback-button-text"
        data-qa="feedback button text"
      >{{ $t('actions.feedback') }}</span>
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
          <div class="d-flex flex-wrap">
            <div class="form-fields">
              <div v-if="currentStep === 1">
                <b-form-textarea
                  ref="input"
                  v-model="feedback"
                  name="feedback"
                  required="required"
                  :placeholder="$t('feedback.validFeedback')"
                  :state="feedbackInputState"
                  rows="5"
                  data-qa="feedback textarea"
                  aria-describedby="input-live-feedback"
                  @invalid="flagInvalidFeedback"
                />
                <b-form-invalid-feedback
                  id="input-live-feedback"
                  data-qa="feedback message invalid"
                >
                  {{ $t('feedback.validFeedback') }}
                </b-form-invalid-feedback>
              </div>
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
                      :to="$path('/rights')"
                      target="_blank"
                    >
                      {{ $t('feedback.termsOfService') }}
                    </b-link>
                    <b-link
                      :to="$path('/rights/privacy-policy')"
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
                <span :class="requestSuccess ? 'icon-check-circle pr-3' : 'icon-cancel-circle pr-3'" />
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
            </div>
            <div class="form-buttons d-flex justify-content-between align-items-end">
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
                  class="mt-3 ml-2"
                  :disabled="disableSkipButton"
                  @click="skipEmail"
                >
                  {{ $t('actions.skip') }}
                </b-button><!-- This comment removes white space
                --><b-button
                  v-if="showNextButton"
                  data-qa="feedback next button"
                  variant="primary"
                  class="button-next-step mt-3 ml-2"
                  type="submit"
                  :disabled="disableNextButton"
                >
                  {{ $t('actions.next') }}
                </b-button>
                <b-button
                  v-if="showSendButton"
                  data-qa="feedback send button"
                  variant="primary"
                  class="mt-3 ml-2"
                  type="submit"
                  :disabled="disableSendButton"
                >
                  {{ $t('actions.send') }}
                </b-button>
                <b-button
                  v-if="showCloseButton"
                  data-qa="feedback close button"
                  variant="primary"
                  class="mt-3 ml-2"
                  @click.prevent="hideFeedbackForm"
                >
                  {{ $t('actions.close') }}
                </b-button>
              </div>
            </div>
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
        requestSuccess: null,
        bigButton: true,
        sending: false
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
          ((this.currentStep === 2) && (this.email === '')) ||
          this.sending;
      },

      disableSendButton() {
        return this.sending;
      },

      disableSkipButton() {
        return this.sending;
      },

      showSkipButton() {
        return this.currentStep === 2;
      },

      showSendButton() {
        return (this.currentStep === 3) && !this.requestSuccess;
      },

      showCloseButton() {
        return !this.showCancelButton;
      },

      buttonClasses() {
        return {
          'hide-button': this.showWidget,
          big: this.bigButton
        };
      }
    },

    mounted() {
      window.addEventListener('scroll', () => this.bigButton = false, { once: true });
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

      validateFeedbackLength() {
        return this.$options.filters.wordLength(this.feedback) >= 5;
      },

      async submitForm() {
        // If this handler gets called, then the fields are valid
        this.feedbackInputState = true;
        this.emailInputState = true;

        if (this.currentStep === 1 && !this.validateFeedbackLength()) {
          this.feedbackInputState = false;
          return;
        }

        if (this.currentStep > 1) {
          await this.sendFeedback();
        }
        if (this.currentStep < 3) {
          this.goToStep(this.currentStep + 1);
        }
      },

      sendFeedback() {
        this.sending = true;

        return this.postFeedbackMessage()
          .then(() => {
            this.requestSuccess = true;
            if (this.currentStep < 3) {
              this.goToStep(this.currentStep + 1);
            }
          })
          .catch(() => {
            this.requestSuccess = false;
          })
          .finally(() => {
            this.sending = false;
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
  @import '@/assets/scss/variables';

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
      white-space: nowrap;
      border-radius: 50%;
      max-width: 50px;
      transition: max-width 0.35s ease-out, border-radius 0.3s ease-out;
      box-shadow: 0 2px 8px rgb(26 26 26 / 25%);

      .icon-ic-feedback {
        padding-right: 0;
        font-size: 1.25rem;
        line-height: 1;
      }

      .feedback-button-text {
        transition: opacity 0.3s ease-out;
        opacity: 0;
      }

      &.hide-button {
        display: none;
      }

      &.big {
        border-radius: 0.3rem;
        max-width: 220px;
        transition: max-width 0.75s ease-out, border-radius 0.25s ease-out;

        .feedback-button-text {
          opacity: 1;
          transition: opacity 0.3s ease-out;
        }

        .icon-ic-feedback {
          padding-right: 0.25rem;
        }
      }

      @media (max-width: $bp-small) {
        &.big {
          max-width: 50px;
          border-radius: 50%;

          .feedback-button-text {
            opacity: 0;
          }

          .icon-ic-feedback {
            padding-right: 0;
          }
        }
      }
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
      min-width: 360px;
    }

    &.show-feedback-widget {
      opacity: 1;
      visibility: visible;
      transform: none;
    }

    .feedback-header {
      background-color: $innovationblue;
      padding: 0.75rem 1rem;

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

      .form-fields {
        flex: 0 1 100%;
        width: 0; // width will grow to space available in flexbox
      }

      .form-buttons {
        flex: 0 1 100%;

        @media (max-width: $bp-small) {
          flex-wrap: wrap;

          .button-group-right {
            width: 100%;
          }

          button {
            width: 100%;
            margin: 0.5rem 0 0 !important;
          }
        }
      }

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
        margin: 0.75rem 0 0;

        a {
          color: $mediumgrey;
        }
      }
    }

    .feedback-success {
      color: $black;
    }

    .icon-check-circle::before {
      color: $innovationblue;
      font-size: 2.0625rem;
    }

    .icon-cancel-circle::before {
      color: $red;
      font-size: 2.0625rem;
    }
  }
</style>
