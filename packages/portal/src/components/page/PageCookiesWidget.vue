<template>
  <div>
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
          v-for="(purpose, index) in groupedPurposes"
          :key="index"
        >
          <PageCookiesCheckbox
            :service-or-purpose="purpose"
            type="purpose"
            :checked="purpose.services.every(service => checkedServices.includes(service))"
            :class="{ 'active': purpose.services.some(service => checkedServices.includes(service)) }"
            @updateConsent="updateConsentPerPurpose"
          />
          <p class="mb-0">
            {{ $t(`klaro.main.purposes.${purpose.name}.description`) }}
          </p>
          <b-button
            data-qa="toggle display button"
            :class="{ 'show': show.includes(purpose.name) }"
            variant="link"
            @click="toggleDisplay(purpose.name)"
          >
            {{ $tc('klaro.main.consentModal.servicesCount', purpose.services.length, { count: $n(purpose.services.length) }) }}
            <span class="icon-chevron ml-1" />
          </b-button>
          <ul
            v-if="purpose.subPurposes"
            v-show="show.includes(purpose.name)"
          >
            <li
              v-for="(subPurpose, subPurposeIndex) in purpose.subPurposes"
              :key="subPurposeIndex"
            >
              <PageCookiesCheckbox
                :service-or-purpose="subPurpose"
                type="subPurpose"
                :checked="subPurpose.services.every(service => checkedServices.includes(service))"
                :class="{ 'active': subPurpose.services.some(service => checkedServices.includes(service))}"
                @updateConsent="updateConsentPerPurpose"
              />
              <p class="mb-0">
                {{ $t(`klaro.subPurposes.${subPurpose.name}.description`) }}
              </p>
              <b-button
                :class="{ 'show': show.includes(subPurpose.name) }"
                variant="link"
                @click="toggleDisplay(subPurpose.name)"
              >
                {{ $tc('klaro.main.consentModal.servicesCount', subPurpose.services.length, { count: $n(subPurpose.services.length) }) }}
                <span class="icon-chevron ml-1" />
              </b-button>
              <ul
                v-if="subPurpose.subGroups"
                v-show="show.includes(subPurpose.name)"
              >
                <li
                  v-for="(group, groupIndex) in subPurpose.subGroups"
                  :key="groupIndex"
                >
                  <span class="font-weight-bold text-uppercase">{{ $t(`klaro.subGroups.${group.name}`) }}</span>
                  <ul class="pl-0">
                    <li
                      v-for="(service, serviceIndex) in group.services"
                      :key="serviceIndex"
                    >
                      <PageCookiesCheckbox
                        :service-or-purpose="service"
                        :checked="checkedServices.includes(service)"
                        @updateConsent="updateConsentPerService"
                      />
                    </li>
                  </ul>
                </li>
              </ul>
              <ul
                v-else
                v-show="show.includes(subPurpose.name)"
              >
                <li
                  v-for="(service, serviceIndex) in subPurpose.services"
                  :key="serviceIndex"
                >
                  <PageCookiesCheckbox
                    :service-or-purpose="service"
                    :checked="checkedServices.includes(service)"
                    @updateConsent="updateConsentPerService"
                  />
                </li>
              </ul>
            </li>
          </ul>
          <ul
            v-else
            v-show="show.includes(purpose.name)"
          >
            <li
              v-for="(service, serviceIndex) in purpose.services"
              :key="serviceIndex"
            >
              <PageCookiesCheckbox
                :service-or-purpose="service"
                :checked="checkedServices.includes(service)"
                @updateConsent="updateConsentPerService"
              />
            </li>
          </ul>
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
  import PageCookiesCheckbox from './PageCookiesCheckbox';

  export default {
    // TODO: rename as this is more generally about services than solely cookies
    name: 'PageCookiesWidget',

    components: {
      PageCookiesCheckbox,
      SmartLink: () => import('@/components/generic/SmartLink')
    },

    // Do not use the klaro mixin in this component as it will cause side effects for the mixin is already imported in the layout
    props: {
      klaroManager: {
        type: Object,
        required: true
      },
      klaroConfig: {
        type: Object,
        required: true
      },
      cookieConsentRequired: {
        type: Boolean,
        default: true
      },
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

      groupedPurposes() {
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
              services: this.thirdPartyContentServices,
              subPurposes: [
                {
                  name: 'socialMedia',
                  services: this.thirdPartyContentServices.filter(service => service.subPurpose === 'socialMedia')
                },
                {
                  name: 'mediaViewing',
                  services: this.thirdPartyContentServices.filter(service => service.subPurpose === 'mediaViewing'),
                  subGroups: [{
                    name: '2D',
                    services: this.thirdPartyContentServices.filter(service => service.subPurpose === 'mediaViewing' && service.subGroup === '2D')
                  }, {
                    name: '3D',
                    services: this.thirdPartyContentServices.filter(service => service.subPurpose === 'mediaViewing' && service.subGroup === '3D')
                  }, {
                    name: 'audio',
                    services: this.thirdPartyContentServices.filter(service => service.subPurpose === 'mediaViewing' && service.subGroup === 'audio')
                  }, {
                    name: 'multimedia',
                    services: this.thirdPartyContentServices.filter(service => service.subPurpose === 'mediaViewing' && service.subGroup === 'multimedia')
                  }, {
                    name: 'video',
                    services: this.thirdPartyContentServices.filter(service => service.subPurpose === 'mediaViewing' && service.subGroup === 'video')
                  }]
                },
                {
                  name: 'other',
                  services: this.thirdPartyContentServices.filter(service => service.subPurpose === 'other')
                }
              ]
            }
        ].filter(Boolean)
          .filter(purpose => !this.hidePurposes.includes(purpose.name));
      }
    },

    mounted() {
      this.setCheckedServices();
    },

    methods: {
      updateConsentPerService(service, value) {
        if (service && !service.required) {
          this.klaroManager.updateConsent(service.name, value);

          if (value) {
            !this.checkedServices.includes(service) && this.checkedServices.push(service);
          } else {
            this.checkedServices = this.checkedServices.filter(s => s !== service);
          }
        }
      },

      updateConsentPerPurpose(purpose, value) {
        purpose.services.forEach(service => this.updateConsentPerService(service, value));
      },

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
        this.$emit('consentsApplied');

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
          this.groupedPurposes.forEach(purpose => purpose.services.forEach(service => this.updateConsentPerService(service, true)));
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

      setCheckedServices() {
        const consents = this.klaroManager.loadConsents();
        this.checkedServices = this.klaroConfig?.services?.filter(s => s.required === true || consents[s.name] === true);
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

      p,
      .btn {
        padding-left: 2rem;
      }

      ul {
        padding-left: 2rem;
        margin-bottom: 0.5rem;
        color: $mediumgrey;
      }
    }

    .btn-link {
      margin-bottom: 1rem;

      &:hover,
      &:focus {
        text-decoration: none;
      }

      .icon-chevron {
        display: inline-block;
        font-size: 0.425rem;
      }

      &.show {
        margin-bottom: 0.25rem;

        .icon-chevron {
          transform: rotateX(180deg);
        }
      }
    }
  }
</style>
