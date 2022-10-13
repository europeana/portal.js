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
      striped
      class="borderless"
    >
      <template #table-busy>
        <div class="text-center my-2">
          <LoadingSpinner />
          {{ $t('loading') }}
        </div>
      </template>
      <template #cell(prefLabel)="data">
        <SmartLink
          :destination="entityRoute(data.item.slug)"
        >
          <template v-if="type === 'organisations'">
            <strong :lang="data.item.prefLabelLang">{{ data.item.prefLabel }}</strong>
            <span
              v-if="data.item.altLabel"
              :lang="data.item.altLabelLang"
            >
              {{ data.item.altLabel }}
            </span>
          </template>
          <span
            v-else
          >
            {{ data.item.prefLabel }}
          </span>
        </SmartLink>
      </template>
      <template
        v-if="type === 'organisations'"
        #cell(recordCount)="data"
      >
        <span>
          {{ data.item.recordCount | localise }}
        </span>
      </template>
    </b-table>
  </div>
</template>

<script>
  import { BTable } from 'bootstrap-vue';
  import LoadingSpinner from '../generic/LoadingSpinner';
  import SmartLink from '../generic/SmartLink';
  import europeanaEntitiesOrganizationsMixin from '@/mixins/europeana/entities/organizations';
  import { langMapValueForLocale } from '@europeana/utils';

  export default {
    name: 'EntityTable',
    components: {
      AlertMessage: () => import('@/components/generic/AlertMessage'),
      BTable,
      LoadingSpinner,
      SmartLink
    },
    mixins: [
      europeanaEntitiesOrganizationsMixin
    ],
    props: {
      type: {
        type: String,
        required: true
      }
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
          },
          this.type === 'organisations' && {
            key: 'recordCount',
            sortable: true,
            sortDirection: 'desc',
            label: this.$t('pages.collections.table.items'),
            class: 'text-right'
          }
        ],
        typeSingular: this.type.slice(0, -1)
      };
    },
    async fetch() {
      try {
        const response = await this.$axios({
          method: 'get',
          baseURL: this.$config.europeana.apis.portal.url,
          url: this.apiEndpoint
        });
        let collections = response.data;
        if (this.type === 'organisations') {
          collections = collections.map(this.organisationData);
        }
        this.collections = collections.map(Object.freeze);
      } catch (e) {
        // TODO: set fetch state error from message
        console.error({ statusCode: 500, message: e.toString() });
      }
    },
    fetchOnServer: false,
    computed: {
      apiEndpoint() {
        // For organisations, get unlocalised labels, for both English and native.
        return this.type === 'organisations' ?
          '/cache/collections/organisations' :
          `/cache/${this.$i18n.locale}/collections/${this.type}`;
      }
    },
    methods: {
      organisationData(org) {
        const nativeName = this.organizationEntityNativeName({ ...org, type: 'Organization' });
        const nativeNameLangMapValue = langMapValueForLocale(nativeName, this.$i18n.locale);
        const englishName = this.organizationEntityNonNativeEnglishName({ ...org, type: 'Organization' });
        const englishNameLangMapValue = englishName && langMapValueForLocale(englishName, this.$i18n.locale);

        return {
          ...org,
          prefLabel: nativeNameLangMapValue.values[0],
          prefLabelLang: nativeNameLangMapValue.code,
          altLabel: englishNameLangMapValue?.values[0],
          altLabelLang: englishNameLangMapValue?.code
        };
      },
      entityRoute(slug) {
        return `/collections/${this.typeSingular}/${slug}`;
      }
    }
  };
</script>
