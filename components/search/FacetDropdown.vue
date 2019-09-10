<template>
  <b-dropdown
    ref="dropdown"
    v-click-outside="triggerSelectionHandler"
    :variant="hasSelection"
    class="mr-2"
    :data-type="facetType"
    data-qa="dropdown"
    :text="facet.name"
  >
    <b-dropdown-form class="options-container">
      <div
        v-for="(option, index) in sortOptions"
        :key="index"
      >
        <b-form-radio
          v-if="facetType === 'radio'"
          v-model="radioSelected"
          :value="option === 'all' ? '' : option"
          @input="applyRadioSelection()"
        >
          {{ option }}
        </b-form-radio>

        <b-form-checkbox
          v-else
          v-model="preSelected"
          :value="option.label"
          :class="{ 'is-selected' : selected.some(s => s === option.label) }"
        >
          {{ option.label }}
        </b-form-checkbox>
      </div>
    </b-dropdown-form>

    <li
      v-if="facetType === 'checkbox'"
      class="p-2 float-right"
    >
      <b-button
        variant="link"
        :disabled="!activateResetButton"
        @click="resetSelection()"
      >
        Reset
      </b-button>
      <b-button
        variant="primary"
        :disabled="activateApplyButton"
        @click="applySelection()"
      >
        Apply
      </b-button>
    </li>
  </b-dropdown>
</template>

<script>
  import vClickOutside from 'v-click-outside';

  export default {
    directives: {
      clickOutside: vClickOutside.directive
    },

    props: {
      facet: {
        type: Object,
        required: true
      },

      selectedFacet: {
        type: [Array, String],
        required: false,
        default: () => []
      },

      facetType: {
        type: String,
        required: true
      }
    },

    data() {
      return {
        RADIO: 'radio',
        THEME: 'THEME',
        selected: [],
        preSelected: [],
        radioSelected: null
      };
    },

    computed: {
      sortOptions() {
        const newArray = [].concat(this.facet.fields);
        newArray.map(field => {
          if (this.selected.includes(field.label)) {
            newArray.splice(newArray.indexOf(field), 1);
            newArray.unshift(field);
          }
        });

        return newArray;
      },

      activateResetButton() {
        return this.preSelected.length > 0;
      },

      activateApplyButton() {
        return this.preSelected.length === this.selectedFacet.length;
      },

      hasSelection() {
        return this.selected.length > 0 || this.facetType === this.RADIO ? 'secondary' : 'light';
      }
    },

    mounted() {
      if (this.facetType === this.RADIO) {
        if (Array.isArray(this.selectedFacet)) {
          this.radioSelected = '';
        } else {
          this.radioSelected = this.selectedFacet;
        }
      } else if (this.selectedFacet.length > 0) {
        this.selected = this.selected.concat(this.selectedFacet);
        this.preSelected = this.selected;
      }
    },

    methods: {
      triggerSelectionHandler(event, el) {
        if (el.dataset.type === this.RADIO) {
          this.applyRadioSelection();
        } else {
          this.applySelection();
        }
      },

      resetSelection() {
        this.preSelected = [];
      },

      applySelection() {
        this.selected = this.preSelected;
        this.$emit('updated', this.facet.name, this.selected);
        this.$refs.dropdown.hide(true);
      },

      applyRadioSelection() {
        this.$emit('updated', this.THEME, this.radioSelected);
        this.$refs.dropdown.hide(true);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "./assets/scss/variables.scss";

  .has-selected {
    /deep/ > .btn {
      background: $white;
      color: $darkgrey;
    }
  }

  /deep/ .dropdown-menu {
    min-width: 280px;

    .custom-control  {
      margin-bottom: 4px;
    }
  }

  .options-container {
    overflow: auto;
    max-height: 380px;

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: grey;
    }
  }

  .is-selected {
    font-weight: bold;
  }
</style>
