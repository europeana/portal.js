<template>
  <b-form-checkbox
    :name="serviceOrPurpose.name"
    switch
    :value="true"
    :unchecked-value="false"
    :disabled="serviceOrPurpose.required"
    :checked="checked"
    :class="{ 'secondary': type === 'service' }"
    @change="(value) => $emit('updateConsent',serviceOrPurpose, value)"
  >
    {{ label }}
    <span v-if="serviceOrPurpose.required">{{ $t('klaro.main.consentModal.alwaysRequired') }}</span>
  </b-form-checkbox>
</template>

<script>
  export default {
    name: 'PageCookiesCheckbox',

    props: {
      serviceOrPurpose: {
        type: Object,
        default: () => {}
      },
      type: {
        type: String,
        default: 'service'
      },
      checked: {
        type: Boolean,
        default: false
      }
    },

    computed: {
      label() {
        if (this.type === 'purpose') {
          return this.$t(`klaro.main.purposes.${this.serviceOrPurpose.name}.title`);
        } else {
          return this.$t(`klaro.${this.type}s.${this.serviceOrPurpose.name}.title`);
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  ::v-deep .custom-control-label {
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
