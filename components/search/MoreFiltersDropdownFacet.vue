<template>
  <b-dropdown-form>
    <strong
      class="mb-3 d-inline-block"
    >
      {{ $tc(`facets.${name}.name`, 1) }}
    </strong>
    <b-form-checkbox-group
      v-model="selectedOptions"
      class="option-group"
      :name="$tc(`facets.${name}.name`, 1)"
      plain
      @change="selectedHandler"
    >
      <b-form-checkbox
        v-for="(filter, index) in fields.slice(0, limitTo)"
        :key="index"
        :value="filter.label"
        :data-qa="`${filter.label} checkbox`"
        class="mb-2"
      >
        <ColourSwatch
          v-if="isColourPalette"
          :hex-code="filter.label"
          :aria-labelledby="fieldLabelId(index)"
        />
        <FacetFieldLabel
          :id="fieldLabelId(index)"
          :facet-name="name"
          :field-value="filter.label"
        />
        <span
          class="reset icon-close"
          :aria-label="$t('facets.button.reset')"
        />
      </b-form-checkbox>
      <div
        v-if="fields.length > limitTo && isActive"
        class="option-group"
      >
        <b-form-checkbox
          v-for="(filter, index) in fields.slice(limitTo)"
          :key="index"
          :value="filter.label"
          :data-qa="`${filter.label} checkbox`"
          class="mb-2"
        >
          <ColourSwatch
            v-if="isColourPalette"
            :hex-code="filter.label"
            :aria-labelledby="fieldLabelId(index, { overLimit: true })"
          />
          <FacetFieldLabel
            :id="fieldLabelId(index, { overLimit: true })"
            :facet-name="name"
            :field-value="filter.label"
          />
          <span
            class="reset icon-close"
            :aria-label="$t('facets.button.reset')"
          />
        </b-form-checkbox>
      </div>
    </b-form-checkbox-group>
    <button
      v-if="fields.length > limitTo"
      type="button"
      class="btn btn-link btn-toggle"
      :class="{ 'is-active': isActive }"
      :data-qa="(isActive ? $t(`facets.button.showLess`, { label: $tc(`facets.${name}.name`, 2) }) + ' button' : $t(`facets.button.showAll`, { label: $tc(`facets.${name}.name`, 2) }) + ' button')"
      @click.prevent="isActive = !isActive"
    >
      {{ isActive ? $t(`facets.button.showLess`, { label: $tc(`facets.${name}.name`, 2) }) : $t(`facets.button.showAll`, { label: $tc(`facets.${name}.name`, 2).toLowerCase() }) }}
    </button>
  </b-dropdown-form>
</template>

<script>
  import ColourSwatch from '../generic/ColourSwatch';
  import FacetFieldLabel from './FacetFieldLabel';

  export default {
    components: {
      ColourSwatch,
      FacetFieldLabel
    },

    props: {
      fields: {
        type: Array,
        required: true
      },

      name: {
        type: String,
        required: true
      },

      selected: {
        type: Array,
        default: () => []
      }
    },

    data() {
      return {
        selectedOptions: this.selected,
        isActive: false,
        limitTo: 9,
        COLOURPALETTE: 'COLOURPALETTE'
      };
    },

    computed: {
      isColourPalette() {
        return this.name === this.COLOURPALETTE;
      }
    },

    watch: {
      selected(value) {
        this.selectedOptions = value;
      }
    },

    methods: {
      fieldLabelId(index, options = {}) {
        const fieldIndex = options.overLimit ? index + this.limitTo : index;
        return `facet-field-${this.name}-${fieldIndex}`;
      },

      selectedHandler(value) {
        this.$emit('selectedOptions', this.name, value);
      }
    }
  };
</script>
