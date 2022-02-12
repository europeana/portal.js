<template>
  <div v-if="!fetched || fields.length > 0 || selectedFilters[name].length > 0">
    <label
      class="facet-label"
    >{{ facetName }}</label>
    <SearchFilters
      :filters="selectedFilters"
      :prefixed="false"
    />
    <b-dropdown
      :id="facetName"
      ref="dropdown"
      :variant="dropdownVariant"
      class="facet-dropdown side-facet"
      :data-type="type"
      :disabled="fetched && fields.length === 0"
      :data-qa="`${name} facet dropdown`"
      block
      @hidden="hiddenDropdown"
    >
      <template #button-content>
        <span
          class="dropdown-toggle-text"
        >
          {{ facetName }}
        </span>
      </template>

      <b-container v-if="$fetchState.pending">
        <b-row class="flex-md-row py-4 text-center">
          <b-col cols="12">
            <LoadingSpinner />
          </b-col>
        </b-row>
      </b-container>
      <b-container v-else-if="$fetchState.error">
        <b-row class="flex-md-row py-4">
          <b-col cols="12">
            <AlertMessage
              :error="$fetchState.error.message"
            />
          </b-col>
        </b-row>
      </b-container>
      <b-dropdown-form
        v-else
        class="options-container"
      >
        <!-- TODO: we aren't we using b-dropdown-item here? -->
        <div
          v-for="(option, index) in sortedOptions"
          :key="index"
          :data-qa="`${isRadio ? option : option.label} ${name} field`"
          role="menuitem"
        >
          <template v-if="isRadio">
            <b-form-radio
              v-model="preSelected"
              :value="option"
              :name="name"
              :disabled="filterSelectionDisabled"
              :data-qa="`${option} ${name} ${RADIO}`"
              @input="$emit('changed', name, preSelected)"
            >
              <FacetFieldLabel
                :facet-name="name"
                :field-value="option"
              />
            </b-form-radio>
          </template>

          <template v-else>
            <b-form-checkbox
              v-model="preSelected"
              :value="enquoteFacetFieldFilterValue(option.label)"
              :name="name"
              :disabled="filterSelectionDisabled"
              :data-qa="`${option.label} ${name} ${CHECKBOX}`"
              :class="{ 'custom-checkbox-colour': isColourPalette }"
              @input="$emit('changed', name, preSelected)"
            >
              <ColourSwatch
                v-if="isColourPalette"
                :hex-code="option.label"
              />
              <FacetFieldLabel
                :facet-name="name"
                :field-value="option.label"
              />
              <span>({{ option.count | localise }})</span>
            </b-form-checkbox>
          </template>
        </div>
      </b-dropdown-form>
    </b-dropdown>
  </div>
</template>

<script>
  import xor from 'lodash/xor';
  import FacetFieldLabel from './FacetFieldLabel';
  import ColourSwatch from '../generic/ColourSwatch';
  import themes from '@/plugins/europeana/themes';
  import { unquotableFacets } from '@/plugins/europeana/search';
  import { escapeLuceneSpecials } from '@/plugins/europeana/utils';

  export default {
    components: {
      AlertMessage: () => import('../generic/AlertMessage'),
      FacetFieldLabel,
      ColourSwatch,
      LoadingSpinner: () => import('../generic/LoadingSpinner'),
      SearchFilters: () => import('./SearchFilters')
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
        RADIO: 'radio',
        CHECKBOX: 'checkbox',
        preSelected: null,
        fetched: !!this.staticFields,
        fields: this.staticFields || []
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
        this.$store.commit('search/addLiveQuery', this.paramsForFacets);

        return this.$apis.record.search(this.paramsForFacets, {
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
            this.$store.commit('search/removeLiveQuery', this.paramsForFacets);
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

      hiddenDropdown() {
        this.init();
      }
    }
  };
</script>

<docs lang="md">
  Radio buttons, none selected:
  ```jsx
  <SideFacetDropdown
    name="collection"
    type="radio"
    :static-fields="['ww1', 'archaeology', 'art', 'fashion']"
  />
  ```

  Checkboxes, two selected:
  ```jsx
  <SideFacetDropdown
    name="TYPE"
    type="checkbox"
    :selected="['IMAGE', 'VIDEO']"
    :static-fields="[
      { label:'IMAGE', count: 28417756 },
      { label:'TEXT', count: 21607709 },
      { label:'SOUND', count: 782764 },
      { label:'VIDEO', count: 514235 },
      { label:'3D', count: 17668 }
    ]"
  />
  ```
</docs>
