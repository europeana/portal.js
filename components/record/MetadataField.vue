<template>
  <div
    data-qa="metadata field"
    :data-field-name="name"
  >
    <div data-qa="metadata field name">
      <strong>{{ name }}</strong>
    </div>
    <pre data-qa="metadata field value">
      <code>{{ value }}</code>
    </pre>
  </div>
</template>

<script>
  export default {
    props: {
      name: {
        type: String,
        default: ''
      },
      value: {
        type: [String, Object],
        default: ''
      }
    }
  };
</script>
