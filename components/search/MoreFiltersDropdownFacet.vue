<template>
  <b-form-group
    :label="$tFacetName(name)"
    :data-qa="`${name} facet`"
  >
    <b-form-checkbox-group
      v-model="selectedOptions"
      :name="name"
      data-qa="checkbox group"
      plain
      @change="selectedHandler"
    >
      <div
        class="option-group"
      >
        <MoreFiltersDropdownFacetOption
          v-for="(filter, index) in fields.slice(0, limitTo)"
          :key="index"
          ref="moreFilter"
          :facet-name="name"
          :option="filter.label"
          :index="index"
        />
      </div>
      <div
        v-if="fields.length > limitTo && isActive"
        class="option-group"
      >
        <MoreFiltersDropdownFacetOption
          v-for="(filter, index) in fields.slice(limitTo)"
          :key="index"
          ref="moreFilter"
          :facet-name="name"
          :option="filter.label"
          :index="index + limitTo"
        />
      </div>
      <button
        v-if="fields.length > limitTo"
        type="button"
        class="btn btn-link btn-toggle"
        :class="{ 'is-active': isActive }"
        :data-qa="`${showMoreOrLess} button`"
        @click.prevent="toggleShowMore"
      >
        {{ showMoreOrLess }}
      </button>
    </b-form-checkbox-group>
  </b-form-group>
</template>

<script>
  import MoreFiltersDropdownFacetOption from './MoreFiltersDropdownFacetOption';

  export default {
    components: {
      MoreFiltersDropdownFacetOption
    },

    props: {
      fields: {
        type: Array,
        required: true
      },

      name: {
        type: String,
        required: true
      },

      selected: {
        type: Array,
        default: () => []
      }
    },

    data() {
      return {
        selectedOptions: null,
        isActive: false,
        limitTo: 9
      };
    },

    computed: {
      showMoreOrLess() {
        const key = this.isActive ? 'facets.button.showLess' : 'facets.button.showAll';
        return this.$t(key, { label: this.$tFacetName(this.name, 2).toLowerCase() });
      }
    },

    watch: {
      selected() {
        this.init();
      }
    },

    mounted() {
      this.init();
    },

    methods: {
      init() {
        this.selectedOptions = this.selected;

        this.$store.dispatch('search/setResettableFilter', {
          name: this.name,
          selected: this.selectedOptions
        });
      },

      selectedHandler() {
        this.$nextTick(() => {
          this.$emit('selected-options', this.name, this.selectedOptions);
        });
      },

      toggleShowMore() {
        this.isActive = !this.isActive;

        this.$nextTick(() => {
          const index = this.limitTo - (this.isActive ? 0 : 1);
          const el = this.$refs.moreFilter[index].$el;
          el.querySelector('input').focus();
        });
      }
    }
  };
</script>
