<template>
  <section>
    <b-container
      class="pb-3"
      data-qa="item preview interface"
    >
      <b-row>
        <b-col class="d-flex align-items-center mb-3">
          <slot name="heading">
            <h2
              class="related-heading text-uppercase mb-0"
              data-qa="item count"
            >
              {{ displayItemCount }}
            </h2>
          </slot>
          <ItemSelectButton
            v-if="$features.itemMultiSelect"
            class="ml-auto"
            @select="(newState) => itemMultiSelect = newState"
          />
          <SearchViewToggles
            v-model="view"
            :class="$features.itemMultiSelect ? 'ml-2' : 'ml-auto'"
          />
        </b-col>
      </b-row>
      <b-row class="mb-3">
        <b-col cols="12">
          <LoadingSpinner
            v-show="loading"
            class="flex-md-row py-4 text-center"
            :status-message="$t('loadingResults')"
          />
          <template
            v-if="!loading"
          >
            <slot
              v-if="noMoreItems"
              name="no-more-items"
            >
              <p>{{ $t('items.noMoreItems') }}</p>
            </slot>
            <slot
              v-else-if="items.length === 0"
              name="no-items"
            >
              <p>{{ $t('items.noItems') }}</p>
            </slot>
            <ItemPreviewCardGroup
              v-else
              id="item-preview-interface-card-group"
              :hits="hits"
              :items="items"
              :on-aux-click-card="onAuxClickCard"
              :on-click-card="onClickCard"
              :show-pins="showPins"
              :user-editable-items="userEditableItems"
              :view="view"
              @drawn="$emit('drawn', $event)"
              @endItemDrag="$emit('endItemDrag', $event)"
            >
              <template #header>
                <slot name="card-group-header" />
              </template>
              <template #related-galleries>
                <slot name="card-group-related-galleries" />
              </template>
              <template #related-collections>
                <slot name="card-group-related-collections" />
              </template>
            </ItemPreviewCardGroup>
          </template>
        </b-col>
      </b-row>
      <slot name="footer" />
      <PaginationNavInput
        :max-results="maxResults"
        :per-page="perPage"
        :total-results="total"
        aria-controls="item-preview-interface-card-group"
        data-qa="item previews pagination"
      />
    </b-container>
    <ItemSelectToolbar
      v-if="itemMultiSelect"
      :user-can-edit-set="userEditableItems"
    />
  </section>
</template>

<script>
  import { computed } from 'vue';

  import ItemPreviewCardGroup from '@/components/item/ItemPreviewCardGroup';
  import ItemSelectButton from '@/components/item/ItemSelectButton';
  import ItemSelectToolbar from '@/components/item/ItemSelectToolbar';
  import LoadingSpinner from '@/components/generic/LoadingSpinner';
  import PaginationNavInput from '@/components/generic/PaginationNavInput';
  import SearchViewToggles from '@/components/search/SearchViewToggles';

  export default {
    name: 'ItemPreviewInterface',

    components: {
      ItemPreviewCardGroup,
      ItemSelectButton,
      ItemSelectToolbar,
      LoadingSpinner,
      PaginationNavInput,
      SearchViewToggles
    },

    provide() {
      return {
        itemMultiSelect: computed(() => this.$features.itemMultiSelect && this.itemMultiSelect)
      };
    },

    props: {
      items: {
        type: Array,
        default: () => []
      },

      hits: {
        type: Array,
        default: null
      },

      loading: {
        type: Boolean,
        default: false
      },

      maxResults: {
        type: Number,
        default: undefined
      },

      onClickCard: {
        type: Function,
        default: null
      },

      onAuxClickCard: {
        type: Function,
        default: null
      },

      perPage: {
        type: Number,
        default: 24
      },

      showPins: {
        type: Boolean,
        default: false
      },

      total: {
        type: Number,
        default: 0
      },

      userEditableItems: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        itemMultiSelect: false
      };
    },

    computed: {
      displayItemCount() {
        let label = 'items.itemCount';
        if (this.maxResults && (this.total > this.maxResults)) {
          label = 'items.itemOf';
        }
        return this.$tc(label, this.total, { count: this.$n(this.total), max: this.$n(this.maxResults) });
      },

      noMoreItems() {
        return (this.total > 0) && (this.items.length === 0);
      },

      routeQueryView() {
        return this.$route.query.view;
      },

      view: {
        get() {
          return this.$store.getters['search/activeView'];
        },
        set(value) {
          this.$store.commit('search/setView', value);
        }
      }
    },

    watch: {
      routeQueryView: 'setViewFromRouteQuery'
    },

    created() {
      this.setViewFromRouteQuery();
    },

    methods: {
      setViewFromRouteQuery() {
        if (this.routeQueryView) {
          this.view = this.routeQueryView;
          this.$cookies?.set('searchResultsView', this.routeQueryView);
        }
      }
    }
  };
</script>
