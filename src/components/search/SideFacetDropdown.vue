<template>
  <div>
    <b-form-tags
      :id="facetNameNoSpaces"
      v-model="selectedOptions"
      no-outer-focus
      class="side-filter-autosuggest"
      :limit="isRadio ? 1 : null"
    >
      <template
        #default="{ tags, addTag, removeTag }"
      >
        <label
          class="facet-label"
          :class="{ 'facet-label-active' : activeLabel }"
        >
          {{ facetName }}
        </label>

        <b-container v-if="$fetchState.error">
          <AlertMessage
            :error="$fetchState.error.message"
          />
        </b-container>
        <template v-else>
          <ul
            v-if="tags.length > 0"
          >
            <li
              v-for="tag in tags"
              :key="tag"
              class="list-inline-item mw-100"
            >
              <b-form-tag
                data-qa="filter badge"
                pill
                class="remove-button"
                variant="primary-light"
                @remove="removeOption({ tag, removeTag })"
              >
                <span>
                  {{ tFacetOption(name, tag, true) }}
                </span>
              </b-form-tag>
            </li>
          </ul>

          <b-dropdown
            ref="dropdown"
            block
            no-flip
            :data-qa="`${name} side facet dropdown button`"
            @show="prefetch"
            @shown="shownDropdown"
            @hidden="resetDropdown"
            @mouseover.native="prefetch"
            @focusin.native="prefetch"
          >
            <template #button-content>
              {{ $tc('sideFilters.select', isRadio ? 1 : 2, {filter: facetName.toLowerCase()}) }}
            </template>
            <template
              v-if="searchable"
            >
              <b-dropdown-form
                @submit.stop.prevent="() => {}"
              >
                <b-form-group
                  :label-for="`${facetNameNoSpaces}-search-input`"
                >
                  <b-form-input
                    :id="`${facetNameNoSpaces}-search-input`"
                    ref="search-input"
                    v-model="searchFacet"
                    type="text"
                    autocomplete="off"
                    :placeholder="$t('sideFilters.search')"
                    data-qa="side facet dropdown search input"
                    @input="activeSearchInput = true"
                    @blur="activeSearchInput = false"
                  />
                  <span class="icon-search" />
                </b-form-group>
              </b-dropdown-form>
            </template>
            <b-dropdown-item-button
              v-for="(option, index) in availableSortedOptions"
              :key="index"
              :data-qa="`${isRadio ? option : option.label} ${name} field`"
              @click="selectOption({ option, addTag, removeTag })"
            >
              <span v-if="isRadio">
                {{ tFacetOption(name, option) }}
              </span>
              <template v-else>
                <ColourSwatch
                  v-if="isColourPalette"
                  :hex-code="option.label"
                />
                <span>
                  {{ tFacetOption(name, option.label) }}
                </span>
                <span>({{ option.count | localise }})</span>
              </template>
            </b-dropdown-item-button>
            <b-dropdown-text
              v-if="$fetchState.pending"
            >
              <LoadingSpinner />
            </b-dropdown-text>
            <b-dropdown-text v-else-if="fetched && availableSortedOptions.length === 0">
              {{ $t('sideFilters.noOptions') }}
            </b-dropdown-text>
          </b-dropdown>
        </template>
      </template>
    </b-form-tags>
  </div>
</template>

