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
        <div class="f-dropdown__menu">
          <ul
            role="menu"
            class="list-unstyled f-dropdown__list"
          >
            <li
              v-for="(option, index) in facet.fields"
              :key="index"
            >
              <input
                :id="option.label"
                v-model="selected"
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
        <div class="f-dropdown__panel">
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
  import ClickOutside from 'vue-click-outside';

  export default {
    directives: {
      ClickOutside
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
        isActive: false
      };
    },

    computed: {
      activateResetButton() {
        return this.selected.length > 0;
      },

      activateApplyButton() {
        return this.selected.length === this.selectedFacet.length;
      }
    },

    mounted() {
      if (this.selectedFacet.length > 0) {
        this.selected = this.selected.concat(this.selectedFacet);
      }
    },

    methods: {
      hide() {
        this.isActive = false;
      },

      resetSelection() {
        this.selected = [];
      },

      applySelection() {
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

    // &__btn {}

    &__dropdown {
      position: absolute;
      background: white;
      z-index: 1;
      padding: 15px 0 15px 15px;
      max-height: 300px;
      width: 280px;
    }

    &__menu {
      overflow: auto;
      max-height: 240px;

      &::-webkit-scrollbar {
        width: 4px;
      }

      &::-webkit-scrollbar-thumb {
        background-color: grey;
      }
    }
  }
</style>
