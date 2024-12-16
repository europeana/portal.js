<template>
  <div>
    <b-toast
      :id="toastId"
      is-status
      no-auto-hide
      no-close-button
      solid
      toast-class="brand-toast-white cookie-notice"
      visible
      append-toast
      toaster="b-toaster-bottom-left"
    >
      <p>{{ $t('klaro.main.consentNotice.description') }}</p>
      <div class="d-flex justify-content-between align-items-center">
        <a
          href="#"
          @click="openCookieModal"
        >
          {{ $t('klaro.main.consentNotice.learnMore') }}
        </a>
        <b-button
          variant="outline-primary"
          class="ml-auto mr-2"
          @click="declineAndHide"
        >
          {{ $t('klaro.main.decline') }}
        </b-button>
        <b-button
          variant="success"
          @click="acceptAndHide"
        >
          {{ $t('klaro.main.ok') }}
        </b-button>
      </div>
    </b-toast>
    <b-modal
      :id="modalId"
      size="xl"
      hide-footer
      hide-header-close
      :title="$t('klaro.main.consentModal.title')"
      @hide="onModalHide"
    >
      <i18n
        path="klaro.main.consentModal.description"
        tag="p"
      >
        <template #privacyPolicy>
          <SmartLink
            destination="/rights/privacy-policy"
          >
            {{ $t('klaro.main.consentModal.privacyPolicy') }}<!-- This comment removes white space
          -->
          </SmartLink>
        </template>
      </i18n>
      <ul>
        <li
          v-for="(service, index) in klaroConfig.services"
          :key="index"
        >
          <b-form-checkbox
            :name="service.name"
            switch
            :value="true"
            :unchecked-value="false"
            :disabled="service.required"
            :checked="service.required ? true : false"
            @change="(value) => onChange(service, value)"
          >
            {{ service.name }}
          </b-form-checkbox>
        </li>
      </ul>
      <div class="d-flex justify-content-between align-items-center">
        <b-button
          variant="outline-primary"
          @click="declineAndHide"
        >
          {{ $t('klaro.main.decline') }}
        </b-button>
        <b-button
          variant="outline-primary"
          class="ml-auto mr-2"
          @click="saveAndHide"
        >
          {{ $t('klaro.main.acceptSelected') }}
        </b-button>
        <b-button
          variant="success"
          @click="acceptAndHide"
        >
          {{ $t('klaro.main.acceptAll') }}
        </b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import klaroMixin from '@/mixins/klaro.js';

  export default {
    name: 'PageCookieConsent',

    components: {
      SmartLink: () => import('@/components/generic/SmartLink')
    },

    mixins: [klaroMixin],

    data() {
      return {
        modalId: 'cookie-modal',
        toastId: 'cookie-notice-toast'
      };
    },

    methods: {
      onChange(service, value) {
        if (!service.required) {
          this.klaroManager.updateConsent(service.name, value);
        }
      },

      onModalHide() {
        if (this.cookieConsentRequired) {
          this.$bvToast.show(this.toastId);
        }
      },

      openCookieModal() {
        this.$bvModal.show(this.modalId);
        this.$bvToast.hide(this.toastId);
      },

      executeButtonClicked(setChangedAll, changedAllValue, eventType) {
        if (setChangedAll) {
          this.klaroManager.changeAll(changedAllValue);
        }

        this.klaroManager.saveAndApplyConsents(eventType);
        this.cookieConsentRequired = !this.klaroManager.confirmed;

        this.$bvModal.hide(this.modalId);
      },

      saveAndHide() {
        this.executeButtonClicked(false, false, 'save');
      },

      acceptAndHide() {
        this.executeButtonClicked(true, true, 'accept');
      },

      declineAndHide() {
        this.executeButtonClicked(true, false, 'decline');
      }
    }
  };
</script>

<style lang="scss">
  @import '@europeana/style/scss/variables';

  .cookie-notice {
    max-width: 400px;
    width: 400px;
  }
</style>
