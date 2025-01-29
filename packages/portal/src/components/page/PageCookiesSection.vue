<template>
  <component
    :is="renderServiceAsCheckbox() ? 'div' : 'fieldset'"
    class="consent-checkbox-section"
  >
    <legend
      v-if="!renderServiceAsCheckbox()"
      :for="`consentcheckbox-${serviceData.name}`"
      class="legend mb-0 font-weight-bold text-uppercase"
    >
      {{ label }}
      <span v-if="serviceData.required">{{ $t('klaro.main.consentModal.alwaysRequired') }}</span>
    </legend>
    <b-form-checkbox
      v-else
      :id="`consentcheckbox-${serviceData.name}`"
      :name="serviceData.name"
      switch
      :value="true"
      :unchecked-value="false"
      :disabled="serviceData.required"
      :checked="checked"
      :indeterminate="indeterminate"
      :class="{ 'secondary': !serviceData.services, 'active': indeterminate }"
      :aria-describedby="description && `consentcheckbox-description-${serviceData.name}`"
      :aria-checked="indeterminate && 'mixed'"
      :aria-controls="nestedCheckboxIds"
      @change="(value) => updateConsent(serviceData, value)"
    >
      {{ label }}
      <span v-if="serviceData.required">{{ $t('klaro.main.consentModal.alwaysRequired') }}</span>
    </b-form-checkbox>
    <p
      v-if="description"
      :id="`consentcheckbox-description-${serviceData.name}`"
      class="description mb-0"
    >
      {{ description }}
    </p>
    <template
      v-if="serviceData.services"
    >
      <b-button
        v-if="depth <= COLLAPSIBLE_DEPTH_LIMIT"
        :class="{ 'show': showNestedServices }"
        variant="link"
        :aria-controls="`consentcheckbox-subsection-${serviceData.name}`"
        :aria-expanded="showNestedServices ? 'true' : 'false'"
        @click="toggleDisplay(serviceData.name)"
      >
        {{ $tc('klaro.main.consentModal.servicesCount', servicesCount, { count: $n(servicesCount)}) }}
        <span class="icon-chevron ml-1" />
      </b-button>
      <div
        v-if="depth > COLLAPSIBLE_DEPTH_LIMIT || show.includes(serviceData.name)"
        :id="`consentcheckbox-subsection-${serviceData.name}`"
      >
        <PageCookiesSection
          v-for="(subService, subServiceIndex) in serviceData.services"
          :key="subServiceIndex"
          class="nested-section"
          :class="{'pl-0': depth > COLLAPSIBLE_DEPTH_LIMIT}"
          :checked-services="checkedServices"
          :depth="depth + 1"
          :service-data="subService"
          :show="show"
          @toggle="toggleDisplay"
          @update="updateServiceConsent"
        />
      </div>
    </template>
  </component>
</template>

<script>
  export default {
    name: 'PageCookiesSection',

    props: {
      checkedServices: {
        type: Array,
        default: () => []
      },
      depth: {
        type: Number,
        default: 1
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

    data() {
      return {
        COLLAPSIBLE_DEPTH_LIMIT: 2
      };
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
      },
      showNestedServices() {
        return this.show.includes(this.serviceData.name);
      },
      nestedCheckboxIds() {
        if (this.serviceData.services) {
          return this.serviceData.services.reduce((checkBoxIds, service) => {
            checkBoxIds.push(...this.getCheckboxIdsForService(service, this.depth + 1));
            return checkBoxIds;
          }, []).join(' ');
        } else {
          return null;
        }
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
      },

      renderServiceAsCheckbox(service = this.serviceData, depth = this.depth) {
        return service.services ? depth <= this.COLLAPSIBLE_DEPTH_LIMIT : true;
      },

      getCheckboxIdsForService(service, depth) {
        const checkBoxIds = [];

        if (this.renderServiceAsCheckbox(service, depth)) {
          checkBoxIds.push(`consentcheckbox-${service.name}`);
        }

        if (service.services) {
          service.services.forEach(nestedService => {
            checkBoxIds.push(...this.getCheckboxIdsForService(nestedService, depth + 1));
          });
        }

        return checkBoxIds;
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .consent-checkbox-section {
    p,
    .btn {
      padding-left: 2rem;
    }

    .nested-section {
      padding-left: 2rem;

      &:last-child {
        margin-bottom: 0.5rem;
      }
    }

    .legend {
      color: $mediumgrey;
      font-size: $font-size-small;
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

  ::v-deep.custom-switch {

    .custom-control-label {
      font-size: $font-size-small;
      font-weight: 600;

      &:before,
      &:after {
        border-color: $black;
      }

      span {
        color: $mediumgrey-light;
        text-transform: lowercase;
      }
    }

    &.secondary {
      .custom-control-label {
        color: $mediumgrey !important;
        font-weight: 400;
      }
    }

    .custom-control-input {
      &:disabled, &[disabled] {
        & ~ .custom-control-label {
          color: $black;
        }
      }
    }

    &.secondary .custom-control-input:not(:checked) ~ .custom-control-label {
      &:before,
      &:after {
        border-color: $mediumgrey;
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
