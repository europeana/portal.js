<template>
  <b-dropdown
    ref="dropdown"
    :variant="dropdownVariant"
    class="mr-2"
    :data-type="type"
    data-qa="search facet"
    @hidden="applySelection()"
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
          {{ $t(`facets.${name}.options.${option}`) }}
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
          :class="{ 'font-weight-bold' : selected.some(s => s === option.label) }"
        >
          {{ option.label }} ({{ option.count | localise }})
        </b-form-checkbox>
      </template>
    </b-dropdown-form>

    <li
      v-if="type === 'checkbox'"
      class="p-2 float-right"
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
        @click.stop="$refs.dropdown.hide(true);"
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

  export default {
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
        return (this.radioSelected || this.selected.length > 0) ? 'secondary' : 'light';
      }
    },

    mounted() {
      if (this.isRadio) {
        if (Array.isArray(this.selected)) {
          this.radioSelected = '';
        } else {
          this.radioSelected = this.selected;
        }
      } else if (this.selected.length > 0) {
        this.preSelected = this.selected;
      }
    },

    methods: {
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
