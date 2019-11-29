<template>
  <b-dropdown
    ref="dropdown"
    :variant="dropdownVariant"
    class="mr-2 mb-2"
    :data-type="type"
    data-qa="search facet"
    @hidden="cancelHandler"
  >
    <template v-slot:button-content>
      <span :data-qa="`${name} dropdown button`">
        {{ facetName }}
      </span>
    </template>

    <b-dropdown-form class="options-container">
      <template v-if="isRadio">
        <b-form-radio
          v-for="(option, index) in sortedOptions"
          :key="index"
          v-model="radioSelected"
          :value="option"
          :name="name"
          :data-qa="`${option} ${RADIO}`"
          @change="$refs.dropdown.hide(true)"
        >
          <FacetFieldLabel
            :facet-name="name"
            :field-value="option"
          />
        </b-form-radio>
      </template>

      <template v-else>
        <b-form-checkbox
          v-for="(option, index) in sortedOptions"
          :key="index"
          v-model="preSelected"
          :value="option.label"
          :name="name"
          :data-qa="`${option.label} ${CHECKBOX}`"
        >
          <FacetFieldLabel
            :facet-name="name"
            :field-value="option.label"
          />
          <span>({{ option.count | localise }})</span>
        </b-form-checkbox>
      </template>
    </b-dropdown-form>

    <li
      v-if="type === 'checkbox'"
      class="dropdown-buttons mt-3"
    >
      <b-button
        variant="link"
        :disabled="!(preSelected.length > 0)"
        :data-qa="`${name} reset button`"
        @click="resetCheckboxSelection"
      >
        {{ $t('facets.button.reset') }}
      </b-button>
      <b-button
        variant="primary"
        :disabled="disableApplyButton"
        :data-qa="`${name} apply button`"
        @click.stop="applySelection"
      >
        {{ $t('facets.button.apply') }}
      </b-button>
    </li>

    <li
      v-else
      class="p-2 float-right"
    >
      <b-button
        variant="link"
        :disabled="!radioSelected"
        @click.stop="resetRadioSelection"
      >
        {{ $t('facets.button.reset') }}
      </b-button>
    </li>
  </b-dropdown>
</template>

<script>
  import Vue from 'vue';
  import isEqual from 'lodash/isEqual';

  import FacetFieldLabel from './FacetFieldLabel';

  export default {
    components: {
      FacetFieldLabel
    },

    props: {
      name: {
        type: String,
        required: true
      },

      fields: {
        type: Array,
        required: false,
        default: () => []
      },

      selected: {
        type: [Array, String],
        required: false,
        default: () => []
      },

      type: {
        type: String,
        required: true
      }
    },

    data() {
      return {
        RADIO: 'radio',
        CHECKBOX: 'checkbox',
        preSelected: [],
        radioSelected: null
      };
    },

    computed: {
      sortedOptions() {
        const selected = [];

        /* TODO: THIS NEEDS TO BE CLEANED UP */
        this.fields.map(field => {
          if (this.selected.includes(field.label)) {
            selected.push(field);
          }
        });

        const leftOver = this.fields.filter(field => !this.selected.includes(field.label));

        return selected.sort((a, b) => a.count + b.count).concat(leftOver);
        /* END TODO */
      },

      facetName() {
        return this.$t(`facets.${this.name}.name`);
      },

      isRadio() {
        return this.type === this.RADIO;
      },

      disableApplyButton() {
        return isEqual(this.preSelected, this.selected);
      },

      dropdownVariant() {
        return (this.radioSelected || this.selected.length > 0) ? 'selected' : 'light';
      }
    },

    watch: {
      selected() {
        // We watch selected property so when user clicks on browser back button,
        // facets properties are updated correctly
        this.init();
      }
    },

    mounted() {
      this.init();
    },

    methods: {
      init() {
        if (this.isRadio) {
          if (Array.isArray(this.selected)) {
            this.radioSelected = '';
          } else {
            this.radioSelected = this.selected;
          }
        } else if (this.selected.length > 0) {
          this.preSelected = this.selected;
        } else if (this.preSelected.length > 0 && this.selected.length < 1) {
          this.preSelected = [];
        }
      },

      cancelHandler() {
        this.preSelected = this.selected;
        this.resetRadioSelection();
      },

      resetCheckboxSelection() {
        this.preSelected = [];
      },

      resetRadioSelection() {
        this.radioSelected = '';
        this.$refs.dropdown.hide(true);
      },

      applySelection() {
        if (this.isRadio) {
          Vue.nextTick(() => { // Change event triggers before v-model has updated. This resolves the issue
            this.$emit('changed', this.name, this.radioSelected);
          });
        } else {
          this.$emit('changed', this.name, this.preSelected);
        }

        this.$refs.dropdown.hide(true);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "./assets/scss/variables.scss";

  .dropdown { // TODO: move this code to the dropdown.scss where possible, to avoid duplication
    width: 100%;
    margin-bottom: 5px;

    &:last-child {
      margin-bottom: 0;
    }

    @media (min-width: $bp-large) {
      width: auto;
      margin-bottom: 0;
    }
  }

  .has-selected {
    /deep/ > .btn {
      background: $white;
      color: $mediumgrey;
    }
  }

  /deep/ .dropdown-menu {
    font-size: $font-size-small;
    width: 100%;

    @media (min-width: $bp-large) {
      min-width: 280px;

      &.show {
        transform: translate3d(0, 3rem, 0) !important;
      }
    }

    .custom-control  {
      margin-bottom: 4px;
      min-height: auto;

      label span {
        font-size: $font-size-extrasmall;
      }
    }
  }

  .options-container {
    overflow: auto;
    max-height: 50vh;

    &::-webkit-scrollbar {
      width: 0.25rem;
    }

    &::-webkit-scrollbar-thumb {
      background-color: $grey;
    }
  }
</style>
