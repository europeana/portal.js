<template>
  <b-dropdown
    :text="facet.name"
    :class="{ 'has-selected' : selected.length > 0 }"
  >
    <b-dropdown-form class="options-container">
      <div
        v-for="(option, index) in sortOptions"
        :key="index"
      >
        <b-form-radio
          v-if="facet.name === 'THEME'"
          v-model="preSelected"
          :value="option"
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

    <b-dropdown-divider />
    <li>
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
        type: Array,
        required: false,
        default: () => []
      }
    },

    data() {
      return {
        selected: [],
        preSelected: [],
        isActive: false
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
      }
    },

    mounted() {
      if (this.selectedFacet.length > 0) {
        this.selected = this.selected.concat(this.selectedFacet);
        this.preSelected = this.selected;
      }
    },

    methods: {
      hide() {
        this.isActive = false;
      },

      resetSelection() {
        this.preSelected = [];
      },

      applySelection() {
        this.selected = this.preSelected;
        this.$emit('updated', this.facet.name, this.selected);
        this.isActive = false;
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
