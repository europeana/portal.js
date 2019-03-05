<template>
  <b-list-group>
    <b-list-group-item
      v-for="webResource in media"
      :key="webResource.rdfAbout"
      class="mb-3"
      :data-qa="'webResource ' + webResource.rdfAbout"
    >
      <div
        v-for="(value, key) in webResource"
        :key="key"
        :data-qa="'field ' + key"
      >
        <div><strong>{{ key }}</strong></div>
        <pre><code>{{ value }}</code></pre>
      </div>
    </b-list-group-item>
  </b-list-group>
</template>

<script>
  export default {
    props: {
      media: {
        type: Array,
        default: () => []
      }
    }
  };
</script>
