<template>
  <div v-if="resource.edm">
    <ul
      class="media-viewer-metadata-list list-group"
    >
      <li
        v-for="(value, key, index) in resource.edm"
        :key="index"
      >
        <MetadataField
          :key="key"
          class="p-3"
          :name="key"
          :field-data="value"
          :label-id="`${key}-label`"
          context="webResource"
        />
      </li>
    </ul>
  </div>
</template>

<script>
  import MetadataField from '../metadata/MetadataField.vue';

  export default {
    name: 'MediaMetadataList',

    components: {
      MetadataField
    },

    props: {
      resource: {
        type: Object,
        required: true
      }
    }
  };
</script>
