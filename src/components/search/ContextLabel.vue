<template>
  <div
    class="context-label"
    data-qa="context label"
  >
    <template
      v-if="hasEntity"
    >
      <span
        v-if="!hasQuery"
      >
        {{ entityTypeLabel }}
        <RemovalChip
          :title="localisedEntityLabel"
          :link-to="entityRemovalLink"
          :img="entityImage"
          class="mt-1 mx-1"
        />
      </span>
      <i18n
        v-else-if="hasQuery"
        path="resultsWithin"
        tag="span"
      >
        {{ entityTypeLabel }}
        <RemovalChip
          :title="localisedEntityLabel"
          :link-to="entityRemovalLink"
          :img="entityImage"
          class="mt-1 mx-1"
        />
        <RemovalChip
          :title="query"
          :link-to="queryRemovalLink"
          class="mt-1 mx-1"
        />
      </i18n>
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
  import { getWikimediaThumbnailUrl } from '@/plugins/europeana/entity';
  import { mapState } from 'vuex';

  export default {
    name: 'ContextLabel',

    components: {
      RemovalChip
    },

    props: {
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
      ...mapState({
        query: state => state.search.userParams.query,
        entity: state => state.entity.entity
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
  }
</style>
