<template>
  <div class="person-table">
    <!-- TODO: move up to page level? -->
    <div class="d-flex flex-wrap align-items-bottom">
      <SearchDropdown
        v-for="filter in filters"
        :key="filter.name"
        :name="filter.name"
        :type="filter.type"
        :fields="filter.fields"
        :fields-fetched="filter.fieldsFetched"
        :placeholder="filter.placeholder"
        :search="true"
        class="search-dropdown d-inline-flex flex-column justify-content-end mb-2 mr-sm-3"
        @showDropdown="$emit('showDropdown', filter.name)"
      />
    </div>
    <table
      v-if="people.length"
      :id="tableId"
      class="table table-striped borderless"
    >
      <thead>
        <tr>
          <th
            v-for="(field, index) in fields"
            :key="index"
            scope="col"
            :class="field.class"
          >
            {{ field.label }}
          </th>
        </tr>
      </thead>
      <TransitionGroup
        appear
        name="fade"
        tag="tbody"
      >
        <template v-for="(person, index) in people">
          <tr
            :key="`row-${nameNoSpaces(person.name)}`"
            :class="{ 'details-open': person.showDetails }"
            :aria-owns="person.showDetails ? `table-details-${index}` : null"
            :aria-details="person.showDetails ? `table-details-${index}` : null"
          >
            <td
              v-for="(field, fieldIndex) in fields"
              :key="fieldIndex"
              :class="field.class"
            >
              <template v-if="field.key === 'name'">
                {{ person.name }}
              </template>
              <template v-if="field.key === 'country'">
                {{ person.country || "—" }}
              </template>
              <div v-if="field.key === 'communities'">
                {{ person.communities?.join(", ") || "—" }}
              </div>
              <template v-if="field.key === 'contact'">
                <PersonContactLinks
                  v-if="person.email || person.website"
                  class="d-flex flex-column"
                  :email="person.email"
                  :website="person.website"
                />
                <span v-else>—</span>
              </template>
              <template v-if="field.key === 'showDetails'">
                <button
                  class="btn btn-light-flat button-icon-only"
                  @click="toggleDetails(person)"
                >
                  <span class="visually-hidden">
                    {{ $t('pages.enaMembers.table.showMoreData', {person: person.name}) }}
                  </span>
                  <span class="icon-chevron" />
                </button>
              </template>
            </td>
          </tr>
          <!-- Hidden tr to fix striped table -->
          <tr
            v-if="person.showDetails"
            :key="`row-details-hidden-${index}`"
            tabindex="-1"
            aria-hidden="true"
            class="d-none"
          />
          <Transition
            v-if="person.showDetails"
            :key="`row-details-${index}`"
            appear
            name="fade"
          >
            <tr
              :id="`table-details-${index}`"
              class="table-details d-lg-none"
            >
              <td
                colspan="4"
                class="pt-0"
              >
                <div
                  v-if="person.communities"
                  class="mb-3"
                >
                  {{ person.communities?.join(", ") }}
                </div>
                <PersonContactLinks
                  v-if="person.email || person.linkedInUrl"
                  class="d-flex flex-column"
                  :email="person.email"
                  :website="person.linkedInUrl"
                />
                <template v-if="!person.email && !person.website && !person.communities">
                  —
                </template>
              </td>
            </tr>
          </Transition>
        </template>
      </TransitionGroup>
    </table>
    <PaginationNavInput
      v-if="perPage"
      :total-results="totalResults"
      :per-page="perPage"
      :aria-controls="tableId"
    />
  </div>
</template>

