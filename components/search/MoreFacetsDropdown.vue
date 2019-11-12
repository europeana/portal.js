<template>
  <b-dropdown
    ref="dropdown"
    variant="light"
    no-caret
    class="more-facets position-static"
    :class="{ 'is-active' : savedOptionsAmount > 0 }"
    data-qa="more filters dropdown button"
  >
    <template v-slot:button-content>
      {{ $t('facets.button.morefilters') }}
      <span
        v-if="savedOptionsAmount > 0"
        class="selected-amount"
      >
        {{ savedOptionsAmount }}
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
        :disabled="preSavedOptionsAmount < 1"
        @click="clearFilters"
      >
        {{ $t('facets.button.reset') }}
      </b-button>
      <b-button
        variant="link"
        :disabled="preSavedOptionsAmount < 1"
        @click="cancelHandler"
      >
        {{ $t('facets.button.cancel') }}
      </b-button>
      <b-button
        variant="primary"
        :disabled="preSavedOptionsAmount < 1"
        @click="saveOptions()"
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
        preSavedOptions: {},
        savedOptions: {}
      };
    },

    computed: {
      preSavedOptionsAmount() {
        return [].concat(...Object.values(this.preSavedOptions)).length;
      },

      savedOptionsAmount() {
        return [].concat(...Object.values(this.savedOptions)).length;
      }
    },

    methods: {
      updateSelected(facetName, selectedFields) {
        Vue.set(this.preSavedOptions, facetName, selectedFields);
      },

      saveOptions() {
        this.savedOptions = Object.assign({}, this.preSavedOptions);
        this.clearPreSavedOptions();
      },

      cancelHandler() {
        this.clearFilters();
        this.$refs.dropdown.hide(true);
      },

      clearFilters() {
        this.clearSavedOptions();
        this.clearPreSavedOptions();
        // Calls `clearSelectedOptions` method in child componen: `MoreFacetsDropdownOptions.vue`
        this.$root.$emit('clearSelectedOptions');
      },

      clearSavedOptions() {
        for (let key in this.savedOptions) {
          Vue.delete(this.savedOptions, key);
        }
      },

      clearPreSavedOptions() {
        for (let key in this.preSavedOptions) {
          Vue.delete(this.preSavedOptions, key);
        }
      }
    }
  };
</script>
