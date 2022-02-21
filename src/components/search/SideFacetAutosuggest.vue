<template>
  <div v-if="!fetched || fields.length > 0 || selectedFilters[name].length > 0">
    <label
      class="facet-label"
    >{{ facetName }}</label>
    <b-form-tags
      :id="facetName"
      v-model="selectedOptions"
      no-outer-focus
      class="side-filter-autosuggest"
    >
      <template
        #default="{ tags, disabled, addTag, removeTag }"
      >
        <ul
          v-if="tags.length > 0"
        >
          <li
            v-for="tag in tags"
            :key="tag"
            class="list-inline-item"
          >
            <b-form-tag
              :title="tag"
              :disabled="disabled"
              @remove="removeTag(tag)"
            >
              {{ tag }}
            </b-form-tag>
          </li>
        </ul>

        <b-dropdown
          block
        >
          <template #button-content>
            Select {{ facetName.toLowerCase() }}
          </template>
          <b-dropdown-form
            @submit.stop.prevent="() => {}"
          >
            <b-form-group
              label="Search"
              label-for="search-input"
              :description="searchOptions"
              :disabled="disabled"
            >
              <b-form-input
                id="search-input"
                v-model="searchFacet"
                type="search"
                autocomplete="off"
              />
            </b-form-group>
          </b-dropdown-form>
          <b-dropdown-divider />
          <b-dropdown-item-button
            v-for="(option, index) in availableSortedOptions"
            :key="index"
            @click="selectOption({ option, addTag })"
          >
            <FacetFieldLabel
              v-if="isRadio"
              :facet-name="name"
              :field-value="option"
            />
            <template v-else>
              <ColourSwatch
                v-if="isColourPalette"
                :hex-code="option.label"
              />
              <FacetFieldLabel
                :facet-name="name"
                :field-value="option.label"
              />
            </template>
          </b-dropdown-item-button>
          <b-dropdown-text v-if="availableSortedOptions.length === 0">
            There are no tags available to select
          </b-dropdown-text>
        </b-dropdown>
      </template>
    </b-form-tags>
  </div>
</template>

