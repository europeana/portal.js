<template>
  <b-list-group>
    <b-list-group-item
      v-for="webResource in media"
      :id="webResource.about"
      :key="webResource.about"
      data-qa="web resource"
      class="mb-3"
    >
      <MetadataField
        v-for="field of fields"
        :key="field"
        :name="field"
        :value="webResource[field]"
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
    },
    data: function () {
      return {
        fields: ['about', 'dcDescription', 'edmRights', 'ebucoreHasMimeType']
      };
    }
  };
</script>
