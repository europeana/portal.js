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
          v-for="(purpose, index) in groupedPurposes"
          :key="index"
        >
          <PageCookiesCheckbox
            :service-or-purpose="purpose"
            type="purpose"
            :checked="purpose.services.every(service => checkedServices.includes(service))"
            @updateConsent="updateConsentPerPurpose"
          />
          <p>{{ $t(`klaro.main.purposes.${purpose.name}.description`) }}</p>
          <b-button
            class="btn-link"
            variant="link"
            @click="toggleDisplay(purpose.name)"
          >
            {{ $tc('klaro.main.consentModal.servicesCount', purpose.services.length, { count: $n(purpose.services.length)}) }}
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
                @updateConsent="updateConsentPerPurpose"
              />
              <b-button
                class="btn-link"
                variant="link"
                @click="toggleDisplay(subPurpose.name)"
              >
                {{ $tc('klaro.main.consentModal.servicesCount', subPurpose.services.length, { count: $n(subPurpose.services.length)}) }}
              </b-button>
              <ul
                v-if="subPurpose.subGroups"
                v-show="show.includes(subPurpose.name)"
              >
                <li
                  v-for="(group, groupIndex) in subPurpose.subGroups"
                  :key="groupIndex"
                >
                  <span>{{ $t(`klaro.subGroups.${group.name}`) }}</span>
                  <ul>
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
  import PageCookiesCheckbox from './PageCookiesCheckbox.vue';

  export default {
    name: 'PageCookiesWidget',

    components: {
      PageCookiesCheckbox,
      SmartLink: () => import('@/components/generic/SmartLink')
    },

    // Do not use the klaro mixin in this component as it will cause side effects for the mixin is already imported in the layout
    props: {
      klaroManager: {
        type: Object,
        default: null
      },
      klaroConfig: {
        type: Object,
        default: null
      },
      cookieConsentRequired: {
        type: Boolean,
        default: true
      }
    },

    data() {
      return {
        modalId: 'cookie-modal',
        toastId: 'cookie-notice-toast',
        show: ['thirdPartyContent'],
        checkedServices: []
      };
    },

    computed: {
      essentialServices() {
        return this.klaroConfig.services.filter(s => s.purposes.includes('essential'));
      },
      usageServices() {
        return this.klaroConfig.services.filter(s => s.purposes.includes('usage'));
      },
      thirdPartyContentServices() {
        return this.klaroConfig.services.filter(s => s.purposes.includes('thirdPartyContent'));
      },

      groupedPurposes() {
        return [ // to create layout
          this.essentialServices.length && {
            name: 'essential',
            required: true,
            services: this.essentialServices
          },
          this.usageServices.length && {
            name: 'usage',
            services: this.usageServices
          },
          this.thirdPartyContentServices.length &&
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
                  }]
                }
              ]
            }
        ].filter(Boolean);
      }
    },

    mounted() {
      this.checkedServices = this.klaroConfig.services.filter(s => s.required === true);
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

      onModalHide() {
        // TODO: is this needed as component is rendered by this condition
        if (this.cookieConsentRequired) {
          this.$bvToast.show(this.toastId);
        }
      },

      updateConsentPerPurpose(purpose, value) {
        purpose.services.forEach(service => this.updateConsentPerService(service, value));
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

<style lang="scss">
  @import '@europeana/style/scss/variables';

  .cookie-notice {
    max-width: 400px;
    width: 400px;
  }
</style>
