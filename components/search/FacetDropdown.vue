<template>
  <b-dropdown
    ref="dropdown"
    v-click-outside="applySelection"
    :variant="dropdownVariant"
    class="mr-2"
    :data-type="facetType"
    data-qa="search facet"
  >
    <template v-slot:button-content>
      <span :data-qa="`${facetName} dropdown button`">
        {{ facetName }}
      </span>
    </template>

    <b-dropdown-form class="options-container">
      <template v-if="isRadio">
        <b-form-radio
          v-for="(option, index) in sortOptions"
          :key="index"
          v-model="radioSelected"
          :value="option"
          :name="facet.name"
          :data-qa="`${option} ${RADIO}`"
          @input="applySelection"
        >
          {{ $t(`facets.${facet.name}.options.${option}`) }}
        </b-form-radio>
      </template>

      <template v-else>
        <b-form-checkbox
          v-for="(option, index) in sortOptions"
          :key="index"
          v-model="preSelected"
          :value="option.label"
          :name="facet.name"
          :data-qa="`${option.label} ${CHECKBOX}`"
          :class="{ 'font-weight-bold' : selectedFacet.some(s => s === option.label) }"
        >
          {{ option.label }} ({{ option.count | localise }})
        </b-form-checkbox>
      </template>
    </b-dropdown-form>

    <li
      v-if="facetType === 'checkbox'"
      class="p-2 float-right"
    >
      <b-button
        variant="link"
        :disabled="!activateCheckboxResetButton"
        @click="resetCheckboxSelection"
      >
        {{ $t('facets.button.reset') }}
      </b-button>
      <b-button
        variant="primary"
        :disabled="disableApplyButton"
        :data-qa="`${facetName} apply button`"
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
        :disabled="disableRadioResetButton"
        @click.stop="resetRadioSelection"
      >
        {{ $t('facets.button.reset') }}
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
        CHECKBOX: 'checkbox',
        THEME: 'THEME',
        preSelected: [],
        radioSelected: null
      };
    },

    computed: {
      sortOptions() {
        let newArray = [].concat(this.facet.fields);
        const selected = [];

        /* TODO: THIS NEEDS TO BE CLEANED UP */
        newArray.map(field => {
          if (this.selectedFacet.includes(field.label)) {
            selected.push(field);
          }
        });

        const leftOver = newArray.filter(field => !this.selectedFacet.includes(field.label));

        return selected.sort((a, b) => a.count + b.count).concat(leftOver);
        /* END TODO */
      },

      facetName() {
        return this.$t(`facets.${this.facet.name}.name`);
      },

      isRadio() {
        return this.facetType === this.RADIO;
      },

      activateCheckboxResetButton() {
        return this.preSelected.length > 0;
      },

      disableRadioResetButton() {
        return !this.radioSelected;
      },

      disableApplyButton() {
        return this.preSelected.length === this.selectedFacet.length;
      },

      dropdownVariant() {
        return (this.radioSelected || this.selectedFacet.length > 0) ? 'secondary' : 'light';
      }
    },

    mounted() {
      if (this.isRadio) {
        if (Array.isArray(this.selectedFacet)) {
          this.radioSelected = '';
        } else {
          this.radioSelected = this.selectedFacet;
        }
      } else if (this.selectedFacet.length > 0) {
        this.preSelected = this.selectedFacet;
      }
    },

    methods: {
      resetCheckboxSelection() {
        this.preSelected = [];
      },

      resetRadioSelection() {
        this.radioSelected = '';
      },

      applySelection() {
        if (this.isRadio) {
          this.$emit('updated', this.THEME, this.radioSelected);
        } else {
          this.selected = this.preSelected;
          this.$emit('updated', this.facet.name, this.selected);
        }
        this.$refs.dropdown.hide(true);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "./assets/scss/variables.scss";

  .dropdown {
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
      color: $darkgrey;
    }
  }

  /deep/ .dropdown-menu {
    width: 100%;

    @media (min-width: $bp-large) {
      min-width: 280px;
    }

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
</style>
