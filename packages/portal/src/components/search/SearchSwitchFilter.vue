<template>
  <b-form-group
    :label="tFacetName(name, { collection })"
    label-class="facet-label"
    :data-qa="`${name} switch filter`"
  >
    <!--
      triggered on change
      @event changed
      @property {string} name - filter name
      @property {string} localValue - new value after switch
    -->
    <b-form-checkbox
      v-model="localValue"
      :name="name"
      switch
      :value="checkedValue"
      :unchecked-value="uncheckedValue"
      @change="$emit('changed', name, localValueUnlessDefault)"
    >
      {{ label }}
      <b-button
        v-if="tooltip"
        v-b-tooltip.bottom
        :title="tooltip"
        class="icon-info-outline p-0 tooltip-button"
        variant="light-flat"
        data-qa="switch filter more info button"
      />
    </b-form-checkbox>
  </b-form-group>
</template>

<script>
  import facetsMixin from '@/mixins/facets';

  export default {
    name: 'SearchSwitchFilter',

    mixins: [facetsMixin],

    props: {
      /**
       * Value to which the switch is set
       */
      value: {
        type: [String, Array],
        default: null
      },

      /**
       * Name of filter
       */
      name: {
        type: String,
        required: true
      },

      /**
       * Value when switch is checked
       */
      checkedValue: {
        type: String,
        default: 'checked'
      },

      /**
       * Value when switch is unchecked
       */
      uncheckedValue: {
        type: String,
        default: 'unchecked'
      },

      /**
       * Value to consider default for the switch
       *
       * If the switch is set to its default value, it is not resettable.
       */
      defaultValue: {
        type: String,
        default: 'unchecked'
      },

      /**
       * Text for the switch label
       */
      label: {
        type: String,
        default: null
      },

      /**
       * Text for the switch tooltip
       */
      tooltip: {
        type: String,
        default: null
      },

      collection: {
        type: String,
        default: null
      }
    },

    data() {
      return {
        localValue: this.value
      };
    },

    computed: {
      localValueUnlessDefault() {
        return (this.localValue === this.defaultValue) ? null : this.localValue;
      }
    },

    watch: {
      value() {
        this.init();
      }
    },

    mounted() {
      this.init();
    },

    methods: {
      init() {
        this.localValue = this.value;
      }
    }
  };
</script>

<docs lang="md">
  Switch-style checkbox with tooltip:
  ```jsx
    <SearchSwitchFilter
      value="metadata"
      name="api"
      checked-value="fulltext"
      unchecked-value="metadata"
      label="Search only in the content of items with full-text"
      tooltip="More info!"
    />
  ```
</docs>
