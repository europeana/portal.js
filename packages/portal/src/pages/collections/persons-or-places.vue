<template>
  <b-container class="page">
    <ContentHeader
      :title="pageMeta.title"
    />
    <b-row class="flex-md-row pb-5">
      <b-col cols="12">
        <b-card-group
          class="card-deck-4-cols"
          deck
          :data-qa="`${entityTypeHumanReadable} listing page`"
        >
          <ContentCard
            v-for="entity in entities"
            :key="entity.id"
            :title="entity.prefLabel"
            :url="entityRoute(entity)"
            :image-url="thumbnail(entity)"
            variant="mini"
          />
        </b-card-group>
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
  </b-container>
</template>

<script>
  import { getEntityTypeApi, getEntityTypeHumanReadable } from '@/plugins/europeana/entity';
  import { getLabelledSlug } from '@/plugins/europeana/utils.js';
  import pageMetaMixin from '@/mixins/pageMeta';
  import useScrollTo from '@/composables/scrollTo.js';

  import ContentHeader from '@/components/content/ContentHeader';
  import ContentCard from '@/components/content/ContentCard';
  import PaginationNavInput from '@/components/generic/PaginationNavInput';

  export default {
    name: 'CollectionsPersonsOrPlacesIndexPage',

    components: {
      ContentHeader,
      ContentCard,
      PaginationNavInput
    },

    mixins: [pageMetaMixin],

    middleware: 'sanitisePageQuery',

    setup() {
      const { scrollToSelector } = useScrollTo();
      return { scrollToSelector };
    },

    data() {
      return {
        entities: [],
        total: 0,
        perPage: 24
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
      pageMeta() {
        return {
          title: this.$t(`pages.collections.${this.personsOrPlaces}.title`)
        };
      },
      personsOrPlaces() {
        return this.$route.path.split('/').pop();
      },
      entityTypeHumanReadable() {
        return this.personsOrPlaces.slice(0, -1);
      },
      entityTypeApi() {
        return getEntityTypeApi(this.entityTypeHumanReadable);
      },
      page() {
        return this.$store.state.sanitised.page;
      }
    },

    watch: {
      async '$route.query.page'() {
        await this.$fetch();
        this.scrollToSelector('#header');
      }
    },

    methods: {
      entityRoute(entity) {
        return {
          name: 'collections-type-all',
          params: {
            type: getEntityTypeHumanReadable(entity.type),
            pathMatch: getLabelledSlug(entity.id, entity.prefLabel.en)
          }
        };
      },
      thumbnail(entity) {
        return this.$apis.entity.imageUrl(entity);
      }
    }
  };
</script>
