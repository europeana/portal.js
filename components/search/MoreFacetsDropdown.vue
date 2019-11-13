<template>
  <b-dropdown
    ref="dropdown"
    variant="light"
    no-caret
    class="more-facets position-static"
    :class="{ 'is-active' : savedOptions.length > 0 }"
    data-qa="more filters dropdown button"
    @hidden="cancelHandler"
  >
    <template v-slot:button-content>
      {{ $t('facets.button.morefilters') }}
      <span
        v-if="savedOptions.length > 0"
        class="selected-amount"
      >
        {{ savedOptions.length }}
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
        :disabled="preSavedOptions.length < 1 && savedOptions.length < 1"
        @click="resetFilters"
      >
        {{ $t('facets.button.reset') }}
      </b-button>
      <b-button
        variant="link"
        :disabled="preSavedOptions.length < 1"
        @click="cancelHandler"
      >
        {{ $t('facets.button.cancel') }}
      </b-button>
      <b-button
        variant="primary"
        :disabled="disableAppliedButton"
        @click="saveOptions()"
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
      }
    },

    data() {
      return {
        preSaved: {},
        saved: {}
      };
    },

    computed: {
      preSavedOptions() {
        return [].concat(...Object.values(this.preSaved));
      },

      savedOptions() {
        return [].concat(...Object.values(this.saved));
      },

      disableAppliedButton() {
        return this.preSavedOptions.length > 0 ? isEqual(this.preSavedOptions, this.savedOptions) : true;
      }
    },

    methods: {
      updateSelected(facetName, selectedFields) {
        if (this.preSaved[facetName] && selectedFields.length < 1) {
          Vue.delete(this.preSaved, facetName);
        } else {
          Vue.set(this.preSaved, facetName, selectedFields);
        }
      },

      saveOptions() {
        for (let key in this.preSaved) {
          Vue.set(this.saved, key, this.preSaved[key]);
        }
        this.clearPreSaved();
      },

      cancelHandler() {
        this.clearPreSaved();
        // Calls `updateSelectedOptions` method in child componen: `MoreFacetsDropdownOptions.vue`
        this.$root.$emit('updateSelectedOptions', this.savedOptions);
        this.$refs.dropdown.hide(true);
      },

      resetFilters() {
        this.clearSaved();
        this.clearPreSaved();
        // Calls `updateSelectedOptions` method in child componen: `MoreFacetsDropdownOptions.vue`
        this.$root.$emit('updateSelectedOptions', []);
      },

      clearSaved() {
        for (let key in this.saved) {
          Vue.delete(this.saved, key);
        }
      },

      clearPreSaved() {
        for (let key in this.preSaved) {
          Vue.delete(this.preSaved, key);
        }
      }
    }
  };
</script>
