<template>
  <div
    v-if="!onlyShowIfConsentRequired || cookieConsentRequired"
  >
    <b-toast
      v-if="renderToast"
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
      <div class="d-flex flex-wrap justify-content-between align-items-center">
        <b-button
          data-qa="learn more button"
          class="p-0"
          variant="link"
          @click="openCookieModal"
        >
          {{ $t('klaro.main.consentNotice.learnMore') }}
        </b-button>
        <b-button
          data-qa="decline button"
          variant="outline-primary"
          class="ml-auto mr-2"
          @click="declineAndHide"
        >
          {{ $t('klaro.main.decline') }}
        </b-button>
        <b-button
          data-qa="accept all button"
          variant="success"
          @click="acceptAndHide"
        >
          {{ $t('klaro.main.ok') }}
        </b-button>
      </div>
    </b-toast>
    <!-- TODO Move modal into own component -->
    <b-modal
      :id="modalId"
      modal-class="cookie-modal"
      size="xl"
      hide-footer
      hide-header-close
      :title="$t(modalTitlePath)"
      title-tag="h2"
      header-tag="div"
      @hide="onModalHide"
      @show="setCheckedServices"
    >
      <i18n
        v-if="modalDescriptionPath"
        :path="modalDescriptionPath"
        tag="p"
      >
        <template #privacyPolicy>
          <SmartLink
            destination="/rights/privacy-statement"
          >
            {{ $t('klaro.main.consentModal.privacyPolicy') }}<!-- This comment removes white space
          -->
          </SmartLink>
        </template>
      </i18n>
      <PageCookiesSection
        v-for="(section, index) in groupedSections"
        :key="index"
        :checked-services="checkedServices"
        :service-data="section"
        :show="show"
        @toggle="toggleDisplay"
        @update="updateConsent"
      />
      <div class="d-flex flex-wrap justify-content-between align-items-center">
        <b-button
          class="mt-2"
          variant="outline-primary"
          @click="declineAndHide"
        >
          {{ $t('klaro.main.decline') }}
        </b-button>
        <b-button
          data-qa="accept selected button"
          variant="outline-primary"
          class="mt-2 ml-auto mr-2"
          @click="saveAndHide"
        >
          {{ $t('klaro.main.acceptSelected') }}
        </b-button>
        <b-button
          class="mt-2"
          variant="success"
          data-qa="accept all button"
          @click="acceptAndHide"
        >
          {{ $t('klaro.main.acceptAll') }}
        </b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import PageCookiesSection from './PageCookiesSection.vue';
  import klaroMixin from '@/mixins/klaro.js';
  import waitFor from '@/utils/waitFor.js';

  export default {
    // TODO: rename as this is more generally about services than solely cookies
    name: 'PageCookiesWidget',

    components: {
      PageCookiesSection,
      SmartLink: () => import('@/components/generic/SmartLink')
    },

    mixins: [
      klaroMixin
    ],

    props: {
      modalId: {
        type: String,
        default: 'cookie-modal'
      },
      modalTitlePath: {
        type: String,
        default: 'klaro.main.consentModal.title'
      },
      modalDescriptionPath: {
        type: String,
        default: 'klaro.main.consentModal.text'
      },
      renderToast: {
        type: Boolean,
        default: true
      },
      showModal: {
        type: Boolean,
        default: false
      },
      // TODO: invert this to a whitelist, named `showPurposes`
      hidePurposes: {
        type: Array,
        default: () => []
      },
      onlyShowIfConsentRequired: {
        type: Boolean,
        default: true
      }
    },

    data() {
      return {
        toastId: 'cookie-notice-toast',
        show: ['thirdPartyContent'],
        checkedServices: []
      };
    },

    computed: {
      essentialServices() {
        return this.klaroConfig?.services?.filter(s => s.purposes.includes('essential'));
      },
      usageServices() {
        return this.klaroConfig?.services?.filter(s => s.purposes.includes('usage'));
      },
      thirdPartyContentServices() {
        return this.klaroConfig?.services?.filter(s => s.purposes.includes('thirdPartyContent'));
      },

      groupedSections() {
        return [ // to create layout
          this.essentialServices?.length && {
            name: 'essential',
            required: true,
            services: this.essentialServices
          },
          this.usageServices?.length && {
            name: 'usage',
            services: this.usageServices
          },
          this.thirdPartyContentServices?.length &&
            {
              name: 'thirdPartyContent',
              services: [
                this.thirdPartyContentServices.filter(service => service.purposes?.includes('socialMedia'))?.length && {
                  name: 'socialMedia',
                  services: this.thirdPartyContentServices.filter(service => service.purposes?.includes('socialMedia'))
                },
                this.thirdPartyContentServices.filter(service => service.purposes?.includes('mediaViewing'))?.length && {
                  name: 'mediaViewing',
                  services: [
                    {
                      name: '2D',
                      services: this.thirdPartyContentServices.filter(service => service.purposes?.includes('2D'))
                    }, {
                      name: '3D',
                      services: this.thirdPartyContentServices.filter(service => service.purposes?.includes('3D'))
                    }, {
                      name: 'audio',
                      services: this.thirdPartyContentServices.filter(service => service.purposes?.includes('audio'))
                    }, {
                      name: 'multimedia',
                      services: this.thirdPartyContentServices.filter(service => service.purposes?.includes('multimedia'))
                    }, {
                      name: 'video',
                      services: this.thirdPartyContentServices.filter(service => service.purposes?.includes('video'))
                    }
                  ]
                },
                this.thirdPartyContentServices.filter(service => service.purposes?.includes('other'))?.length && {
                  name: 'other',
                  services: this.thirdPartyContentServices.filter(service => service.purposes?.includes('other'))
                }
              ].filter(Boolean)
            }
        ].filter(Boolean)
          .filter(purpose => !this.hidePurposes.includes(purpose.name));
      },

      flattenedServiceNames() {
        const childServices = (service) => {
          if (Array.isArray(service)) {
            return service.map(childServices).flat();
          } else if (service.services) {
            return childServices(service.services);
          } else {
            return [service];
          }
        };
        return childServices(this.groupedSections).map((service) => service.name);
      }
    },

    watch: {
      // klaroManager is likely not available in mounted so watch it to be ready instead
      klaroManager(newVal) {
        if (newVal) {
          this.setCheckedServices();
        }
      }
    },

    mounted() {
      waitFor(() => this.klaroManager)
        .then(() => {
          this.setCheckedServices();
          if (this.showModal) {
            this.openCookieModal();
          }
        });
    },

    methods: {
      openCookieModal() {
        this.$bvModal.show(this.modalId);
        this.$bvToast.hide(this.toastId);
      },

      onModalHide() {
        if (this.cookieConsentRequired) {
          this.$bvToast.show(this.toastId);
          this.klaroManager.changeAll(false);
        }
      },

      executeButtonClicked(setChangedAll, changedAllValue, eventType, trackAsDifferentEventType) {
        if (setChangedAll) {
          this.klaroManager.changeAll(changedAllValue);
        }

        this.klaroManager.saveAndApplyConsents(eventType);
        this.setCheckedServices();

        this.$bvModal.hide(this.modalId);

        this.trackButtonClicked(trackAsDifferentEventType || eventType);
      },

      trackButtonClicked(eventType) {
        let context = 'main cookie widget';

        const eventName = {
          accept: 'Okay/Accept all',
          decline: 'Decline',
          save: 'Accept selected'
        }[eventType];

        if (eventName && this.modalId === 'embed-cookie-modal') {
          context = 'third party content modal';
        }

        this.$matomo?.trackEvent(context, 'Save cookie preferences', eventName);
        // keep tracking the event like this to align with past reports
        this.$matomo?.trackEvent('Klaro', 'Clicked', eventName);
      },

      saveAndHide() {
        this.executeButtonClicked(false, false, 'save');
      },

      acceptAndHide() {
        // Workaround to only accept the visible services (embed-cookie-modal)
        if (this.hidePurposes.length) {
          this.flattenedServiceNames.forEach((serviceName) => this.updateConsent(serviceName, true));
          this.executeButtonClicked(false, false, 'save', 'accept');
        } else {
          this.executeButtonClicked(true, true, 'accept');
        }
      },

      declineAndHide() {
        this.executeButtonClicked(true, false, 'decline');
      },

      toggleDisplay(name) {
        if (this.show.includes(name)) {
          this.show = this.show.filter(purpose => purpose !== name);
        } else {
          this.show.push(name);
        }
      },

      updateConsent(serviceOrName, value) {
        const serviceName = serviceOrName.name || serviceOrName;
        this.klaroManager.updateConsent(serviceName, value);
        if (value) {
          this.checkedServices.push(serviceName);
        } else {
          this.checkedServices = this.checkedServices.filter((name) => name !== serviceName);
        }
      },

      setCheckedServices() {
        const consents = this.klaroManager.loadConsents();

        this.checkedServices = this.klaroConfig?.services
          ?.filter(s => s.required === true || consents[s.name] === true)
          .map(s => s.name);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  ::v-deep .cookie-notice {
    max-width: 100%;

    @media (min-width: $bp-medium) {
      max-width: toRem(400);
      width: toRem(400);
    }

    .btn-link {
      font-size: $font-size-small;
    }
  }
</style>
