<template>
  <div>
    <b-form-checkbox
      :name="serviceData.name"
      switch
      :value="true"
      :unchecked-value="false"
      :disabled="serviceData.required"
      :checked="checked"
      :indeterminate="indeterminate"
      :class="{ 'secondary': !serviceData.services, 'active': checked }"
      @change="(value) => updateConsent(serviceData, value)"
    >
      <label class="label">
        {{ label }}
        <span v-if="serviceData.required">{{ $t('klaro.main.consentModal.alwaysRequired') }}</span>
      </label>
      <div
        v-if="description"
        class="description"
      >
        {{ description }}
      </div>
    </b-form-checkbox>
    <b-button
      v-if="serviceData.services"
      :class="{ 'show': show.includes(serviceData.name) }"
      variant="link"
      @click="toggleDisplay(serviceData.name)"
    >
      <!-- TODO: calculate complete service count, including sub-services -->
      {{ $tc('klaro.main.consentModal.servicesCount', serviceData.services.length, { count: $n(serviceData.services.length)}) }}
      <span class="icon-chevron ml-1" />
    </b-button>
    <ul
      v-if="serviceData.services"
      v-show="show.includes(serviceData.name)"
    >
      <li
        v-for="(subService, subServiceIndex) in serviceData.services"
        :key="subServiceIndex"
      >
        <PageCookiesCheckbox
          :service-data="subService"
        />
      </li>
    </ul>
  </div>
</template>

<script>
  import { inject } from 'vue';

  export default {
    name: 'PageCookiesCheckbox',

    props: {
      serviceData: {
        type: Object,
        default: () => {}
      }
    },

    setup() {
      const show = inject('show');
      const checkedServices = inject('checkedServices');
      const klaroManager = inject('klaroManager');
      return { show, checkedServices, klaroManager };
    },

    computed: {
      label() {
        if (this.serviceData.services) {
          return this.$t(`klaro.main.purposes.${this.serviceData.name}.title`);
        } else {
          return this.$t(`klaro.services.${this.serviceData.name}.title`);
        }
      },
      description() {
        let key;
        if (this.serviceData.services) {
          key = `klaro.main.purposes.${this.serviceData.name}.description`;
        } else {
          key = `klaro.services.${this.serviceData.name}.description`;
        }
        if (this.$te(key, this.$i18n.fallbackLocale)) {
          return this.$t(key);
        }
        return undefined;
      },
      checked() {
        if (this.serviceData.services) {
          return this.serviceData.services.every(service => this.checkedServices.includes(service.name));
        }
        return this.checkedServices.includes(this.serviceData.name);
      },
      indeterminate() {
        if (this.serviceData.services && !this.checked) {
          return this.serviceData.services.some(service => this.checkedServices.includes(service.name));
        }
        return false;
      }
    },

    methods: {
      updateServiceConsent(service, value) {
        if (service && !service.required) {
          this.klaroManager.updateConsent(service.name, value);

          if (value) {
            !this.checkedServices.includes(service.name) && this.checkedServices.push(service.name);
          } else {
            this.checkedServices.splice(this.checkedServices.indexOf(service.name), 1);
          }
        }
      },

      updateConsent(serviceData, value) {
        if (serviceData.services) {
          serviceData.services.forEach(service => {
            this.updateConsent(service, value);
          });
        }
        this.updateServiceConsent(serviceData, value);
      },

      toggleDisplay(name) {
        console.log(name);
        if (this.show.includes(name)) {
          this.show.splice(this.show.indexOf(name), 1);
        } else {
          this.show.push(name);
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .label {
    color: $black;
    font-weight: 600;
    font-size: $font-size-small;

    span {
      color: $mediumgrey-light;
      text-transform: lowercase;
    }
  }

  ::v-deep.custom-switch {

    &.secondary .custom-control-label {
      color: $mediumgrey !important;
      font-weight: 400;
    }

    .custom-control-input {
      &:disabled, &[disabled] {
        & ~ .custom-control-label {
          color: $black;
        }
      }
    }

    &.active .custom-control-input:not(:checked) {
      ~ .custom-control-label::after {
        left: -1.625rem;
        border-color: $blue;
      }
    }
  }
</style>
