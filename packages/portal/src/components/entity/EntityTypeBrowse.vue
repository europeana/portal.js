<template>
  <div
    :data-qa="`${typeSingular} entity type browse`"
  >
    <b-row class="flex-md-row pb-5">
      <b-col cols="12">
        <EntityCardGroup
          :entities="entities"
          card-variant="mini"
        />
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <PaginationNavInput
          :total-results="total"
          :per-page="perPage"
        />
      </b-col>
    </b-row>
  </div>
</template>

<script>
  import { getEntityTypeApi } from '@/plugins/europeana/entity';
  import useScrollTo from '@/composables/scrollTo.js';

  import EntityCardGroup from './EntityCardGroup';
  import PaginationNavInput from '@/components/generic/PaginationNavInput';

  export default {
    name: 'EntityTypeBrowse',

    components: {
      EntityCardGroup,
      PaginationNavInput
    },

    props: {
      type: {
        type: String,
        required: true
      }
    },

    setup() {
      const { scrollToSelector } = useScrollTo();
      return { scrollToSelector };
    },

    data() {
      return {
        entities: [],
        total: 0,
        perPage: 24,
        typeSingular: this.type.slice(0, -1)
      };
    },

    async fetch() {
      const entityIndexParams = {
        query: '*:*',
        page: this.page,
        type: this.entityTypeApi,
        pageSize: this.perPage,
        scope: 'europeana',
        sort: `skos_prefLabel.${this.$i18n.locale}`,
        qf: `skos_prefLabel.${this.$i18n.locale}:*`,
        fl: 'skos_prefLabel.*,isShownBy,isShownBy.thumbnail'
      };

      try {
        const response = await this.$apis.entity.search(entityIndexParams);

        this.entities = response.entities;
        this.total = response.total;
      } finally {
        process.client && this.scrollToSelector('#header');
      }
    },

    computed: {
      entityTypeApi() {
        return getEntityTypeApi(this.typeSingular);
      },
      page() {
        return Number(this.$route.query.page || 1);
      }
    },

    watch: {
      async '$route.query.page'() {
        await this.$fetch();
        // FIXME: scroll to is not working after pagination
        this.scrollToSelector('#header');
      }
    }
  };
</script>
