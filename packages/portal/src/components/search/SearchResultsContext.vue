<template>
  <div class="overflow-hidden">
    <i18n
      :path="i18nPath"
      tag="h1"
      class="context-label"
      data-qa="context label"
    >
      <template #count>
        {{ totalResultsLocalised }}
      </template>
      <template
        v-if="hasEntity"
        #type
      >
        {{ entityTypeLabel }}
      </template>
      <template
        v-if="hasEntity"
        #collection
      >
        <RemovalChip
          :title="entityLabel"
          :link-to="entityRemovalLink"
          :img="entityImage"
          :type="entity.type"
          data-qa="entity removal badge"
          class="mb-1 mx-1"
          :badge-variant="badgeVariant"
        />
      </template>
      <template
        v-if="hasQuery"
        #query
      >
        <RemovalChip
          :title="query"
          :link-to="queryRemovalLink"
          data-qa="query removal badge"
          class="mb-1 mx-1"
          :badge-variant="badgeVariant"
        />
      </template>
    </i18n>
    <div
      class="visually-hidden"
      role="status"
      data-qa="results status message"
    >
      {{ $t('searchHasLoaded', [totalResultsLocalised]) }}
    </div>
  </div>
</template>

<script>
  import RemovalChip from './RemovalChip';
  import { entityParamsFromUri } from '@/plugins/europeana/entity';
  import europeanaEntitiesOrganizationsMixin from '@/mixins/europeana/entities/organizations';

  export default {
    name: 'SearchResultsContext',

    components: {
      RemovalChip
    },

    mixins: [
      europeanaEntitiesOrganizationsMixin
    ],

    props: {
      /**
       * Total number of results from the current search.
       */
      totalResults: {
        type: Number,
        default: null
      },

      /**
       * The search term(s).
       */
      query: {
        type: String,
        default: null
      },

      /**
       * The entity theme/collection within which the search has been made.
       */
      entity: {
        type: Object,
        default: null
      },

      /**
       * The variant used for the removal badges.
       */
      badgeVariant: {
        type: String,
        default: 'light'
      }
    },

    computed: {
      advancedSearchEnabled() {
        return this.$features.advancedSearch;
      },

      i18nPath() {
        if (this.hasEntity && this.hasQuery) {
          return 'search.results.withinCollectionWithQuery';
        } else if (this.hasEntity) {
          return 'search.results.withinCollection';
        } else if (this.hasQuery) {
          return 'search.results.withQuery';
        } else {
          return 'search.results.withoutQuery';
        }
      },
      totalResultsLocalised() {
        return this.$options.filters.localise(this.totalResults);
      },
      hasQuery() {
        return this.query && this.query !== '';
      },
      hasEntity() {
        return this.entity?.id;
      },
      entityLabel() {
        return this.organizationEntityNativeName(this.entity) ||
          this.entity?.prefLabel;
      },
      entityImage() {
        return this.$apis.entity.imageUrl(this.entity);
      },
      entityTypeLabel() {
        return this.$t(`cardLabels.${this.entityType}`);
      },
      entityParams() {
        return this.hasEntity ? entityParamsFromUri(this.entity.id) : {};
      },
      entityType() {
        return this.entityParams.type;
      },
      entityId() {
        return this.entityParams.id;
      },
      queryRemovalLink() {
        return this.localePath({
          currentPath: this.$route.path,
          params: this.$route.params,
          query: {
            ...this.activeCriteria,
            query: null
          }
        });
      },
      entityRemovalLink() {
        if (this.advancedSearchEnabled) {
          return this.localePath({
            name: 'search', query: {
              ...this.activeCriteria
            }
          });
        } else {
          return this.localePath({
            name: 'search', query: {
              query: this.$route.query?.query
            }
          });
        }
      },
      activeCriteria() {
        return {
          api: this.$route?.query?.api,
          boost: this.$route?.query?.boost,
          qa: this.$route?.query?.qa,
          qf: this.$route?.query?.qf,
          query: this.$route.query?.query,
          reusability: this.$route?.query?.reusability,
          view: this.$route?.query?.view
        };
      }
    }
  };
</script>

<style lang="scss" scoped>
@import '@europeana/style/scss/variables';

.context-label {
  margin-bottom: 0;
  line-height: 3;
  min-width: 0;
  font-size: $font-size-small;

  @at-root .xxl-page & {
    @media (min-width: $bp-4k) {
      font-size: $font-size-small-4k;
    }
  }

  .badge {
    max-width: calc(100% - 2rem);
    text-transform: none;
  }
}

.mx-1 {
  @media (min-width: $bp-4k) {
    margin-left: 0.75rem !important;
    margin-right: 0.75rem !important;
  }
}
</style>
