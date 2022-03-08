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
       * Entity for the current collection page.
       *
       * Current entity which is being searched by. Used for labeling and remvoal link.
       */
      entity: {
        type: Object,
        default: null
      },

      /**
       * Editorial title
       *
       * Title/label override. Used for editorial collection titles from contentful.
       */
      labelOverride: {
        type: String,
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
        return this.labelOverride ? { values: [this.labelOverride], code: null } : this.entity?.prefLabel;
      },
      entityImage() {
        return this.entity?.isShownBy?.thumbnail || (this.entity?.logo ? getWikimediaThumbnailUrl(this.entity?.logo?.id, 80) : null);
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
            query: null
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
