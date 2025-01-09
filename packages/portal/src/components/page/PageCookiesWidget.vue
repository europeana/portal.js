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
          v-for="(service, index) in groupedServices"
          :key="index"
        >
          <PageCookiesCheckbox
            :service-data="service"
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
  import { ref } from 'vue';

  export default {
    name: 'PageCookiesWidget',

    components: {
      PageCookiesCheckbox,
      SmartLink: () => import('@/components/generic/SmartLink')
    },

    provide() {
      return {
        show: this.show,
        checkedServices: this.checkedServices,
        klaroManager: this.klaroManager
      };
    },

    // Do not use the klaro mixin in this component as it will cause side effects for the mixin is already imported in the layout
    props: {
      klaroManager: {
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
        show: ref(['thirdPartyContent']),
        checkedServices: ref([])
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

      groupedServices() {
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
                {
                  name: 'socialMedia',
                  services: this.thirdPartyContentServices.filter(service => service.purposes?.includes('socialMedia'))
                },
                {
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
                {
                  name: 'other',
                  services: this.thirdPartyContentServices.filter(service => service.purposes?.includes('other'))
                }
              ]
            }
        ].filter(Boolean);
      },
      klaroConfig() {
        return this.klaroManager.config;
      }
    },

    mounted() {
      const allRequired = this.klaroConfig?.services?.filter(s => s.required === true).map(s => s.name);
      this.checkedServices.push(...allRequired);
      // TODO: This will need to also load previously accepted "services".
      // For when a user accepts some from the initial interaction,
      // then views the modal on an item page/elsewhere.
    },

    methods: {

      openCookieModal() {
        this.$bvModal.show(this.modalId);
        this.$bvToast.hide(this.toastId);
      },

      onModalHide() {
        if (this.cookieConsentRequired) {
          this.$bvToast.show(this.toastId);
        }
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
