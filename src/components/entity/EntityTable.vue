<template>
  <div>
    <b-row
      v-if="$fetchState.error"
      class="flex-md-row py-4"
    >
      <b-col cols="12">
        <AlertMessage
          :error="$fetchState.error.message"
        />
      </b-col>
    </b-row>
    <b-table
      :fields="fields"
      :items="collections"
      :sort-by.sync="sortBy"
      :busy="$fetchState.pending"
    >
      <template #table-busy>
        <div class="text-center my-2">
          <LoadingSpinner />
          {{ $t('loading') }}
        </div>
      </template>
      <template #cell(prefLabel)="data">
        <SmartLink
          :data-qa="`collection link ${data.item.id}`"
          :destination="entityRoute(data.item.slug)"
        >
          {{ data.item.prefLabel }}
        </SmartLink>
      </template>
    </b-table>
  </div>
</template>

<script>
  import { BTable } from 'bootstrap-vue';
  import LoadingSpinner from '../generic/LoadingSpinner';
  import SmartLink from '../generic/SmartLink';

  export default {
    name: 'EntityTable',
    components: {
      AlertMessage: () => import('@/components/generic/AlertMessage'),
      BTable,
      LoadingSpinner,
      SmartLink
    },
    props: {
      type: {
        type: String,
        required: true
      }
    },
    fetch() {
      return this.$axios.get(
        `/_api/cache/collections/${this.type}`,
        // For organisations, only get English labels (for now).
        { params: { locale: this.type === 'organisations' ? 'en' : this.$i18n.locale } }
      )
        .then(response => {
          this.collections = response.data.map(Object.freeze);
        })
        .catch((e) => {
          // TODO: set fetch state error from message
          console.error({ statusCode: 500, message: e.toString() });
        });
    },
    data() {
      return {
        collections: null,
        sortBy: 'prefLabel',
        fields: [
          {
            key: 'prefLabel',
            sortable: true,
            label: this.$t('pages.collections.table.name')
          }
        ]
      };
    },
    methods: {
      entityRoute(slug) {
        return {
          name: 'collections-type-all',
          params: {
            type: this.type.slice(0, -1),
            pathMatch: slug
          }
        };
      }
    }
  };
</script>
