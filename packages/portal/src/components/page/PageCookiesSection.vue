<template>
  <div>
    <b-form-checkbox
      :id="`consentcheckbox-${serviceData.name}`"
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
      <label
        :for="`consentcheckbox-${serviceData.name}`"
        class="label"
      >
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
          :checked-services="checkedServices"
          :service-data="subService"
          :show="show"
          @toggle="toggleDisplay"
          @update="updateServiceConsent"
        />
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'PageCookiesSection',

    props: {
      checkedServices: {
        type: Array,
        default: () => []
      },
      serviceData: {
        type: Object,
        default: () => {}
      },
      show: {
        type: Array,
        default: () => []
      }
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
          return this.allChildServicesChecked;
        }
        return this.checkedServices.includes(this.serviceData.name);
      },
      indeterminate() {
        if (this.serviceData.services) {
          return !this.allChildServicesChecked && !this.noChildServicesChecked;
        }
        return false;
      },
      flattenedServiceNames() {
        const childServices = (service) => {
          return service.services ? service.services.map(childServices).flat() : service;
        };
        return childServices(this.serviceData).map((service) => service.name);
      },
      allChildServicesChecked() {
        return this.flattenedServiceNames.every((service) => this.checkedServices.includes(service));
      },
      noChildServicesChecked() {
        return !this.flattenedServiceNames.some((service) => this.checkedServices.includes(service));
      },
      servicesCount() {
        return this.flattenedServiceNames.length;
      }
    },

    methods: {
      updateServiceConsent(service, value) {
        this.$emit('update', service, value);
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
        this.$emit('toggle', name);
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
    margin-bottom: 0.5rem;
  }
</style>
