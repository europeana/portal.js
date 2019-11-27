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
      >
        {{ selectedOptionsCount }}
      </span>
    </template>
    <b-dropdown-group class="more-facets-wrapper">
      <template
        v-for="(facet, index) in moreFacets"
      >
        <MoreFacetsDropdownOptions
          v-if="facet.fields && facet.fields.length > 0"
          :key="index"
          :fields="facet.fields"
          :name="facet.name"
          :selected="preSelected[facet.name]"
          @selectedOptions="updateSelected"
        />
      </template>
    </b-dropdown-group>
    <li
      class="dropdown-buttons"
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
        @click="applySelected"
      >
        {{ $t('facets.button.apply') }}
      </b-button>
    </li>
  </b-dropdown>
</template>

<script>
  import Vue from 'vue';
  import isEqual from 'lodash/isEqual';
  import MoreFacetsDropdownOptions from '../../components/search/MoreFacetsDropdownOptions';

  export default {
    components: {
      MoreFacetsDropdownOptions
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
        preSelected: this.cloneSelected()
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
      },

      clearPreSelected() {
        for (const facetName in this.preSelected) {
          this.preSelected[facetName] = [];
        }
      }
    }
  };
</script>
