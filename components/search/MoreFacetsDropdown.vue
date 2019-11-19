<template>
  <b-dropdown
    ref="dropdown"
    variant="light"
    no-caret
    class="more-facets position-static"
    :class="{ 'is-active' : selectedOptions.length > 0 }"
    data-qa="more filters dropdown button"
    @hidden="cancelHandler"
  >
    <template v-slot:button-content>
      {{ $t('facets.button.morefilters') }}
      <span
        v-if="selectedOptions.length > 0"
        class="selected-amount"
      >
        {{ selectedOptions.length }}
      </span>
    </template>
    <b-dropdown-group class="more-facets-wrapper">
      <MoreFacetsDropdownOptions
        v-for="(facet, index) in moreFacets"
        :key="index"
        :fields="facet.fields"
        :name="facet.name"
        :pre-selected="selected[facet.name]"
        @selectedOptions="updateSelected"
      />
    </b-dropdown-group>
    <li
      class="dropdown-buttons"
      role="group"
    >
      <b-button
        variant="link"
        :disabled="selectedOptions.length < 1"
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
        preSelected: {}
      };
    },

    computed: {
      preSelectedOptions() {
        return [].concat(...Object.values(this.preSelected));
      },

      selectedOptions() {
        return [].concat(...Object.values(this.selected));
      },

      disableButton() {
        return isEqual(this.preSelected, this.selected);
      }
    },

    watch: {
      $route() {
        this.preSelected = Object.assign({}, this.selected);
      }
    },

    mounted() {
      this.preSelected = Object.assign({}, this.selected);
    },

    methods: {
      updateSelected(facetName, selectedFields) {
        Vue.set(this.preSelected, facetName, selectedFields);

        if (this.selectedOptions.length === 0) {
          this.clearEmpty();
        }
      },

      applySelected() {
        this.$emit('changed', this.preSelected);
        this.clearEmpty();
        this.$refs.dropdown.hide(true);
      },

      cancelHandler() {
        this.clearPreSelected();
        this.clearEmpty();
        this.$root.$emit('updateSelectedOptions');
        this.$refs.dropdown.hide(true);
      },

      resetFilters() {
        this.clearPreSelected();
        this.$emit('changed', this.preSelected);
        this.clearEmpty();
      },

      clearSaved() {
        for (let key in this.saved) {
          Vue.delete(this.saved, key);
        }
      },

      clearEmpty() {
        for (let key in this.preSelected) {
          if (this.preSelected[key].length < 1) {
            Vue.delete(this.preSelected, key);
          }
        }
      },

      clearPreSelected() {
        for (let key in this.preSelected) {
          this.preSelected[key] = [];
        }
      }
    }
  };
</script>
