<template>
  <b-dropdown
    ref="dropdown"
    variant="light"
    no-caret
    class="more-facets position-static mb-2"
    :class="{ 'is-active' : anyOptionsSelected }"
    data-qa="more filters dropdown button"
    @hidden="cancelHandler"
  >
    <template v-slot:button-content>
      {{ $t('facets.button.morefilters') }}
      <span
        v-if="anyOptionsSelected"
        class="selected-amount"
        data-qa="more filters selected options count"
      >
        {{ selectedOptionsCount }}
      </span>
    </template>
    <b-dropdown-form>
      <li
        class="more-facets-wrapper"
        role="presentation"
      >
        <FilterOptionsRadioGroup
          v-if="showApiToggle"
          facet-name="api"
          :options="['fulltext', 'metadata']"
          selected="fulltext"
        />
        <DateFilter
          v-if="showDateFilter"
          :name="PROXY_DCTERMS_ISSUED"
          :start="dateFilter.start"
          :end="dateFilter.end"
          :specific="dateFilter.specific"
          @dateFilter="dateFilterSelected"
        />
        <template
          v-for="(facet, index) in moreFacets"
        >
          <MoreFiltersDropdownFacet
            v-if="facet.fields && facet.fields.length > 0"
            :key="index"
            :fields="facet.fields"
            :name="facet.name"
            :selected="preSelected[facet.name]"
            @selectedOptions="updateSelected"
          />
        </template>
      </li>
      <li
        class="dropdown-buttons"
        role="presentation"
      >
        <b-button
          variant="link"
          :disabled="!anyOptionsSelected"
          data-qa="reset filter button"
          @click="resetFilters"
        >
          {{ $t('facets.button.reset') }}
        </b-button>
        <b-button
          variant="link"
          data-qa="cancel button"
          @click="cancelHandler"
        >
          {{ $t('facets.button.cancel') }}
        </b-button>
        <b-button
          variant="primary"
          :disabled="selectedOptionsUnchanged"
          data-qa="apply button"
          type="submit"
          @click.stop="applySelected"
        >
          {{ $t('facets.button.apply') }}
        </b-button>
      </li>
    </b-dropdown-form>
  </b-dropdown>
</template>

<script>
  import Vue from 'vue';
  import isEqual from 'lodash/isEqual';
  import { rangeToQueryParam, rangeFromQueryParam } from '../../plugins/europeana/search';
  import MoreFiltersDropdownFacet from './MoreFiltersDropdownFacet';
  import DateFilter from './DateFilter';
  import FilterOptionsRadioGroup from './FilterOptionsRadioGroup';

  export default {
    components: {
      MoreFiltersDropdownFacet,
      DateFilter,
      FilterOptionsRadioGroup
    },

    props: {
      moreFacets: {
        type: Array,
        default: () => []
      },

      selected: {
        type: Object,
        default: () => {}
      }
    },

    data() {
      return {
        preSelected: this.cloneSelected(),
        isCheckedSpecificDate: false,
        PROXY_DCTERMS_ISSUED: 'proxy_dcterms_issued',
        NEWSPAPERS_CONCEPT_URI: 'http://data.europeana.eu/concept/base/18'
      };
    },

    computed: {
      anyOptionsSelected() {
        return this.selectedOptionsCount > 0;
      },

      selectedOptionsCount() {
        return [].concat(...Object.values(this.selected)).length;
      },

      selectedOptionsUnchanged() {
        return isEqual(this.preSelected, this.selected);
      },

      moreFacetNames() {
        return this.moreFacets.map((facet) => facet.name);
      },

      showDateFilter() {
        // Hardcoded for now - https://europeana.atlassian.net/browse/EC-4033
        return this.$store.state.entity.id === this.NEWSPAPERS_CONCEPT_URI;
      },

      showApiToggle() {
        return this.$store.state.entity.id === this.NEWSPAPERS_CONCEPT_URI;
      },

      dateFilter() {
        const proxyDctermsIssued = this.preSelected[this.PROXY_DCTERMS_ISSUED];
        if (!proxyDctermsIssued || proxyDctermsIssued.length < 1) {
          return { start: null, end: null, specific: this.isCheckedSpecificDate };
        }

        const range = rangeFromQueryParam(proxyDctermsIssued[0]);
        if (!range) {
          return { start: proxyDctermsIssued[0], end: null, specific: true };
        }
        return range;
      }
    },

    watch: {
      selected() {
        this.preSelected = this.cloneSelected();
      }
    },

    methods: {
      cloneSelected() {
        return Object.assign({}, this.selected);
      },

      dateFilterSelected(facetName, dateRange) {
        let dateQuery = [];

        if (dateRange.specific) {
          if (dateRange.start) {
            dateQuery = [dateRange.start];
          }
        } else if (dateRange.start || dateRange.end) {
          dateQuery = [rangeToQueryParam(dateRange)];
        }

        this.isCheckedSpecificDate = dateRange.specific;
        this.updateSelected(facetName, dateQuery);
      },

      updateSelected(facetName, selectedFields) {
        Vue.set(this.preSelected, facetName, selectedFields);
      },

      applySelected() {
        this.$emit('changed', this.preSelected);
        this.$refs.dropdown.hide(true);
      },

      cancelHandler() {
        this.preSelected = this.cloneSelected();
        this.$refs.dropdown.hide(true);
      },

      resetFilters() {
        this.clearPreSelected();
        this.isCheckedSpecificDate = false;
      },

      clearPreSelected() {
        for (const facetName in this.preSelected) {
          this.preSelected[facetName] = [];
        }
      }
    }
  };
</script>
