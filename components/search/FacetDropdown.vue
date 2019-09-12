<template>
  <b-dropdown
    ref="dropdown"
    v-click-outside="triggerSelectionHandler"
    :variant="hasSelection"
    class="mr-2"
    :data-type="facetType"
    data-qa="search facet"
  >
    <template v-slot:button-content>
      <span :data-qa="`${facet.name} dropdown button`">
        {{ facetName }}
      </span>
    </template>

    <b-dropdown-form class="options-container">
      <div
        v-for="(option, index) in sortOptions"
        :key="index"
      >
        <b-form-radio
          v-if="facetType === 'radio'"
          :id="`${option}_radio`"
          v-model="radioSelected"
          :value="option"
          :data-qa="`${option} radio`"
          @input="applyRadioSelection()"
        >
          {{ $t(`facets.${facet.name}.options.${option}`) }}
        </b-form-radio>

        <b-form-checkbox
          v-else
          :id="`${option.label}_checkbox`"
          v-model="preSelected"
          :value="option.label"
          :data-qa="`${option.label} checkbox`"
          :class="{ 'is-selected' : selected.some(s => s === option.label) }"
        >
          {{ option.label }} ({{ option.count | localise }})
        </b-form-checkbox>
      </div>
    </b-dropdown-form>

    <li
      v-if="facetType === 'checkbox'"
      class="p-2 float-right"
    >
      <b-button
        variant="link"
        :disabled="!activateCheckboxResetButton"
        @click="resetCheckboxSelection()"
      >
        Reset
      </b-button>
      <b-button
        variant="primary"
        :disabled="activateApplyButton"
        :data-qa="`${facet.name} apply button`"
        @click.stop="applyCheckboxSelection()"
      >
        Apply
      </b-button>
    </li>

    <li
      v-else
      class="p-2 float-right"
    >
      <b-button
        variant="link"
        :disabled="!activateRadioResetButton"
        @click.stop="resetRadioSelection()"
      >
        Reset
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
        buttonNames: {
          THEME: this.$t('facets.THEME.name'),
          TYPE: this.$t('facets.TYPE.name'),
          REUSABILITY: this.$t('facets.REUSABILITY.name'),
          COUNTRY: this.$t('facets.COUNTRY.name')
        },
        selected: [],
        preSelected: [],
        radioSelected: null
      };
    },

    computed: {
      sortOptions() {
        let newArray = [].concat(this.facet.fields);
        const selected = [];
        let leftOver;

        if (this.facetType === this.RADIO) {
          newArray.splice(newArray.indexOf('all'), 1);
          return newArray;
        }

        /* THIS NEEDS TO BE CLEANED UP */
        newArray.map(field => {
          if (this.selectedFacet.includes(field.label)) {
            selected.push(field);
          }
        });

        leftOver = newArray.filter(field => !this.selectedFacet.includes(field.label));

        return selected.sort((a, b) => a.count + b.count).concat(leftOver);
        /* END - THIS NEEDS TO BE CLEANED UP */
      },

      facetName() {
        return this.buttonNames[this.facet.name];
      },

      activateCheckboxResetButton() {
        return this.preSelected.length > 0;
      },

      activateRadioResetButton() {
        return this.radioSelected;
      },

      activateApplyButton() {
        return this.preSelected.length === this.selectedFacet.length;
      },

      hasSelection() {
        return (this.radioSelected || this.selected.length > 0) ? 'secondary' : 'light';
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
          this.applyCheckboxSelection();
        }
      },

      resetCheckboxSelection() {
        this.preSelected = [];
      },

      resetRadioSelection() {
        this.radioSelected = '';
      },

      applyCheckboxSelection() {
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
