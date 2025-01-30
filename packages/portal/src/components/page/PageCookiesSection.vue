<template>
  <div class="consent-checkbox-section">
    <label
      v-if="serviceData.services && depth > COLLAPSIBLE_DEPTH_LIMIT"
      :for="`consentcheckbox-${serviceData.name}`"
      class="label mb-0 font-weight-bold text-uppercase"
    >
      {{ label }}
      <span v-if="serviceData.required">{{ $t('klaro.main.consentModal.alwaysRequired') }}</span>
    </label>
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
        :class="{ 'show': show.includes(serviceData.name) }"
        variant="link"
        @click="toggleDisplay(serviceData.name)"
      >
        {{ $tc('klaro.main.consentModal.servicesCount', count, { count: $n(count)}) }}
        <span class="icon-chevron ml-1" />
      </b-button>
      <ul
        v-show="depth > COLLAPSIBLE_DEPTH_LIMIT || show.includes(serviceData.name)"
        :class="{'pl-0': depth > COLLAPSIBLE_DEPTH_LIMIT}"
      >
        <li
          v-for="(subService, subServiceIndex) in serviceData.services"
          :key="subServiceIndex"
        >
          <PageCookiesSection
            :depth="depth + 1"
            :service-data="subService"
            :show="show"
            @toggle="toggleDisplay"
          />
        </li>
      </ul>
    </template>
  </div>
</template>

<script>
  export default {
    name: 'PageCookiesSection',

    inject: ['statuses', 'updateStatus'],

    props: {
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
        return this.statuses[this.serviceData.name].checked;
      },
      indeterminate() {
        return this.statuses[this.serviceData.name].indeterminate;
      },
      count() {
        return this.statuses[this.serviceData.name].count;
      }
    },

    methods: {
      updateConsent(serviceData, value) {
        if (serviceData.services) {
          serviceData.services.forEach((service) => {
            this.updateStatus(service.name, value);
          });
        }
        this.updateStatus(serviceData.name, value);
      },

      toggleDisplay(name) {
        this.$emit('toggle', name);
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

    ul {
      padding-left: 2rem;
      margin-bottom: 0.5rem;
      list-style: none;
    }

    .label {
      color: $mediumgrey;
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