<script>
  import xor from 'lodash/xor';
  import FacetFieldLabel from './FacetFieldLabel';
  import ColourSwatch from '../generic/ColourSwatch';
  import { BFormTags, BFormTag } from 'bootstrap-vue';

  export default {
    name: 'SideFacetAutosuggest',

    components: {
      // AlertMessage: () => import('../generic/AlertMessage'),
      BFormTags,
      BFormTag,
      FacetFieldLabel,
      ColourSwatch
      // LoadingSpinner: () => import('../generic/LoadingSpinner'),
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
       * Selected option(s)
       */
      selected: {
        type: [Array, String],
        default: () => []
      },

      /**
       * Type of input fields in dropdown, could be radio or checkbox
       *
       * @values radio, checkbox
       */
      type: {
        type: String,
        required: true
      },

      /**
       * Static fields, these fields need no fetching
       */
      staticFields: {
        type: Array,
        default: null
      }
    },

    data() {
      return {
        searchFacet: '',
        RADIO: 'radio',
        CHECKBOX: 'checkbox',
        preSelected: null,
        fetched: !!this.staticFields,
        fields: this.staticFields || [],
        selectedOptions: this.selected || []
      };
    },

    fetch() {
      // Static fields need no fetching
      if (this.staticFields) {
        this.fields = this.staticFields;
        this.fetched = true;
        return Promise.resolve();
      }

      return this.$store.dispatch('search/queryFacet', this.name)
        .then((facets) => {
          let fields = (facets || [])[0]?.fields || [];

          // Limit contentTier filter options shown
          if (this.name === 'contentTier') {
            fields = this.filterContentTierFields(fields);
          }

          this.fields = fields;
          this.fetched = true;
        });
    },

    computed: {
      selectedFilters() {
        return {
          [this.name]: [].concat(this.selected)
        };
      },

      filterSelectionDisabled() {
        return this.$store.state.search.liveQueries.length > 0;
      },

      sortedOptions() {
        if (this.isRadio) {
          return this.fields;
        }

        const selected = this.fields.filter(field => this.selected.includes(field.label));
        const leftOver = this.fields.filter(field => !this.selected.includes(field.label));

        return selected.sort((a, b) => a.count > b.count).concat(leftOver);
      },

      availableSortedOptions() {
        const criteria = this.criteria;

        const options = this.sortedOptions.filter(option => this.selectedOptions.indexOf(option) === -1);

        if (criteria) {
          return options.filter(option => {
            const optionLabel = this.isRadio ? option : option.label;
            return optionLabel.toLowerCase().indexOf(criteria) > -1;
          });
        }

        return options;
      },

      isColourPalette() {
        return this.facetName === 'Colour';
      },

      facetName() {
        return this.$tFacetName(this.name);
      },

      isRadio() {
        return this.type === this.RADIO;
      },

      dropdownVariant() {
        return ((typeof this.selected === 'string') || (Array.isArray(this.selected) && this.selected.length > 0)) ? 'selected' : 'light';
      },

      criteria() {
        return this.searchFacet.trim().toLowerCase();
      },

      searchOptions() {
        if (this.criteria && this.sortedOptions.length === 0) {
          return 'There are no tags matching your search criteria';
        }
        return '';
      }
    },

    watch: {
      selected() {
        // We watch selected property so when user clicks on browser back button,
        // facets properties are updated correctly
        this.init();
      },
      '$route.query.reusability': 'updateRouteQueryReusability',
      '$route.query.query': '$fetch',
      '$route.query.qf': 'updateRouteQueryQf'
    },

    mounted() {
      this.init();
    },

    destroyed() {
      this.$store.commit('search/removeResettableFilter', this.name);
    },

    methods: {
      filterContentTierFields(fields) {
        // In general, only show option 0
        let contentTierFilters = ['"0"'];

        if (this.$store.getters['search/collection']) {
          // If searching within a thematic collection, only show options 2 to 4
          contentTierFilters = ['"2"', '"3"', '"4"'];
        } else if (this.$store.getters['entity/id']) {
          // If searching with a non-thematic collection...
          if (this.$store.getters['entity/id'].includes('/organization/')) {
            // ... and it is an organization, do not limit the options
            contentTierFilters = null;
          } else {
            // ... and it is not an organization, only show options 1 to 4
            contentTierFilters = ['"1"', '"2"', '"3"', '"4"'];
          }
        }

        if (contentTierFilters) {
          fields = fields.filter(field => contentTierFilters.includes(field.label));
        }

        return fields;
      },
      // Refetch facet fields, unless this is the reusability facet
      updateRouteQueryReusability() {
        if (this.name !== 'REUSABILITY') {
          this.$fetch();
        }
      },
      // Refetch facet fields, but only if other qf query values have changed
      updateRouteQueryQf(newQf, oldQf) {
        // Look for changes to qf, accounting for them being potentially strings
        // or arrays or undefined.
        const qfDiff = xor(
          newQf ? [].concat(newQf) : [],
          oldQf ? [].concat(oldQf) : []
        );
        if (qfDiff.length === 0) {
          return;
        }

        const onlyThisFacetChanged = qfDiff.every(qf => qf.startsWith(`${this.name}:`));

        if (!onlyThisFacetChanged) {
          this.$fetch();
        }
      },
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

      selectOption({ option, addTag }) {
        const selected = this.isRadio ? option : option.label;
        addTag(selected);
        this.searchFacet = '';

        this.$emit('changed', this.name, selected);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables';
  
  // TEMP: for testing
  .colour-palette {
    border: 1px solid $whitegrey;
    border-radius: 50%;
    height: 1rem;
    width: 1rem;
    display: inline-block;
  }
</style>
