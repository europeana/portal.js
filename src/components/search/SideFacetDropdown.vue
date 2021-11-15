<template>
  <div>
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
      @show="showDropdown"
    >
      <template v-slot:button-content>
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

      <li
        class="dropdown-buttons mt-3"
      >
        <b-button
          variant="primary"
          :disabled="disableApplyButton"
          :data-qa="`${name} apply button`"
          @click.stop="applySelection"
        >
          {{ $t('facets.button.apply') }}
        </b-button>
      </li>
    </b-dropdown>
  </div>
</template>

<script>
  import isEqual from 'lodash/isEqual';

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
      }
    },

    async fetch() {
      // Always fetch the contentTier facet, which the toast advising of the
      // filtering of low-tier items needs
      if (this.shown || (this.name === 'contentTier')) {
        const facets = await this.$store.dispatch('search/queryFacets', { facet: this.name });
        this.fields = (facets || [])[0]?.fields || [];
        this.fetched = true;
      }
    },

    fetchOnServer: false,

    data() {
      return {
        RADIO: 'radio',
        CHECKBOX: 'checkbox',
        preSelected: null,
        shown: false,
        fetched: false,
        fields: [],
        nada: null
      };
    },

    computed: {
      sortedOptions() {
        if (this.isRadio) {
          return this.fields;
        }

        const selected = [];

        this.fields.map(field => {
          if (this.selected.includes(field.label)) {
            selected.push(field);
          }
        });

        const leftOver = this.fields.filter(field => !this.selected.includes(field.label));

        return selected.sort((a, b) => a.count + b.count).concat(leftOver);
      },

      facetName() {
        return this.$tFacetName(this.name);
      },

      isRadio() {
        return this.type === this.RADIO;
      },

      disableApplyButton() {
        if (this.isRadio && Array.isArray(this.selected)) {
          return isEqual(this.preSelected, this.selected[0]);
        }
        return isEqual(this.preSelected, this.selected);
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
      '$route.query.api': 'resetFetched',
      '$route.query.reusability': 'resetFetched',
      '$route.query.query': 'resetFetched',
      // TODO: prevent refetching when qf was changed for this same facet
      '$route.query.qf': 'resetFetched',
      '$route.query.page': 'resetFetched'
    },

    mounted() {
      this.init();
    },

    methods: {
      resetFetched() {
        this.fetched = false;
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

      showDropdown() {
        this.shown = true;
        if (!this.fetched) {
          this.$fetch();
        }
      },

      hiddenDropdown() {
        this.shown = false;
        this.init();
      },

      async applySelection() {
        await this.$emit('changed', this.name, this.preSelected);
        this.$refs.dropdown.hide(true);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables.scss';

  .facet-label {
    font-size: $font-size-extrasmall;
    text-transform: uppercase;
    color: $mediumgrey;
    margin-bottom: 0.25rem;
  }
</style>
