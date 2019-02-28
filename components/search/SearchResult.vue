<template>
  <b-media no-body>
    <b-media-aside class="w-25 mr-3">
      <b-img
        v-if="result.edmPreview"
        slot="aside"
        :src="result.edmPreview"
        class="mw-100"
      />
    </b-media-aside>
    <b-media-body>
      <div
        v-for="(value, key) in result.fields"
        :key="key"
        :class="key"
      >
        <pre v-if="!Array.isArray(value)">
          <code>{{ value }}</code>
        </pre>
        <template v-else-if="value.length == 1">
          {{ value[0] }}
        </template>
        <ul v-else>
          <li
            v-for="(element, index) in value"
            :key="index"
          >
            {{ element }}
          </li>
        </ul>
      </div>
    </b-media-body>
  </b-media>
</template>

<script>
  export default {
    props: {
      result: {
        type: Object,
        default: () => {}
      }
    }
  };
</script>
