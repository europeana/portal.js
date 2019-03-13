<template>
  <b-list-group>
    <b-list-group-item
      v-for="webResource in media"
      :key="webResource.rdfAbout"
      :data-qa="'webResource ' + webResource.rdfAbout"
      class="mb-3"
    >
      <MetadataField
        v-for="(value, name) in webResource"
        :key="name"
        :name="name"
        :value="value"
        context="webResource"
      />
    </b-list-group-item>
  </b-list-group>
</template>

<script>
  import MetadataField from '../../components/record/MetadataField';

  export default {
    components: {
      MetadataField
    },
    props: {
      media: {
        type: Array,
        default: () => []
      }
    }
  };
</script>
