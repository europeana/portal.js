<template>
  <div>
    <ul
      v-if="selected.length"
      class="selected-tags pl-0 mb-1"
    >
      <li
        v-for="tag in selected"
        :key="tag"
        class="d-inline-block mw-100 mr-2 mb-2"
      >
        <span class="badge d-inline-flex align-items-baseline mw-100 remove-button badge-primary-light badge-pill">
          <span class="flex-grow-1 text-truncate">
            {{ tag }}
          </span>
          <button
            type="button"
            :aria-label="$t('removeFilter', { filterLabel: tag })"
            class="close"
            @click="removeOption(tag)"
          >×</button></span>
      </li>
    </ul>
    <div class="dropdown search-filter-dropdown">
      <button
        class="btn dropdown-toggle btn-secondary btn-block"
        type="button"
        :aria-expanded="showDropdown"
        @click="showDropdown = !showDropdown"
      >
        {{ placeholder || name }}
      </button>
      <ul
        class="dropdown-menu"
        :class="{show: showDropdown}"
      >
        <li
          v-for="item in dropdownItems"
          :key="item"
        >
          <button
            class="dropdown-item"
            :data-qa="`dropdown item ${item}`"
            role="menuitem"
            @click="selectOption(item)"
          >
            {{ item }}
          </button>
        </li>
      </ul>
      <!-- TODO: add message when no options left -->
    </div>
  </div>
</template>

<script>
  export default {
    name: 'SearchDropdown',

    props: {
      /**
       * Name of filter
       */
      name: {
        type: String,
        required: true
      },

      /**
       * Fields, these fields need no fetching
       */
      fields: {
        type: Array,
        default: () => []
      },

      /**
       * Placeholder text for the dropdown button
       */
      placeholder: {
        type: String,
        default: null
      },

      /**
       * If `true`, enable search of available fields.
       */
      search: {
        type: Boolean,
        default: false
      },

      /**
       * Selected option(s)
       */
      selected: {
        type: [Array],
        default: () => []
      }
    },

    data() {
      return {
        showDropdown: false
      };
    },

    computed: {
      dropdownItems() {
        return this.fields.filter((field) => !this.selected.includes(field));
      }
    },

    methods: {
      removeOption(tag) {
        this.$emit('changed', this.name, this.selected.filter((selection) => selection !== tag));
      },
      selectOption(option) {
        // TODO: add and handle search
        // this.searchFacet = '';

        this.$emit('changed', this.name, this.selected.concat(option));
      }
    }
  };
</script>

<style lang="scss">
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/dropdown-search-filter';

  .dropdown {
    @media (min-width: $bp-medium) {
      width: pxToRem(288);
    }

    @media (min-width: $bp-4k) {
      width: calc(1.5 * pxToRem(288));
    }
  }
</style>

<docs lang="md">
```jsx
<SearchDropdown
  name="country"
  :fields="['United Kingdom', 'The Netherlands']"
/>
```
</docs>
