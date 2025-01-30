<template>
  <div
    v-if="!onlyShowIfConsentRequired || !allServiceSelectionsStored"
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
          v-for="(section, index) in services"
          :key="index"
        >
          <PageCookiesSection
            :service-data="section"
            :show="show"
            @toggle="toggleDisplay"
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
  import useServiceManager from '@/composables/serviceManager.js';
  import { computed } from 'vue';

  export default {
    // TODO: rename as this is more generally about services than solely cookies
    name: 'PageCookiesWidget',

    components: {
      PageCookiesSection,
      SmartLink: () => import('@/components/generic/SmartLink')
    },

    provide() {
      return {
        statuses: computed(() => this.statuses),
        updateStatus: this.updateStatus
      };
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
      pick: {
        type: Array,
        default: null
      },
      renderToast: {
        type: Boolean,
        default: true
      },
      onlyShowIfConsentRequired: {
        type: Boolean,
        default: true
      }
    },

    setup(props) {
      const {
        apply,
        children,
        deselect,
        enabled,
        forEach,
        resetSelections,
        select,
        selected,
        allServiceSelectionsStored,
        isSelected,
        services
      } = useServiceManager({ pick: props.pick });

      return {
        apply,
        children,
        deselect,
        enabled,
        forEach,
        resetSelections,
        select,
        selected,
        allServiceSelectionsStored,
        isSelected,
        services
      };
    },

    data() {
      return {
        toastId: 'cookie-notice-toast',
        show: ['thirdPartyContent'],
        statuses: {}
      };
    },

    watch: {
      enabled: {
        deep: true,
        handler() {
          this.initStatuses();
        }
      },
      selected: {
        deep: true,
        handler() {
          this.initStatuses();
        }
      }
    },

    created() {
      this.initStatuses();
    },

    methods: {
      updateStatus(serviceName, checked) {
        this.statuses[serviceName].checked = checked;
        if (checked) {
          this.select(serviceName);
        } else {
          this.deselect(serviceName);
        }
      },

      // TODO: could/should this be computed?
      initStatuses() {
        this.forEach((service) => {
          if (service.services) {
            const children = this.children(service);
            const every = children.every(this.isSelected);
            const some = children.some(this.isSelected);
            this.statuses[service.name] = {
              checked: every,
              count: children.length,
              indeterminate: some && !every
            };
          } else {
            this.statuses[service.name] = {
              checked: this.isSelected(service),
              indeterminate: false
            };
          }
        }, { services: this.services });
      },

      openCookieModal() {
        this.$bvModal.show(this.modalId);
        this.$bvToast.hide(this.toastId);
      },

      onModalHide() {
        this.resetSelections();
        if (!this.allServiceSelectionsStored) {
          this.$bvToast.show(this.toastId);
        }
      },

      executeButtonClicked(eventType) {
        this.apply();

        this.$bvModal.hide(this.modalId);

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
        this.executeButtonClicked('save');
      },

      acceptAndHide() {
        for (const serviceName in this.statuses) {
          this.updateStatus(serviceName, true);
        }
        this.executeButtonClicked('accept');
      },

      declineAndHide() {
        for (const serviceName in this.statuses) {
          this.updateStatus(serviceName, false);
        }
        this.executeButtonClicked('decline');
      },

      toggleDisplay(name) {
        if (this.show.includes(name)) {
          this.show = this.show.filter(purpose => purpose !== name);
        } else {
          this.show.push(name);
        }
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
