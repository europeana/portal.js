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
  import fieldLabel, { fieldLabellingContexts } from '../../plugins/europeana/labelling';

  export default {
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
        default: 'default',
        validator: (value) => {
          return fieldLabellingContexts().indexOf(value) !== -1;
        }
      }
    },
    computed: {
      fieldNameLabel: function() {
        return fieldLabel(this.name, { context: this.context });
      }
    }
  };
</script>
