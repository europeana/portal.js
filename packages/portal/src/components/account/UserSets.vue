<template>
  <b-container>
    <slot name="header" />
    <b-row class="flex-md-row">
      <b-col cols="12">
        <div
          v-if="$fetchState.pending"
          class="text-center pb-4"
        >
          <LoadingSpinner />
        </div>
        <AlertMessage
          v-else-if="$fetchState.error"
          :error="$fetchState.error.message"
        />
        <template
          v-else
        >
          <div
            v-if="emptyText && sets && sets.length === 0"
            class="text-center pb-4"
          >
            {{ emptyText }}
          </div>
          <b-card-group
            class="card-deck-4-cols pb-5"
            deck
          >
            <ContentCard
              v-for="(set, index) in sets"
              :key="set.id"
              :sub-title="setSubTitle(set)"
              :title="set.title"
              :image-url="creationPreviewUrl(set)"
              :media-type="creationPreviewType(set)"
              :texts="[set.description]"
              :url="creationLinkUrl(set)"
              :offset="index"
              data-qa="user set"
            />
            <CreateSetButton
              v-if="showCreateSetButton"
              :visibility="visibility"
              @created="handleSetCreated"
            />
          </b-card-group>
          <PaginationNavInput
            :total-results="total"
            :per-page="perPage"
          />
        </template>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import AlertMessage from '../generic/AlertMessage';
  import LoadingSpinner from '../generic/LoadingSpinner';
  import ContentCard from '../generic/ContentCard';
  import PaginationNavInput from '../generic/PaginationNavInput';
  import { getLabelledSlug } from '@/plugins/europeana/utils';

  export default {
    name: 'UserSets',
    components: {
      ContentCard,
      CreateSetButton: () => import('./CreateSetButton'),
      AlertMessage,
      LoadingSpinner,
      PaginationNavInput
    },
    props: {
      showCreateSetButton: {
        type: Boolean,
        default: true
      },
      // May be "published", "public" or "private"
      visibility: {
        type: String,
        required: true
      },
      emptyText: {
        type: String,
        default: null
      }
    },
    data() {
      return {
        perPage: this.showCreateSetButton ? 19 : 20,
        sets: [],
        total: 0
      };
    },
    async fetch() {
      const searchParams = {
        query: `creator:${this.$auth.user.sub}`,
        profile: 'standard',
        pageSize: this.perPage,
        page: this.page - 1,
        qf: [
          'type:Collection',
          `visibility:${this.visibility}`
        ]
      };

      const searchResponse = await this.$apis.set.search(searchParams, { withMinimalItemPreviews: true });
      this.sets = searchResponse.data.items || [];
      this.total = searchResponse.data.partOf?.total || 0;
    },
    computed: {
      page() {
        return Number(this.$route.query.page) || 1;
      }
    },
    watch: {
      visibility: '$fetch',
      page: '$fetch'
    },
    methods: {
      creationLinkUrl(set) {
        const name = this.$features.setGalleries ? 'galleries-all' : 'set-all';
        return { name, params: { pathMatch: this.setPathMatch(set) } };
      },
      creationPreviewUrl(set) {
        return this.$apis.thumbnail.edmPreview(set.items?.[0]?.edmPreview?.[0]);
      },
      creationPreviewType(set) {
        return set.items?.[0]?.type;
      },
      setSubTitle(set) {
        const setTotal = set.total || 0;
        return this.$tc('items.itemCount', setTotal, { count: setTotal });
      },
      setPathMatch(set) {
        const id = set.id.replace('http://data.europeana.eu/set/', '');
        return this.$features.setGalleries ? getLabelledSlug(id, set.title.en) : id;
      },
      handleSetCreated() {
        const fetch = (this.page === 1);
        this.$goto({
          path: this.$route.path,
          query: { ...this.$route.query, page: 1 },
          hash: this.$route.hash
        });
        if (fetch) {
          this.$fetch();
        }
      }
    }
  };
</script>
