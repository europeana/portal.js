<template>
  <li
    class="f-dropdown"
    data-qa="facet-dropdown"
  >
    <div class="f-dropdown__wrap">
      <button
        v-click-outside="hide"
        class="f-dropdown__btn"
        type="button"
        aria-haspopup="true"
        aria-expanded="false"
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
          panel here
        </div>
      </div>
    </div>
  </li>

  <!-- <b-dropdown
    :text="facet.name"
    class="m-md-2"
  >
    <template slot="text">&#x1f50d;<span class="sr-only">Search</span></template>
    <b-dropdown-form>
      <b-form-checkbox-group v-model="selected">
        <b-form-checkbox
          v-for="(option, index) in facet.fields"
          :key="index"
          :value="option.label"
        >
          {{ option.label }}
        </b-form-checkbox>
      </b-form-checkbox-group>
    </b-dropdown-form>
  </b-dropdown> -->
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
      }
    },

    data() {
      return {
        selected: [],
        isActive: false
      };
    },

    methods: {
      hide() {
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
      overflow: auto;
      width: 200px;
    }

    &__menu {
      overflow: auto;
      max-height: 240px;
    }
  }
</style>
