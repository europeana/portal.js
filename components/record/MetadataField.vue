<template>
  <div
    :data-field-name="name"
    data-qa="metadata field"
  >
    <div data-qa="metadata field name">
      <strong>{{ name }}</strong>
    </div>
    <LangMap
      v-if="isLangMap"
      data-qa="metadata field value"
      :value="value"
    />
    <pre
      v-else
      data-qa="metadata field value"
    >
      <code>{{ value }}</code>
    </pre>
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
      }
    },
    computed: {
      isLangMap: function() {
        return !!this.value && typeof this.value === 'object';
      }
    }
  };
</script>
