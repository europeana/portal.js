<template>
  <b-form-checkbox
    :value="option"
    :data-qa="`${option} ${facetName} checkbox`"
    class="mb-2"
  >
    <ColourSwatch
      v-if="forColourPalette"
      :hex-code="option"
    />
    <FacetFieldLabel
      :id="fieldLabelId"
      :facet-name="facetName"
      :field-value="option"
    />
    <span
      class="reset icon-close"
    />
  </b-form-checkbox>
</template>

<script>
  import ColourSwatch from '../generic/ColourSwatch';
  import FacetFieldLabel from './FacetFieldLabel';

  export default {
    name: 'MoreFiltersDropdownFacetOption',

    components: {
      ColourSwatch,
      FacetFieldLabel
    },

    props: {
      facetName: {
        type: String,
        required: true
      },

      option: {
        type: String,
        required: true
      },

      index: {
        type: Number,
        required: true
      }
    },

    data() {
      return {
        COLOURPALETTE: 'COLOURPALETTE'
      };
    },

    computed: {
      forColourPalette() {
        return this.facetName === this.COLOURPALETTE;
      },

      fieldLabelId() {
        return `facet-field-${this.facetName}-${this.index}`;
      }
    }
  };
</script>
