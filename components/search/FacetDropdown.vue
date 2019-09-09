<template>
  <li
    v-if="facet.name !== 'THEME'"
    class="f-dropdown"
    data-qa="facet-dropdown"
  >
    <div
      v-click-outside="hide"
      class="f-dropdown__wrap"
    >
      <button
        class="f-dropdown__btn"
        :class="{ 'has-selected' : selected.length > 0 }"
        type="button"
        aria-haspopup="true"
        :aria-expanded="isActive"
        @click="isActive = !isActive"
      >
        {{ facet.name }}
      </button>

      <div
        v-show="isActive"
        class="f-dropdown__dropdown"
      >
        <div
          v-if="preSelected.length > 0"
          class="f-dropdown__panel f-dropdown__panel--top"
        >
          <div class="selected">
            {{ preSelected.join(' / ') }}
          </div>
        </div>
        <div class="f-dropdown__menu">
          <ul
            role="menu"
            class="list-unstyled f-dropdown__list"
          >
            <li
              v-for="(option, index) in sortOptions"
              :key="index"
              :class="{ 'is-selected' : selected.some(s => s === option.label) }"
            >
              <input
                :id="option.label"
                v-model="preSelected"
                :name="facet.name"
                :value="option.label"
                type="checkbox"
              >
              <label :for="option.label">
                {{ option.label }}
              </label>
            </li>
          </ul>
        </div>
        <div class="f-dropdown__panel float-right f-dropdown__panel--bottom">
          <b-button
            type="button"
            variant="link"
            :disabled="!activateResetButton"
            @click="resetSelection()"
          >
            Reset
          </b-button>
          <b-button
            type="button"
            variant="primary"
            :disabled="activateApplyButton"
            @click="applySelection()"
          >
            Apply
          </b-button>
        </div>
      </div>
    </div>
  </li>
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
        this.$parent.$emit('updated', this.facet.name, this.selected);
        this.isActive = false;
      }
    }
  };
</script>

<style lang="scss" scoped>
  .f-dropdown {
    position: relative;
    display: inline-flex;
    vertical-align: middle;
    margin-right: .5rem;

    &__btn {
      &.has-selected {
        background: white;
        border: 1px solid;
      }
    }

    &__dropdown {
      position: absolute;
      background: white;
      z-index: 1;
      padding: 15px 0 15px 15px;
      width: 280px;
    }

    &__panel {
      padding-right: 15px;

      &--top {
        padding-bottom: 15px;

        .selected {
          background: #f1f1f1;
          padding: 15px;
          font-size: 12px;
          font-weight: bold;
        }
      }

      &--bottom {
        padding-top: 15px;
      }
    }

    &__menu {
      overflow: auto;
      max-height: 380px;

      &::-webkit-scrollbar {
        width: 4px;
      }

      &::-webkit-scrollbar-thumb {
        background-color: grey;
      }

      .is-selected {
        font-weight: bold;
      }
    }
  }
</style>
