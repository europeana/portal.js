<template>
  <b-dropdown
    ref="dropdown"
    variant="light"
    no-caret
    class="more-facets position-static"
    :class="{ 'is-active' : isActive && applied }"
    data-qa="more filters dropdown button"
  >
    <template v-slot:button-content>
      {{ $t('facets.button.morefilters') }}
      <span
        v-if="isActive && applied"
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
        @click="$refs.dropdown.hide(true)"
      >
        {{ $t('facets.button.cancel') }}
      </b-button>
      <b-button
        variant="primary"
        :disabled="!isActive"
        @click="applied = true"
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
        selected: {},
        applied: false
      };
    },

    computed: {
      isActive() {
        return this.selectedAmount > 0;
      },

      selectedAmount() {
        let sum = 0;
        for (const key in this.selected) {
          sum += this.selected[key].length;
        }
        return sum;
      }
    },

    methods: {
      updateSelected(value) {
        Vue.set(this.selected, Object.keys(value), value[Object.keys(value)]);
      }
    }
  };
</script>
