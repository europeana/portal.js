<template>
  <b-media
    v-if="result"
    no-body
  >
    <b-media-aside class="w-25 mr-3">
      <b-img
        v-if="result.edmPreview"
        slot="aside"
        :src="result.edmPreview"
        alt=""
        class="mw-100"
        data-field-name="edmPreview"
        data-qa="result thumbnail"
      />
    </b-media-aside>
    <b-media-body>
      <div
        v-for="(value, key) in result.fields"
        :key="key"
        :data-field-name="key"
        data-qa="result field"
      >
        <pre v-if="!Array.isArray(value)">
          <code>{{ value }}</code>
        </pre>
        <template v-else-if="value.length == 1">
          {{ value[0] }}
        </template>
        <ul v-else>
          <li
            v-for="(element, index) in value.slice(0, 3)"
            :key="index"
          >
            {{ element }}
          </li>
          <li
            v-if="value.length > 3"
          >
            ...
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
