<template>
  <div class="person-table">
    <table
      v-if="people.length"
      class="table table-striped"
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
      <tbody>
        <template
          v-for="(person, index) in people"
        >
          <tr :key="`row-${index}`">
            <td
              v-for="(field, fieldIndex) in fields"
              :key="fieldIndex"
              :class="field.class"
            >
              <template v-if="field.key === 'name'">
                {{ person.name }}
              </template>
              <template v-if="field.key === 'country'">
                {{ person.country || '—' }}
              </template>
              <template v-if="field.key === 'community'">
                {{ person.community?.join(", ") || '—' }}
              </template>
              <template v-if="field.key === 'contact'">
                <PersonContactLinks
                  v-if="person.email || person.website"
                  class=" d-flex flex-column"
                  :email="person.email"
                  :website="person.website"
                />
                <span v-else>—</span>
              </template>
              <template v-if="field.key === 'showDetails'">
                <button
                  class="btn btn-light-flat"
                  @click="toggleDetails(person)"
                >
                  <span class="icon-chevron" />
                </button>
              </template>
            </td>
          </tr>
          <Transition
            v-if="person.showDetails"
            :key="`row-details-${index}`"
            appear
            name="fade"
          >
            <tr
              tabindex="-1"
              class="table-details"
            >
              <td
                colspan="4"
              >
                {{ person.community?.join(", ") || '—' }}
                <PersonContactLinks
                  v-if="person.email || person.website"
                  class=" d-flex flex-column"
                  :email="person.email"
                  :website="person.website"
                />
              </td>
            </tr>
          </Transition>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script>
  import PersonContactLinks from '@/components/person/PersonContactLinks.vue';

  export default {
    name: 'PersonTable',

    components: {

      PersonContactLinks
    },

    props: {
      items: {
        type: Array,
        default: () => []
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
            key: 'community',
            label: this.$t('pages.enaMembers.table.community'),
            class: 'table-community-cell d-none d-lg-table-cell'
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
        people: [...this.items].map(p => ({ ...p, showDetails: false }))
      };
    },

    methods: {
      toggleDetails(person) {
        person.showDetails = !person.showDetails;
      }
    }
  };
</script>

<style lang="scss" scoped>
@import "@europeana/style/scss/variables";
@import "@europeana/style/scss/icon-font";
@import "@europeana/style/scss/table";
@import '@europeana/style/scss/transitions';
</style>

<docs lang="md">
  ```jsx
  <PersonTable
    :items="people"
  />
  ```
</docs>
