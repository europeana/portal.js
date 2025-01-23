<template>
  <div
    v-if="!onlyShowIfConsentRequired || !$serviceManager.selectionsAreStored"
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
      <div class="d-flex justify-content-between align-items-center">
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
            destination="/rights/privacy-policy"
          >
            {{ $t('klaro.main.consentModal.privacyPolicy') }}<!-- This comment removes white space
          -->
          </SmartLink>
        </template>
      </i18n>
      <ul>
        <li
          v-for="(section, index) in servicesToShow"
          :key="index"
        >
          <PageCookiesSection
            :checked-services="checkedServices"
            :service-data="section"
            :show="show"
            @toggle="toggleDisplay"
            @update="updateService"
          />
        </li>
      </ul>
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

  export default {
    // TODO: rename as this is more generally about services than solely cookies
    name: 'PageCookiesWidget',

    components: {
      PageCookiesSection,
      SmartLink: () => import('@/components/generic/SmartLink')
    },

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

    watch: {
      '$serviceManager': {
        deep: true,
        handler() {
          console.log('watch $serviceManager.selections', this.$serviceManager.selections)
          this.checkConsentAndOpenEmbed();
        }
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
      // TODO: refactor to have the purposes to show/hide configurable by deployment env var instead
      servicesToShow() {
        return this.$serviceManager.services.filter((purpose) => !this.hidePurposes.includes(purpose.name));
      },

      flattenedServiceNames() {
        const childServices = (service) => {
          return service.services ? service.services.map(childServices).flat() : service;
        };
        return childServices(this.servicesToShow).map((service) => service.name).filter(Boolean);
      }
    },

    mounted() {
      console.log('service manager', this.$serviceManager)
      console.log('this.$serviceManager.selectionsAreStored', this.$serviceManager.selectionsAreStored)
      this.setCheckedServices();
    },

    methods: {
      openCookieModal() {
        this.$bvModal.show(this.modalId);
        this.$bvToast.hide(this.toastId);
      },

      onModalHide() {
        if (!this.$serviceManager.selectionsAreStored) {
          this.$bvToast.show(this.toastId);
          // TODO: replace this functionality
          // this.klaroManager.changeAll(false);
        }
      },

      executeButtonClicked(eventType) {
        console.log('executeButtonClicked', eventType)
        this.$serviceManager.saveSelections();
        this.setCheckedServices();

        this.$bvModal.hide(this.modalId);
        this.$emit('consentsApplied');

        this.trackButtonClicked(eventType);
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
        // TODO: rename the event
        this.$matomo?.trackEvent('Klaro', 'Clicked', eventName);
      },

      saveAndHide() {
        this.$serviceManager.saveSelections();
        this.executeButtonClicked('save');
      },

      acceptAndHide() {
        // Workaround to only accept the visible services (embed-cookie-modal)
        if (this.hidePurposes.length) {
          this.flattenedServiceNames.forEach((serviceName) => this.enableService(serviceName));
          this.executeButtonClicked('accept');
        } else {
          this.$serviceManager.enableAllServices();
          this.executeButtonClicked('accept');
        }
      },

      declineAndHide() {
        this.$serviceManager.disableAllServices();
        this.executeButtonClicked('decline');
      },

      toggleDisplay(name) {
        if (this.show.includes(name)) {
          this.show = this.show.filter(purpose => purpose !== name);
        } else {
          this.show.push(name);
        }
      },

      updateService(serviceOrName, value) {
        const serviceName = serviceOrName.name || serviceOrName;
        this.$serviceManager.updateService(serviceName, value);
        this.setCheckedServices();
      },

      setCheckedServices() {
        console.log('setCheckedServices', this.$serviceManager.enabledServices)
        this.checkedServices = this.$serviceManager.enabledServices;
        console.log('$serviceManager.selections', this.$serviceManager.selections)
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .cookie-notice {
    max-width: 400px;
    width: 400px;

    .btn-link {
      font-size: $font-size-small;
    }
  }

  .cookie-modal {
    ul {
      list-style: none;
      padding-left: 0;
    }
  }
</style>
