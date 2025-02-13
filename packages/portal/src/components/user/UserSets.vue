<template>
  <b-container>
    <b-row class="flex-md-row">
      <b-col cols="12">
        <LoadingSpinner
          v-if="$fetchState.pending"
          class="text-center pb-4"
        />
        <AlertMessage
          v-else-if="$fetchState.error"
          :error="$fetchState.error.message"
        />
        <template
          v-else
        >
          <b-row
            v-if="total > 0"
          >
            <b-col>
              <span class="d-flex align-items-center mb-3">
                <h2
                  class="related-heading text-uppercase mb-0"
                >
                  {{ $tc('set.setCount', total) }}
                </h2>
                <b-button
                  v-if="tooltipTitle"
                  v-b-tooltip.bottom
                  :title="tooltipTitle"
                  class="icon-info-outline tooltip-button"
                  variant="light-flat"
                />
              </span>
            </b-col>
          </b-row>
          <div
            v-if="emptyText && sets && sets.length === 0"
            class="text-center pb-4"
          >
            <span class="d-inline-flex align-items-center">
              {{ emptyText }}
              <b-button
                v-if="tooltipTitle"
                v-b-tooltip.bottom
                :title="tooltipTitle"
                class="icon-info-outline tooltip-button"
                variant="light-flat"
              />
            </span>
          </div>
          <!-- TODO: Use SetCardGroup and clean up methods -->
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
            <UserCreateSetButton
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
  import ContentCard from '../content/ContentCard';
  import PaginationNavInput from '../generic/PaginationNavInput';
  import { getLabelledSlug } from '@/plugins/europeana/utils.js';

  export default {
    name: 'UserSets',
    components: {
      ContentCard,
      UserCreateSetButton: () => import('./UserCreateSetButton'),
      AlertMessage,
      LoadingSpinner,
      PaginationNavInput
    },
    props: {
      showCreateSetButton: {
        type: Boolean,
        default: true
      },
      type: {
        type: String,
        default: 'Collection'
      },
      // May be "published", "public" or "private"
      visibility: {
        type: String,
        default: null
      },
      emptyText: {
        type: String,
        default: null
      }
    },
    data() {
      return {
        sets: [],
        total: 0
      };
    },
    async fetch() {
      const qf = [`type:${this.type}`];
      if (this.visibility) {
        qf.push(`visibility:${this.visibility}`);
      }

      const searchParams = {
        query: `${this.userField}:${this.userId}`,
        profile: 'standard',
        pageSize: this.perPage,
        page: this.page,
        qf
      };

      const searchResponse = await this.$apis.set.search(searchParams, { withMinimalItemPreviews: true });
      this.sets = searchResponse.items || [];
      this.total = searchResponse.partOf?.total || 0;
    },
    computed: {
      userId() {
        return this.$auth.user?.sub;
      },
      userField() {
        return this.type === 'EntityBestItemsSet' ? 'contributor' : 'creator';
      },
      perPage() {
        return this.showCreateSetButton ? 19 : 20;
      },
      page() {
        return Number(this.$route.query.page) || 1;
      },
      tooltipTitle() {
        if (this.type === 'EntityBestItemsSet') {
          return this.$t(`account.tooltip.${this.type}`);
        } else if (this.visibility) {
          return this.$t(`account.tooltip.${this.visibility}`);
        } else {
          return null;
        }
      }
    },
    watch: {
      page: '$fetch',
      type: '$fetch',
      visibility: '$fetch'
    },
    methods: {
      creationLinkUrl(set) {
        return { name: 'galleries-all', params: { pathMatch: this.setPathMatch(set) } };
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
        return getLabelledSlug(id, set.title.en);
      },
      // When a new set is created, it will be on page 1, so go back to page 1.
      // If already on page 1, explicitly trigger `fetch`, otherwise the watcher
      // for changes to page will trigger it.
      handleSetCreated() {
        if (this.page === 1) {
          this.$fetch();
        } else {
          this.$router.push({
            path: this.$route.path,
            query: { ...this.$route.query, page: 1 },
            hash: this.$route.hash
          });
        }
      }
    }
  };
</script>
