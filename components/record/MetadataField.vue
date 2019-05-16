<template>
  <div
    :data-field-name="name"
    data-qa="metadata field"
  >
    <div data-qa="label">
      <strong>{{ $t(`fieldLabels.${context}.${name}`) }}</strong>
    </div>
    <LangMap
      v-if="isLangMap"
      :value="value"
      data-qa="value"
    />
    <div
      v-else
      data-qa="value"
    >
      {{ value }}
    </div>
  </div>
</template>

<script>
  import LangMap from './LangMap';

  export default {
    components: {
      LangMap
    },
    props: {
      name: {
        type: String,
        default: ''
      },
      value: {
        type: [String, Object],
        default: ''
      },
      context: {
        type: String,
        default: 'default'
      }
    },
    computed: {
      // TODO: move to a plugin? or some other reusable function?
      // TODO: stricter validation by key inspection
      isLangMap: function() {
        return !!this.value && typeof this.value === 'object';
      }
    }
  };
</script>

<style lang="scss" scoped>
  ul {
    list-style: none;
    padding: 0;
  }
</style>
