<template>
  <b-dropdown
    variant="light"
    no-caret
    class="more-facets position-static"
    :class="{ 'is-active' : selectedAmount > 0 }"
    data-qa="more filters dropdown button"
  >
    <template v-slot:button-content>
      {{ $t('facets.button.morefilters') }}
      <span
        v-if="selectedAmount > 0"
        class="selected-amount"
      >
        {{ selectedAmount }}
      </span>
    </template>
    <b-dropdown-group class="more-facets-wrapper">
      <MoreFacetsDropdownOptions
        v-for="(facet, index) in moreFacets"
        :key="index"
        :fields="facet.fields"
        :name="facet.name"
        @selectedOptions="updateSelected"
      />
    </b-dropdown-group>
    <li
      class="dropdown-buttons"
      role="group"
    >
      <b-button
        variant="link"
      >
        {{ $t('facets.button.cancel') }}
      </b-button>
      <b-button
        variant="primary"
      >
        {{ $t('facets.button.apply') }}
      </b-button>
    </li>
  </b-dropdown>
</template>

<script>
  import Vue from 'vue';
  import MoreFacetsDropdownOptions from '../../components/search/MoreFacetsDropdownOptions';

  export default {
    components: {
      MoreFacetsDropdownOptions
    },

    props: {
      moreFacets: {
        type: Array,
        default: () => []
      }
    },

    data() {
      return {
        selected: {}
      };
    },

    computed: {
      selectedAmount() {
        let sum = 0;
        for (const key in this.selected) {
          sum += this.selected[key].length;
        }
        return sum;
      }
    },

    methods: {
      updateSelected(facetName, selectedFields) {
        Vue.set(this.selected, facetName, selectedFields);
      }
    }
  };
</script>
