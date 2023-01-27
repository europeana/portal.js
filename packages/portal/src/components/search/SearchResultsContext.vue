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
       * Editorial overrides
       *
       * Title/label and image override. Used for editorial collection titles and images from Contentful.
       */
      editorialOverrides: {
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
        return this.editorialOverrides?.title ||
          this.organizationEntityNativeName(this.entity) ||
          this.entity?.prefLabel;
      },
      entityImage() {
        if (this.editorialOverrides?.image && this.$contentful.assets.isValidUrl(this.editorialOverrides.image.url)) {
          return this.$contentful.assets.optimisedSrc(
            this.editorialOverrides.image,
            { w: 28, h: 28, fit: 'thumb' }
          );
        }
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
        return this.$path({
          currentPath: this.$route.path,
          params: this.$route.params,
          query: {
            ...this.$route.query,
            query: null
          }
        });
      },
      entityRemovalLink() {
        return this.$path({
          name: 'search', query: {
            query: this.$route.query?.query
          }
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .context-label {
    margin-bottom: 0;
    line-height: 3;
    min-width: 0;

    .badge {
      max-width: calc(100% - 2rem);
      text-transform: none;
    }
  }
</style>
