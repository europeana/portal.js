<template>
  <h2
    class="context-label"
    data-qa="context label"
  >
    <span
      v-if="!hasQuery && hasEntity"
    >
      {{ entityTypeLabel }}
    </span>
    <i18n
      v-else-if="hasQuery && hasEntity"
      path="resultsWithin"
      tag="span"
    >
      <RemovalChip
        :title="localisedEntityLabel"
        :linkTo="entityRemovalLink"
        :img="entityImage"
      />
      <RemovalChip
        :title="query"
        :linkTo="queryRemovalLink"
      />
    </i18n>
    <i18n
      v-else-if="!hasEntity && hasQuery"
      path="resultsFor"
      tag="span"
    >
      <RemovalChip
        :title="query"
        :linkTo="queryRemovalLink"
      />
    </i18n>
    <span v-else>
      {{ $t('results') }}
    </span>
  </h2>
</template>

<script>
  import RemovalChip from './RemovalChip';
  import { getEntityTypeHumanReadable, getWikimediaThumbnailUrl } from '@/plugins/europeana/entity';
  import { langMapValueForLocale } from  '@/plugins/europeana/utils';

  export default {
    name: 'ContextLabel',

    components: {
      RemovalChip
    },

    props: {
      /**
       * Applied query
       *
       * String, the active query term.
       *
       * @type {String}
       */
      query: {
        type: String,
        default: null
      },

      /**
       * Active entity
       *
       * Current entity which is being searched. Used for labeling and remvoal link.
       */
      entity: {
        type: Object,
        default: null
      }
    },
    computed: {
      hasQuery() {
        return this.query && this.query !== '';
      },
      hasEntity() {
        return this.entity && this.entity.id;
      },
      localisedEntityLabel() {
        // TODO: needs to handle fallbacks & editorialTitle overrides
        return this.entity?.entity?.prefLabel;
      },
      entityImage() {
        const entityData =  this.entity?.entity;
        return entityData?.isShownBy?.thumbnail || entityData?.logo ? getWikimediaThumbnailUrl(entityData?.logo.id, 80) : null;
      },
      entityTypeLabel() {
        return this.$t(`cardLabels.${this.$route.params.type}`);
      },
      queryRemovalLink() {
        const currentPath =   this.$route.path;
        const currentParams = this.$route.params;
        return this.$path({
          currentPath,
          params: currentParams,
          query: {
            ...this.$route.query,
            query: ''
          }
        });
      },
      entityRemovalLink() {
        const currentQuery = this.$route.query;

        return this.$path({
          name: 'search', query: {
            // TODO: Needs to account for collection specific facets that may need to be removed.
            ...currentQuery
          }
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .filter-badges {
    display: flex;
    flex-wrap: wrap;
  }

  .filter-badge {
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .context-label {
      margin-bottom: 0;
  }
</style>
