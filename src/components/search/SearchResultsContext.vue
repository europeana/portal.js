<template>
  <div
    class="context-label"
    data-qa="context label"
  >
    <template
      v-if="hasEntity"
    >
      <i18n
        v-if="hasQuery"
        path="resultsWithin"
        tag="span"
      >
        {{ entityTypeLabel }}
        <RemovalChip
          :title="localisedEntityLabel"
          :link-to="entityRemovalLink"
          :img="entityImage"
          data-qa="entity removal badge"
          class="mt-1 mx-1"
        />
        <RemovalChip
          :title="query"
          :link-to="queryRemovalLink"
          data-qa="query removal badge"
          class="mt-1 mx-1"
        />
      </i18n>
      <span
        v-else
      >
        {{ entityTypeLabel }}
        <RemovalChip
          :title="localisedEntityLabel"
          :link-to="entityRemovalLink"
          :img="entityImage"
          data-qa="entity removal badge"
          class="mt-1 mx-1"
        />
      </span>
    </template>
    <template
      v-else
    >
      <i18n
        v-if="hasQuery"
        path="resultsFor"
        tag="span"
      >
        <RemovalChip
          :title="query"
          :link-to="queryRemovalLink"
          data-qa="query removal badge"
          class="mt-1 mx-1"
        />
      </i18n>
      <span v-else>
        {{ $t('results') }}
      </span>
    </template>
  </div>
</template>

<script>
  import RemovalChip from './RemovalChip';
  import { getWikimediaThumbnailUrl, entityParamsFromUri } from '@/plugins/europeana/entity';
  import themes from '@/plugins/europeana/themes';
  import { mapState } from 'vuex';

  export default {
    name: 'SearchResultsContext',

    components: {
      RemovalChip
    },

    props: {
      /**
       * Editorial title
       *
       * Title/label override. Used for editorial collection titles from Contentful.
       */
      labelOverride: {
        type: String,
        default: null
      }
    },

    data() {
      return {
        themes: themes.map(theme => theme.id)
      };
    },

    computed: {
      ...mapState({
        query: state => state.search.userParams.query,
        entity: state => state.entity?.entity
      }),
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
        return this.$apis.entity.imageUrl(this.entity);
      },
      entityTypeLabel() {
        return this.$t(`cardLabels.${this.contextType}`);
      },
      contextType() {
        let contextType = this.entityType;

        if (this.entityType === 'topic' && this.themes.includes(this.entityId)) {
          contextType = 'theme';
        }

        return contextType;
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
  }
</style>
