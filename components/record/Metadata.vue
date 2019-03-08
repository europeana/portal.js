<template>
  <div>
    <div
      v-for="(value, key) in fields"
      :key="key"
      :data-qa="'field ' + key"
      class="border-bottom mb-3"
    >
      <div><strong>{{ fieldLabel(key) }}</strong></div>
      <pre><code>{{ value }}</code></pre>
    </div>
  </div>
</template>

<script>
  import { fieldLabel } from '../../plugins/europeana/record';

  export default {
    props: {
      fields: {
        type: Object,
        default: () => {}
      }
    },
    methods: {
      fieldLabel: fieldLabel
    }
  };
</script>
