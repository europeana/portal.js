<template>
  <div
    :data-field-name="name"
    data-qa="metadata field"
  >
    <div data-qa="label">
      <strong>{{ fieldNameLabel }}</strong>
    </div>
    <pre data-qa="value">
      <code>{{ value }}</code>
    </pre>
  </div>
</template>

<script>
  import { fieldLabel } from '../../plugins/europeana/record';

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
    },
    computed: {
      fieldNameLabel: function() {
        return fieldLabel(this.name);
      }
    }
  };
</script>
