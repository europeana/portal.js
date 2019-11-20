<template>
  <b-dropdown
    ref="dropdown"
    variant="light"
    no-caret
    class="more-facets position-static"
    :class="{ 'is-active' : selectedOptionsCount > 0 }"
    data-qa="more filters dropdown button"
    @hidden="cancelHandler"
  >
    <template v-slot:button-content>
      {{ $t('facets.button.morefilters') }}
      <span
        v-if="selectedOptionsCount > 0"
        class="selected-amount"
      >
        {{ selectedOptionsCount }}
      </span>
    </template>
    <b-dropdown-group class="more-facets-wrapper">
      <MoreFacetsDropdownOptions
        v-for="(facet, index) in moreFacets"
        :key="index"
        :fields="facet.fields"
        :name="facet.name"
        :selected="preSelected[facet.name]"
        @selectedOptions="updateSelected"
      />
    </b-dropdown-group>
    <li
      class="dropdown-buttons"
      role="group"
    >
      <b-button
        variant="link"
        :disabled="selectedOptionsCount < 1"
        data-qa="reset filter button"
        @click="resetFilters"
      >
        {{ $t('facets.button.reset') }}
      </b-button>
      <b-button
        variant="link"
        :disabled="disableButton"
        data-qa="cancel button"
        @click="cancelHandler"
      >
        {{ $t('facets.button.cancel') }}
      </b-button>
      <b-button
        variant="primary"
        :disabled="disableButton"
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
      selectedOptionsCount() {
        return [].concat(...Object.values(this.selected)).length;
      },

      disableButton() {
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
