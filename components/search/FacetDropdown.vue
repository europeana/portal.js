<template>
  <b-dropdown
    ref="dropdown"
    :variant="dropdownVariant"
    class="mr-2 my-2"
    :data-type="type"
    data-qa="search facet"
    @hidden="cancelHandler"
  >
    <template #button-content>
      <span :data-qa="`${name} dropdown button`">
        {{ facetName }}
      </span>
    </template>

    <b-dropdown-form class="options-container">
      <div
        v-for="(option, index) in sortedOptions"
        :key="index"
        :data-qa="`${isRadio ? option : option.label} ${name} field`"
      >
        <template v-if="isRadio">
          <b-form-radio
            v-model="preSelected"
            :value="option"
            :name="name"
            :data-qa="`${option} ${name} ${RADIO}`"
          >
            <FacetFieldLabel
              :facet-name="name"
              :field-value="option"
            />
          </b-form-radio>
        </template>

        <template v-else>
          <b-form-checkbox
            v-model="preSelected"
            :value="option.label"
            :name="name"
            :data-qa="`${option.label} ${name} ${CHECKBOX}`"
          >
            <FacetFieldLabel
              :facet-name="name"
              :field-value="option.label"
            />
            <span>({{ option.count | localise }})</span>
          </b-form-checkbox>
        </template>
      </div>
    </b-dropdown-form>

    <li
      class="dropdown-buttons mt-3"
    >
      <b-button
        variant="link"
        :disabled="disableResetButton"
        :data-qa="`${name} reset button`"
        @click="resetSelection"
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
  </b-dropdown>
</template>

<script>
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
        preSelected: null
      };
    },

    computed: {
      sortedOptions() {
        if (this.isRadio) return this.fields;

        const selected = [];

        this.fields.map(field => {
          if (this.selected.includes(field.label)) {
            selected.push(field);
          }
        });

        const leftOver = this.fields.filter(field => !this.selected.includes(field.label));

        return selected.sort((a, b) => a.count + b.count).concat(leftOver);
      },

      facetName() {
        return this.$tFacetName(this.name);
      },

      isRadio() {
        return this.type === this.RADIO;
      },

      disableApplyButton() {
        if (this.isRadio && Array.isArray(this.selected)) {
          return isEqual(this.preSelected, this.selected[0]);
        }
        return isEqual(this.preSelected, this.selected);
      },

      disableResetButton() {
        if (!this.preSelected) return true;
        return Array.isArray(this.preSelected) && (this.preSelected.length === 0);
      },

      dropdownVariant() {
        return ((typeof this.selected === 'string') || (Array.isArray(this.selected) && this.selected.length > 0)) ? 'selected' : 'light';
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
        if (this.isRadio && Array.isArray(this.selected)) {
          this.preSelected = this.selected[0];
        } else {
          this.preSelected = this.selected;
        }

        this.$store.dispatch('search/setResettableFilter', {
          name: this.name,
          selected: this.preSelected
        });
      },

      cancelHandler() {
        this.init();
      },

      resetSelection() {
        this.preSelected = this.isRadio ? null : [];
      },

      async applySelection() {
        await this.$emit('changed', this.name, this.preSelected);
        this.$refs.dropdown.hide(true);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import './assets/scss/variables.scss';

  .dropdown { // TODO: move this code to the dropdown.scss where possible, to avoid duplication
    margin-bottom: 5px;
    width: 100%;

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
    margin-top: 0.5rem;
    width: 100%;

    @media (min-width: $bp-large) {
      min-width: 280px;

      &.show {
        transform: translate3d(0, 3rem, 0) !important;
      }
    }

    .custom-control {
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
