<template>
  <b-dropdown
    ref="dropdown"
    v-click-outside="applySelection"
    :variant="hasSelection"
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
      <div
        v-for="(option, index) in sortOptions"
        :key="index"
      >
        <b-form-radio
          v-if="isRadio"
          :id="`${option}_${RADIO}`"
          v-model="radioSelected"
          :value="option"
          :data-qa="`${option} ${RADIO}`"
          @input="applySelection"
        >
          {{ $t(`facets.${facet.name}.options.${option}`) }}
        </b-form-radio>

        <b-form-checkbox
          v-else
          :id="`${option.label}_checkbox`"
          v-model="preSelected"
          :value="option.label"
          :data-qa="`${option.label} checkbox`"
          :class="{ 'is-selected' : selectedFacet.some(s => s === option.label) }"
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
        THEME: 'THEME',
        buttonNames: {
          THEME: this.$t('facets.THEME.name'),
          TYPE: this.$t('facets.TYPE.name'),
          REUSABILITY: this.$t('facets.REUSABILITY.name'),
          COUNTRY: this.$t('facets.COUNTRY.name')
        },
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

      hasSelection() {
        return (this.radioSelected || this.selectedFacet.length > 0) ? 'secondary' : 'light';
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
          this.$refs.dropdown.hide(true);
        } else {
          this.selected = this.preSelected;
          this.$emit('updated', this.facet.name, this.selected);
          this.$refs.dropdown.hide(true);
        }
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
