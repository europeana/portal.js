<template>
  <b-dropdown-form>
    <strong
      class="mb-4 d-inline-block"
    >
      {{ $t(`facets.${facet.name}`).name }}
    </strong>
    <div class="option-group">
      <MoreFacetsDropdownOption
        v-for="(filter, indx) in [].concat(facet.fields).splice(0, limitTo)"
        :key="indx"
        :filter="filter"
        :facet-name="$t(`facets.${facet.name}`).name"
      />
    </div>
    <div
      v-show="isActive"
      class="option-group"
    >
      <MoreFacetsDropdownOption
        v-for="(filter, indx) in [].concat(facet.fields).splice(limitTo)"
        :key="indx"
        :filter="filter"
        :facet-name="$t(`facets.${facet.name}`).name"
      />
    </div>
    <button
      type="button"
      class="btn btn-link btn-toggle"
      :class="{ 'is-active': isActive }"
      @click.prevent="isActive = !isActive"
    >
      {{ isActive ? $t(`facets.button.hideAll`) : $t(`facets.button.showAll`) }} {{ $t(`facets.${facet.name}`).plural }}
    </button>
  </b-dropdown-form>
</template>

<script>
  import MoreFacetsDropdownOption from '../../components/search/MoreFacetsDropdownOption';

  export default {
    components: {
      MoreFacetsDropdownOption
    },

    props: {
      index: {
        type: Number,
        required: true
      },
      facet: {
        type: Object,
        required: true
      }
    },

    data() {
      return {
        isActive: false,
        limitTo: 9
      };
    }
  };
</script>
