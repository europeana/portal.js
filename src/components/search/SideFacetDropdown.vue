<template>
  <div v-if="!fetched || fields.length > 0">
    <label
      class="facet-label"
    >{{ facetName }}</label>
    <b-dropdown
      :id="facetName"
      ref="dropdown"
      :variant="dropdownVariant"
      class="facet-dropdown side-facet"
      :data-type="type"
      data-qa="search facet"
      @hidden="hiddenDropdown"
    >
      <template #button-content>
        <span
          class="dropdown-toggle-text"
          :data-qa="`${name} dropdown button`"
        >
          {{ facetName }}
        </span>
      </template>

      <b-container v-if="$fetchState.pending">
        <b-row class="flex-md-row py-4 text-center">
          <b-col cols="12">
            <LoadingSpinner />
          </b-col>
        </b-row>
      </b-container>
      <b-container v-else-if="$fetchState.error">
        <b-row class="flex-md-row py-4">
          <b-col cols="12">
            <AlertMessage
              :error="$fetchState.error.message"
            />
          </b-col>
        </b-row>
      </b-container>
      <b-dropdown-form
        v-else
        class="options-container"
      >
        <div
          v-for="(option, index) in sortedOptions"
          :key="index"
          :data-qa="`${isRadio ? option : option.label} ${name} field`"
        >
          <template v-if="isRadio">
            <b-form-radio
              v-model="preSelected"
              :value="option"
              :name="name"
              :data-qa="`${option} ${name} ${RADIO}`"
              @input="$emit('changed', name, preSelected)"
            >
              <FacetFieldLabel
                :facet-name="name"
                :field-value="option"
              />
            </b-form-radio>
          </template>

          <template v-else>
            <b-form-checkbox
              v-model="preSelected"
              :value="option.label"
              :name="name"
              :data-qa="`${option.label} ${name} ${CHECKBOX}`"
              @input="$emit('changed', name, preSelected)"
            >
              <FacetFieldLabel
                :facet-name="name"
                :field-value="option.label"
              />
              <span>({{ option.count | localise }})</span>
            </b-form-checkbox>
          </template>
        </div>
      </b-dropdown-form>
    </b-dropdown>
  </div>
</template>

<script>
  import xor from 'lodash/xor';
  import FacetFieldLabel from './FacetFieldLabel';

  export default {
    components: {
      AlertMessage: () => import('../../components/generic/AlertMessage'),
      FacetFieldLabel,
      LoadingSpinner: () => import('@/components/generic/LoadingSpinner')
    },

    props: {
      name: {
        type: String,
        required: true
      },

      selected: {
        type: [Array, String],
        default: () => []
      },

      type: {
        type: String,
        required: true
      },

      staticFields: {
        type: Array,
        default: null
      }
    },

    data() {
      return {
        RADIO: 'radio',
        CHECKBOX: 'checkbox',
        preSelected: null,
        fetched: false,
        fields: []
      };
    },

    fetch() {
      // Static fields need no fetching
      if (this.staticFields) {
        this.fields = this.staticFields;
        this.fetched = true;
        return Promise.resolve();
      }

      return this.$store.dispatch('search/queryFacets', { facet: this.name })
        .then((facets) => {
          this.fields = (facets || [])[0]?.fields || [];
          this.fetched = true;
        });
    },

    computed: {
      filteredFields() {
        let fields = [].concat(this.fields);

        // Only show option 0 for contentTier toggle
        if (this.name === 'contentTier') {
          fields = fields.filter(field => field.label === '"0"');
        }

        return fields;
      },

      sortedOptions() {
        if (this.isRadio) {
          return this.filteredFields;
        }

        const selected = [];

        this.filteredFields.map(field => {
          if (this.selected.includes(field.label)) {
            selected.push(field);
          }
        });

        const leftOver = this.filteredFields.filter(field => !this.selected.includes(field.label));

        return selected.sort((a, b) => a.count + b.count).concat(leftOver);
      },

      facetName() {
        return this.$tFacetName(this.name);
      },

      isRadio() {
        return this.type === this.RADIO;
      },

      dropdownVariant() {
        return ((typeof this.selected === 'string') || (Array.isArray(this.selected) && this.selected.length > 0)) ? 'selected' : 'light';
      }
    },

    watch: {
      selected() {
        // We watch selected property so when user clicks on browser back button,
        // facets properties are updated correctly
        this.init();
      },
      // TODO: why are we watching API in route query? is it ever used?
      '$route.query.api': '$fetch',
      '$route.query.reusability': 'updateRouteQueryReusability',
      '$route.query.query': '$fetch',
      '$route.query.qf': 'updateRouteQueryQf'
    },

    mounted() {
      this.init();
    },

    methods: {
      // Refetch facet fields, unless this is the reusability facet
      updateRouteQueryReusability() {
        if (this.name !== 'REUSABILITY') {
          this.$fetch();
        }
      },
      // Refetch facet fields, but only if other qf query values have changed
      updateRouteQueryQf(newQf, oldQf) {
        const qfDiff = xor(newQf, oldQf);
        if (qfDiff.length === 0) {
          return;
        }

        const onlyThisFacetChanged = qfDiff.every(qf => qf.startsWith(`${this.name}:`));

        if (!onlyThisFacetChanged) {
          this.$fetch();
        }
      },
      init() {
        if (this.isRadio && Array.isArray(this.selected)) {
          this.preSelected = this.selected[0];
        } else {
          this.preSelected = this.selected;
        }

        this.$store.dispatch('search/setResettableFilter', {
          name: this.name,
          selected: this.preSelected
        });
      },

      hiddenDropdown() {
        this.init();
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables';

  .facet-label {
    font-size: $font-size-extrasmall;
    text-transform: uppercase;
    color: $mediumgrey;
    margin-bottom: 0.25rem;
  }
</style>
