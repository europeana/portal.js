<template>
  <b-form-checkbox
    :name="serviceOrPurpose.name"
    switch
    :value="true"
    :unchecked-value="false"
    :disabled="serviceOrPurpose.required"
    :checked="checked"
    @change="(value) => $emit('updateConsent',serviceOrPurpose, value)"
  >
    {{ label }}
  </b-form-checkbox>
</template>

<script>
  export default {
    name: 'PageCookiesCheckbox',

    props: {
      serviceOrPurpose: {
        type: Object,
        default: null
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
