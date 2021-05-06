<template>
  <b-modal
    id="feedbackModal"
    v-model="modalShow"
    title="Send feedback"
    hide-header-close
    hide-footer
    data-qa="feedback modal"
  >
    <b-form-group
      v-if="currentStep === 1"
      id="step1"
    >
      <b-form-textarea
        v-model="step1.feedback"
        name="feedback"
        placeholder="Enter your feedback here"
      />
      <b-button
        variant="primary"
        class="mt-4"
        @click.prevent="goToStep(2)"
      >
        {{ $t('actions.next') }}
      </b-button>
    </b-form-group>
    <b-form-group
      v-if="currentStep === 2"
      id="step2"
    >
      <b-form-input
        v-model="step2.email"
        type="email"
        name="email"
        placeholder="Enter your email address"
      />

      <b-button
        variant="primary"
        class="mt-4"
        @click.prevent="goToStep(3)"
      >
        {{ $t('actions.send') }}
      </b-button>
    </b-form-group>
    <div
      v-if="currentStep == 3"
      id="step3"
    >
      {{ $t('feedback.success') }}
    </div>
    <b-button
      :variant="currentStep === 3 ? 'primary' : 'outline-primary'"
      class="mt-4"
      @click="$bvModal.hide('feedbackModal')"
    >
      {{ $t('actions.close') }}
    </b-button>
  </b-modal>
</template>

<script>

  export default {
    name: 'FeedbackModal',

    data() {
      return {
        modalShow: true,
        currentStep: 1,
        step1: {
          feedback: ''
        },
        step2: {
          email: ''
        }
      };
    },

    methods: {
      goToStep(step) {
        this.currentStep = step;
      }
    }
  };
</script>

<style lang="scss">
  @import '../../assets/scss/variables.scss';

</style>
