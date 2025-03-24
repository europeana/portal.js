<template>
  <div class="contentful">
    <b-form-group>
      <b-form-input
        v-model="value"
        type="text"
        disabled
      />
    </b-form-group>
  </div>
</template>

<script>
  export default {
    name: 'ContentfulDisabledSingleLinePage',

    layout: 'contentful',

    data() {
      return {
        value: null,
        contentfulExtensionSdk: null
      };
    },

    head() {
      return {
        title: 'Disabled single line - Contentful app',
        bodyAttrs: {
          class: '',
          style: 'background: transparent;'
        }
      };
    },

    mounted() {
      window.contentfulExtension.init((sdk) => {
        this.contentfulExtensionSdk = sdk;
        if (sdk.location.is(window.contentfulExtension.locations.LOCATION_ENTRY_FIELD)) {
          sdk.window.startAutoResizer();
          this.value = sdk.field.getValue();
          // onValueChanged returns a detachValueChangeHandler, should we use this?
          sdk.field.onValueChanged(this.updateValue);
        }
      });
    },

    methods: {
      updateValue(value) {
        this.value = value;
      }
    }
  };
</script>

<style lang="scss" scoped>
  .contentful {
    font-size: 11px;
  }
</style>
