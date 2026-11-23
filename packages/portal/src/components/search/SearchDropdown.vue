<template>
  <div>
    <ul
      v-if="selectedOptions.length"
      class="selected-tags pl-0 mb-1"
    >
      <li
        v-for="tag in selectedOptions"
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
    <div
      v-click-outside="clickOutsideConfig"
      class="dropdown search-filter-dropdown"
    >
      <button
        class="btn dropdown-toggle btn-secondary btn-block"
        type="button"
        :aria-owns="showDropdown ? dropdownMenuId : null"
        :aria-controls="showDropdown ? dropdownMenuId : null"
        @click="handleDropdownToggleClick"
      >
        {{ placeholder || name }}
      </button>
      <div
        :id="dropdownMenuId"
        class="dropdown-menu"
        :class="{ show: showDropdown }"
      >
        <LoadingSpinner
          v-if="!fieldsFetched"
          class="text-center"
        />
        <template v-else>
          <form
            v-if="searchable"
            class="dropdown-form"
            @submit.stop.prevent="() => {}"
          >
            <div
              class="form-group"
            >
              <div>
                <input
                  ref="search-input"
                  v-model="dropdownSearchQuery"
                  type="text"
                  autocomplete="off"
                  :placeholder="$t('sideFilters.search')"
                  :aria-label="$t('sideFilters.search')"
                  class="form-control"
                  :aria-owns="showDropdown ? optionsId : null"
                  :aria-controls="showDropdown ? optionsId : null"
                >
                <span class="icon-search" />
              </div>
            </div>
          </form>
          <ul
            v-if="fieldsFilteredToSearch.length > 0"
            :id="optionsId"
            class="list-unstyled mb-0"
          >
            <li
              v-for="item in fieldsFilteredToSearch"
              :key="item"
            >
              <NuxtLink
                class="dropdown-item"
                :data-qa="`dropdown item ${item}`"
                :to="filterToLink(item)"
              >
                {{ item }}
              </NuxtLink>
            </li>
          </ul>
          <div
            v-else
            class="px-2"
          >
            {{ $t('sideFilters.noOptions') }}
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  import vClickOutside from 'v-click-outside';

  export default {
    name: 'SearchDropdown',

    directives: {
      clickOutside: vClickOutside.directive
    },

    components: {
      LoadingSpinner: () => import('@/components/generic/LoadingSpinner')
    },

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
       * Fetch state of the fields
       */
      fieldsFetched: {
        type: Boolean,
        default: false
      },
      /**
       * Placeholder text for the dropdown button
       */
      placeholder: {
        type: String,
        default: null
      },
      /**
       * If `true`, enable search of available fields
       */
      search: {
        type: Boolean,
        default: false
      },
      /**
       * Type of input fields in dropdown, could be radio or checkbox
       *
       * @values radio, checkbox
       */
      type: {
        type: String,
        required: true
      }
    },

    data() {
      return {
        // https://www.npmjs.com/package/v-click-outside
        clickOutsideConfig: {
          capture: true,
          events: ['click', 'dblclick', 'focusin', 'touchstart'],
          handler: this.closeDropdown,
          isActive: false
        },
        dropdownSearchQuery: '',
        showDropdown: false
      };
    },

    computed: {
      searchable() {
        return this.search && this.fields.length > 0;
      },
      nameNoSpaces() {
        return this.name.replace(/\s/g, '-').toLowerCase();
      },
      dropdownMenuId() {
        return `${this.nameNoSpaces}-dropdown-content`;
      },
      optionsId() {
        return `${this.nameNoSpaces}-options`;
      },
      fieldsWithoutSelected() {
        return this.fields.filter((field) => !this.selectedOptions.includes(field));
      },
      fieldsFilteredToSearch() {
        const criteria = this.trimmedDropdownSearchQuery;
        const options = this.fieldsWithoutSelected;

        return options.filter(option => {
          const exactMatch = option.toLowerCase().indexOf(criteria) > -1;
          return exactMatch;
        });
      },
      trimmedDropdownSearchQuery() {
        return this.dropdownSearchQuery.trim().toLowerCase();
      },
      activeQueryValue() {
        return this.$route.query?.[this.name];
      },
      selectedOptions() {
        return this.activeQueryValue?.split(',') || [];
      }
    },

    watch: {
      async showDropdown(newVal) {
        if (newVal) {
          await this.$nextTick();
          this.searchable && this.setSearchFocus();
        }
      },
      activeQueryValue: 'closeDropdown'
    },

    methods: {
      addNewSelectedOption(option) {
        return this.type === 'radio' ? [option] : [...this.selectedOptions].concat(option);
      },
      removeSelectedOption(option) {
        return this.type === 'radio' ? [] : [...this.selectedOptions].filter((selection) => selection !== option);
      },
      getNewRouteWithUpdatedQuery(options) {
        const optionsForQuery = options.length ? options.join(',') : undefined;

        const newRoute = {
          ...this.$route,
          query: {
            ...this.$route.query,
            page: 1,
            [this.name]: optionsForQuery
          }
        };
        return newRoute;
      },
      filterToLink(option) {
        const selectedOptions = this.addNewSelectedOption(option);
        return this.getNewRouteWithUpdatedQuery(selectedOptions);
      },
      removeOption(option) {
        const selectedOptions = this.removeSelectedOption(option);
        const newRoute = this.getNewRouteWithUpdatedQuery(selectedOptions);
        this.$router.push(newRoute);
      },
      setSearchFocus() {
        this.$refs['search-input'].focus();
      },
      setClickOutsideConfigIsActive(isActive) {
        // need to do this instead of just setting isActive due to
        // https://github.com/ndelvalle/v-click-outside/issues/143
        this.clickOutsideConfig = {
          ...this.clickOutsideConfig,
          isActive
        };
      },
      handleDropdownToggleClick() {
        if (this.showDropdown) {
          this.closeDropdown();
        } else {
          this.$emit('showDropdown');
          this.setClickOutsideConfigIsActive(true);
          this.showDropdown = true;
        }
      },
      closeDropdown() {
        this.setClickOutsideConfigIsActive(false);
        this.showDropdown = false;
        this.dropdownSearchQuery = '';
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

  .dropdown-form {
    padding: 0.25rem 0.75rem;
  }
</style>

<docs lang="md">
```jsx
<SearchDropdown
  name="country"
  :fields="['United Kingdom', 'The Netherlands']"
/>
```
Searchable options
```jsx
<SearchDropdown
  name="country"
  :fields="['United Kingdom', 'The Netherlands']"
  :search="true"
/>
```
</docs>