<script>
  import PersonContactLinks from '@/components/person/PersonContactLinks';
  import SearchDropdown from '@/components/search/SearchDropdown';
  import PaginationNavInput from '@/components/generic/PaginationNavInput';

  export default {
    name: 'PersonTable',

    components: {
      PersonContactLinks,
      SearchDropdown,
      PaginationNavInput
    },

    props: {
      /**
       * Items (persons) to render in the table
       */
      items: {
        type: Array,
        default: () => []
      },
      /**
       * Countries to list in the search filter dropdown
       */
      countries: {
        type: Array,
        default: () => []
      },
      /**
       * Country and communities options are fetched
       */
      optionsFetched: {
        type: Object,
        default: () => ({ country: false, communities: false })
      },
      /**
       * Communities to list in the search filter dropdown
       */
      communities: {
        type: Array,
        default: () => []
      },
      /**
       * Number of items per page
       */
      perPage: {
        type: Number,
        default: 20
      },
      /**
       * id to differentiate multiple tables
       */
      tableId: {
        type: String,
        default: 'person-table'
      },
      /**
       * Total number of results
       */
      totalResults: {
        type: Number,
        default: 0
      }
    },

    data() {
      return {
        fields: [
          {
            key: 'name',
            label: this.$t('pages.enaMembers.table.name'),
            class: 'table-name-cell'
          },
          {
            key: 'country',
            label: this.$t('pages.enaMembers.table.country'),
            class: 'table-country-cell'
          },
          {
            key: 'communities',
            label: this.$t('pages.enaMembers.table.communities'),
            class: 'table-communities-cell d-none d-lg-table-cell'
          },
          {
            key: 'contact',
            label: this.$t('pages.enaMembers.table.contact'),
            class: 'table-contact-cell d-none d-lg-table-cell'
          },
          {
            key: 'showDetails',
            class: 'table-toggle-cell d-lg-none'
          }
        ],
        people: this.addShowDetailsPropToPeopleItems()
      };
    },

    computed: {
      filters() {
        return {
          ...this.countries && { country: {
            name: 'country',
            type: 'radio',
            fields: this.countries,
            placeholder: this.$t('pages.enaMembers.table.allCountries'),
            fieldsFetched: this.optionsFetched.country
          } },
          ...this.communities && { communities: {
            name: 'communities',
            type: 'checkbox',
            fields: this.communities,
            placeholder: this.$t('pages.enaMembers.table.allCommunities'),
            fieldsFetched: this.optionsFetched.communities
          } }
        };
      }
    },

    watch: {
      items() {
        this.people = this.addShowDetailsPropToPeopleItems();
      }
    },

    methods: {
      toggleDetails(person) {
        person.showDetails = !person.showDetails;
      },
      filterIsSetTo(name, value) {
        return this.selectedFilters[name].includes(value);
      },
      addShowDetailsPropToPeopleItems() {
        return [...this.items].map((p) => ({ ...p, showDetails: false }));
      },
      nameNoSpaces(name) {
        return name.replace(/\s/g, '-').toLowerCase();
      }
    }
  };
</script>

<style lang="scss" scoped>
@import '@europeana/style/scss/variables';
@import '@europeana/style/scss/icon-font';
@import '@europeana/style/scss/table';
@import '@europeana/style/scss/transitions';

.person-table {
  --bp-4k-increment: 1.5;

  .table {

    @media (min-width: $bp-4k) {
      font-size: calc(var(--bp-4k-increment) * $font-size-small);
    }

    thead th {
      @media (min-width: $bp-4k) {
        padding: calc(var(--bp-4k-increment) * 1.125rem) calc(var(--bp-4k-increment) * 1rem);
      }
    }

    td {
      font-size: $font-size-base;

      @media (min-width: $bp-4k) {
        font-size: calc(var(--bp-4k-increment) * $font-size-base);
        padding: calc(var(--bp-4k-increment) * 1.125rem) calc(var(--bp-4k-increment) * 1rem);
      }
    }
  }

  .table > tbody > tr.table-details > td {
    border-top: none;
  }
  .table-name-cell {
    font-weight: 600;
    word-wrap: anywhere;
  }

  .table-toggle-cell {
    width: 3.5rem;

    @media (min-width: $bp-4k) {
      width: calc(var(--bp-4k-increment) * 3.5rem);
    }

    .icon-chevron:before {
      font-size: 0.5rem;
      display: inline-block;

      @media (min-width: $bp-4k) {
        font-size: calc(var(--bp-4k-increment) * 0.5rem);
      }
    }
  }

  .details-open .table-toggle-cell .icon-chevron:before {
    transform: rotateX(180deg);
  }

  ::v-deep .email-link {
    margin-bottom: 0.25rem;
    word-wrap: anywhere;

    @media (min-width: $bp-4k) {
      margin-bottom: calc(var(--bp-4k-increment) * 0.25rem);
    }

    .icon-email {
      color: $darkgrey;
    }
  }

  ::v-deep .linkedin-link {
    color: #0A66C2;
  }

  ::v-deep .email-link,
  ::v-deep .linkedin-link {
    font-size: $font-size-small;
    font-weight: 600;
    display: flex;

    @media (min-width: $bp-4k) {
      font-size: calc(var(--bp-4k-increment) * $font-size-small);
    }

    .icon-email,
    .icon-linkedin-circle {
      font-size: 1.125rem;
      line-height: 1.3125rem;

      @media (min-width: $bp-4k) {
        font-size: calc(var(--bp-4k-increment) * 1.125rem);
        line-height: calc(var(--bp-4k-increment) * 1.3125rem);
      }
    }
  }

  .search-dropdown {
    @media (max-width: ($bp-small - 1px)) {
      flex-basis: 100%;
    }
  }
}
</style>

<docs lang="md">
```jsx
<PersonTable
  :items="people"
/>
```
With pagination
```jsx
<PersonTable
  :items="people"
  :per-page="4"
  :total-results="5"
/>
```
With filters
```jsx
<PersonTable
  :items="people"
  :countries="['France', 'Mexico']"
  :communities="['Research', 'Education']"
/>
```
</docs>
