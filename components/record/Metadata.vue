<template>
  <div>
    <div
      v-for="(value, key) in fields"
      :key="key"
      :data-field-name="key"
      data-qa="metadata field"
      class="border-bottom mb-3"
    >
      <div><strong>{{ key }}</strong></div>
      <pre><code>{{ value }}</code></pre>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      fields: {
        type: Object,
        default: () => {}
      }
    }
  };
</script>
