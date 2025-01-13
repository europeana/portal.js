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
      :class="{ 'secondary': !serviceData.services, 'active': indeterminate }"
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
      {{ $tc('klaro.main.consentModal.servicesCount', servicesCount, { count: $n(servicesCount)}) }}
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
        <PageCookiesSection
          :service-data="subService"
        />
      </li>
    </ul>
  </div>
</template>

<script>
  import { inject } from 'vue';

  export default {
    name: 'PageCookiesSection',

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
          const servicesToCheck = this.klaroManager.config.services?.filter(s => s.purposes.includes(this.serviceData.name));
          return servicesToCheck.some(service => this.checkedServices.some(checked => checked === service.name));
        }
        return false;
      },
      servicesCount() {
        return this.klaroManager.config.services?.filter(s => s.purposes.includes(this.serviceData.name)).length;
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

  ul {
    list-style: none;
  }

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
  .description {
    margin-bottom: .5rem;
  }
</style>
