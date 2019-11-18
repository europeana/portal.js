<template>
  <b-media
    v-if="result"
    no-body
    class="flex-column-reverse flex-md-row"
  >
    <b-media-body class="m-4">
      <div
        v-for="(value, key) in result.fields"
        :key="key"
        :data-field-name="key"
        data-qa="result field"
      >
        <template v-if="Array.isArray(value) && value.length === 1">
          <template v-if="key === 'dcTitle'">
            {{ value[0] | truncate(90, $t('formatting.ellipsis')) }}
          </template>
          <template v-else>
            {{ value[0] }}
          </template>
        </template>
        <ul v-else-if="Array.isArray(value)">
          <li
            v-for="(element, index) in displayableValues(value)"
            :key="index"
          >
            {{ element }}
          </li>
          <li
            v-if="trimmedValueArray(value)"
          >
            {{ $t('formatting.ellipsis') }}
          </li>
        </ul>
      </div>
    </b-media-body>
    <b-media-aside class="media-image">
      <b-img
        v-if="result.edmPreview"
        slot="aside"
        :src="result.edmPreview"
        alt=""
        class="mw-100 w-100"
        data-field-name="edmPreview"
        data-qa="result thumbnail"
      />
    </b-media-aside>
  </b-media>
</template>

<script>
  export default {
    props: {
      result: {
        type: Object,
        default: () => {}
      }
    },
    methods: {
      displayableValues(values) {
        if (Array.isArray(values)) {
          return values.slice(0, 3);
        }
        return values;
      },
      trimmedValueArray(values) {
        if (Array.isArray(values)) {
          return values.length > 3;
        }
        return false;
      }
    }
  };
</script>