<script>
  import ColourSwatch from '../generic/ColourSwatch';
  import { BFormTags, BFormTag } from 'bootstrap-vue';
  import themes from '@/plugins/europeana/themes';
  import { unquotableFacets } from '@/plugins/europeana/search';
  import { escapeLuceneSpecials, unescapeLuceneSpecials } from '@/plugins/europeana/utils';
  import facetsMixin from '@/mixins/facets';

  /**
   * Dropdown for search facet, with removable tags and optional search.
   */
  export default {
    name: 'SideFacetDropdown',

    components: {
      BFormTags,
      BFormTag,
      ColourSwatch,
      AlertMessage: () => import('../generic/AlertMessage'),
      LoadingSpinner: () => import('../generic/LoadingSpinner')
    },

    mixins: [facetsMixin],

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
      },

      /**
       * Array of strings to group fields by
       */
      groupBy: {
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
        selectedOptions: this.selected || [],
        activeSearchInput: false,
        mayFetch: false,
        fetching: false
      };
    },

    fetch() {
      // Static fields need no fetching
      if (this.staticFields) {
        this.fields = this.staticFields;
        this.fetched = true;
        return Promise.resolve();
      }

      if (!this.mayFetch || this.fetching) {
        return Promise.resolve();
      }

      this.fetching = true;
      return this.queryFacet()
        .then((fields) => {
          this.fetching = false;
          this.fields = fields;
          this.fetched = true;
        });
    },

    computed: {
      searchable() {
        return this.search && this.availableSortedOptions.length > 0;
      },

      selectedFilters() {
        return {
          [this.name]: [].concat(this.selected)
        };
      },

      groupedOptions() {
        if (!this.groupBy) {
          return this.fields;
        }

        const groups = this.groupBy.map((substring) => ({ label: `*${substring}*`, substring, count: 0 }));
        for (const field of this.fields) {
          const fieldGroup = groups.find((group) => field.label.includes(group.substring));
          if (fieldGroup) {
            fieldGroup.count = fieldGroup.count + field.count;
          } else {
            groups.push(field);
          }
        }
        return groups.filter((group) => group.count > 0).map((group) => ({ label: group.label, count: group.count }));
      },

      sortedOptions() {
        if (this.isRadio) {
          return this.fields;
        }

        const fields = this.groupedOptions;
        const sortByCount = (a, b) => b.count - a.count;

        const selected = fields.filter(field => this.selected.includes(field.label)).sort(sortByCount);
        const leftOver = fields.filter(field => !this.selected.includes(field.label)).sort(sortByCount);

        return selected.concat(leftOver);
      },

      availableSortedOptions() {
        if (!this.fetched) {
          return [];
        }

        const criteria = this.criteria;

        const unquotedSelectedOptions = this.selectedOptions.map(option => unescapeLuceneSpecials(option.replace(/^"(.*)"$/, '$1')));

        const options = this.sortedOptions.filter(option => unquotedSelectedOptions.indexOf(this.isRadio ? option : option.label) === -1);

        if (criteria) {
          return options.filter(option => {
            const optionLabel = this.isRadio ? option : option.label;
            const optionLocalisedLabel = this.tFacetOption(this.name, optionLabel);
            const exactMatch = optionLocalisedLabel.toLowerCase().indexOf(criteria) > -1;
            const facetValueMatch = optionLabel.toLowerCase().indexOf(criteria) > -1;
            return exactMatch || facetValueMatch;
          });
        }

        return options;
      },

      isColourPalette() {
        return this.name === 'COLOURPALETTE';
      },

      facetName() {
        return this.tFacetName(this.name);
      },

      facetNameNoSpaces() {
        return this.tFacetName(this.name).replace(/\s/g, '-').toLowerCase();
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

      paramsForFacets() {
        return {
          ...this.$store.state.search.apiParams,
          rows: 0,
          profile: 'facets',
          facet: this.name
        };
      },

      criteria() {
        return this.searchFacet.trim().toLowerCase();
      },

      activeLabel() {
        return this.selectedFilters[this.name].length > 0 || this.activeSearchInput;
      }
    },

    watch: {
      selected() {
        // We watch selected property so when user clicks on browser back button,
        // facets properties are updated correctly
        this.init();
      },
      '$route.query.reusability': 'refetch',
      '$route.query.api': 'refetch',
      '$route.query.query': 'refetch',
      '$route.query.qf': 'refetch'
    },

    mounted() {
      this.init();
    },

    methods: {
      queryFacet() {
        return this.$apis.record.search(this.paramsForFacets, {
          ...this.$store.getters['search/searchOptions'],
          locale: this.$i18n.locale
        })
          .then((response) => response.facets?.[0]?.fields || [])
          .then((fields) => this.filterFacetFields(fields))
          .catch(async(error) => {
            // TODO: refactor not to use store. rely on fetchState.error instead
            await this.$store.dispatch('search/updateForFailure', error);
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
        if (unquotableFacets.includes(this.name) || this.groupBy) {
          return value;
        } else {
          return `"${escapeLuceneSpecials(value)}"`;
        }
      },

      refetch() {
        this.$nextTick(() => {
          this.fetched = false;
          this.$fetch();
        });
      },

      prefetch() {
        if (this.fetched) {
          return Promise.resolve();
        }
        this.mayFetch = true;
        return this.$fetch()
          .then(() => {
            this.mayFetch = false;
          });
      },

      init() {
        if (this.isRadio && Array.isArray(this.selected)) {
          this.preSelected = this.selected[0];
        } else {
          this.preSelected = this.selected;
        }

        this.selectedOptions = this.selected || [];
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

        this.$emit('changed', this.name, this.isRadio ? selected : this.selected.concat(this.enquoteFacetFieldFilterValue(selected)));
      },

      shownDropdown() {
        this.searchable && this.$refs['search-input'].focus();
      },

      resetDropdown() {
        this.searchFacet = '';
        this.$refs.dropdown.$refs.menu.scrollTop = 0;
        this.mayFetch = false;
      }
    }
  };
</script>

<docs lang="md">
  Type radio:
  ```jsx
  <SideFacetDropdown
    name="collection"
    type="radio"
    :static-fields="['ww1', 'archaeology', 'art', 'fashion']"
  />
  ```
  Type checkbox:
  ```jsx
  <SideFacetDropdown
    name="TYPE"
    type="checkbox"
    :static-fields="[
      { label:'IMAGE', count: 28417756 },
      { label:'TEXT', count: 21607709 },
      { label:'SOUND', count: 782764 },
      { label:'VIDEO', count: 514235 },
      { label:'3D', count: 17668 }
    ]"
  />
  ```

  Type checkbox with search option:
  ```jsx
  <SideFacetDropdown
    name="institution"
    type="checkbox"
    search
    :static-fields="[
      { label: 'Österreichische Nationalbibliothek - Austrian National Library', count: 37663 },
      { label: 'National Library of Denmark', count: 5162 },
      { label: 'The Great War Archive, University of Oxford', count: 1640 },
      { label: 'The Royal Library: The National Library of Denmark and Copenhagen University Library', count: 1628 },
      { label: 'Europeana 1914-1918', count: 1263 },
      { label: 'Deutsche Fotothek', count: 669 },
      { label: 'Berlin State Library', count: 477 }
      ]"
  />
  ```
</docs>
