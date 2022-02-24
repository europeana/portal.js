<template>
  <div v-if="!fetched || fields.length > 0 || selectedFilters[name].length > 0">
    <label
      class="facet-label"
    >{{ facetName }}</label>
    <b-form-tags
      :id="facetNameNoSpaces"
      v-model="selectedOptions"
      no-outer-focus
      class="side-filter-autosuggest"
      :limit="isRadio ? 1 : null"
    >
      <template
        #default="{ tags, disabled, addTag, removeTag }"
      >
        <!-- TODO: use SearchFilters? -->
        <ul
          v-if="tags.length > 0"
        >
          <li
            v-for="tag in tags"
            :key="tag"
            class="list-inline-item"
          >
            <b-form-tag
              :disabled="disabled"
              @remove="removeOption({ tag, removeTag })"
            >
              <FacetFieldLabel
                :facet-name="name"
                :field-value="tag"
                :prefixed="false"
                escaped
              />
            </b-form-tag>
          </li>
        </ul>

        <b-dropdown
          block
        >
          <template #button-content>
            Select {{ facetName.toLowerCase() }}
          </template>
          <template
            v-if="search"
          >
            <b-dropdown-form
              @submit.stop.prevent="() => {}"
            >
              <b-form-group
                label="Search"
                :label-for="`${facetNameNoSpaces}-search-input`"
                :description="searchOptions"
                :disabled="disabled"
              >
                <b-form-input
                  :id="`${facetNameNoSpaces}-search-input`"
                  v-model="searchFacet"
                  type="search"
                  autocomplete="off"
                />
              </b-form-group>
            </b-dropdown-form>
            <b-dropdown-divider />
          </template>
          <b-dropdown-item-button
            v-for="(option, index) in availableSortedOptions"
            :key="index"
            @click="selectOption({ option, addTag, removeTag })"
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
              <span>({{ option.count | localise }})</span>
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
  import themes from '@/plugins/europeana/themes';
  import { unquotableFacets } from '@/plugins/europeana/search';
  import { escapeLuceneSpecials } from '@/plugins/europeana/utils';

  /**
   * Dropdown for search facet, with removable tags and optional search.
   */
  export default {
    name: 'SideFacetDropdown',

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
      },

      /**
       * If `true`, enable search of available fields.
       */
      search: {
        type: Boolean,
        default: false
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

      return this.queryFacet()
        .then((fields) => {
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

      facetNameNoSpaces() {
        return this.$tFacetName(this.name).replace(/\s/g, '-').toLowerCase();
      },

      isRadio() {
        return this.type === this.RADIO;
      },

      collection() {
        return this.$store.getters['search/collection'];
      },

      theme() {
        return themes.find(theme => theme.qf === this.collection);
      },

      themeSpecificFieldLabelPattern() {
        return (this.theme?.facets || []).find((facet) => facet.field === this.name)?.label;
      },

      recordApiSearchParams() {
        const params = {
          ...this.$store.state.search.apiParams,
          rows: 0,
          profile: 'facets',
          facet: this.name
        };
        if (this.search) {
          params[`f.${this.name}.facet.limit`] = 500;
        }
        return params;
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
      queryFacet() {
        this.$store.commit('search/addLiveQuery', this.recordApiSearchParams);

        return this.$apis.record.search(this.recordApiSearchParams, {
          ...this.$store.getters['search/searchOptions'],
          locale: this.$i18n.locale
        })
          .then((response) => response.facets?.[0]?.fields || [])
          .then((fields) => this.filterFacetFields(fields))
          .catch(async(error) => {
            // TODO: refactor not to use store. rely on fetchState.error instead
            await this.$store.dispatch('search/updateForFailure', error);
          })
          .finally(() => {
            this.$store.commit('search/removeLiveQuery', this.recordApiSearchParams);
          });
      },

      filterFacetFields(fields) {
        if (this.name === 'REUSABILITY') {
          fields = fields.filter((field) => field.label !== 'uncategorized');
        } else if (this.name === 'contentTier') {
          fields = this.filterContentTierFields(fields);
        }

        if (this.themeSpecificFieldLabelPattern) {
          fields = fields.filter((field) => this.themeSpecificFieldLabelPattern.test(field.label));
        }

        return fields;
      },

      filterContentTierFields(fields) {
        // In general, only show option 0
        let contentTierFilters = ['0'];

        if (this.collection) {
          // If searching within a thematic collection, only show options 2 to 4
          contentTierFilters = ['2', '3', '4'];
        } else if (this.$store.getters['entity/id']) {
          // If searching with a non-thematic collection...
          if (this.$store.getters['entity/id'].includes('/organization/')) {
            // ... and it is an organization, do not limit the options
            contentTierFilters = null;
          } else {
            // ... and it is not an organization, only show options 1 to 4
            contentTierFilters = ['1', '2', '3', '4'];
          }
        }

        if (contentTierFilters) {
          fields = fields.filter(field => contentTierFilters.includes(field.label));
        }

        return fields;
      },

      enquoteFacetFieldFilterValue(value) {
        return unquotableFacets.includes(this.name) ? value : `"${escapeLuceneSpecials(value)}"`;
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

      removeOption({ tag, removeTag }) {
        removeTag(tag);
        this.$emit('changed', this.name, this.selected.filter((selection) => selection !== tag));
      },

      selectOption({ option, addTag, removeTag }) {
        // when isRadio and already one option selected > replace
        if (this.isRadio && this.selectedOptions.length === 1) {
          removeTag(this.selectedOptions[0]);
        }

        const selected = this.isRadio ? option : option.label;
        addTag(selected);
        this.searchFacet = '';

        this.$emit('changed', this.name, (this.isRadio ? selected : this.selected.concat(selected)));
      }
    }
  };
</script>
