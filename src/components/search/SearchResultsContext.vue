<template>
  <h1
    class="context-label"
    data-qa="context label"
  >
    <template
      v-if="hasEntity"
    >
      <i18n
        v-if="hasQuery"
        path="resultsWithin"
        :tag="false"
      >
        {{ entityTypeLabel }}
        <RemovalChip
          :title="entityLabel"
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
          :title="entityLabel"
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
        :tag="false"
      >
        <RemovalChip
          :title="query"
          :link-to="queryRemovalLink"
          data-qa="query removal badge"
          class="mt-1 mx-1"
        />
      </i18n>
      <template v-else>
        {{ $t('results') }}
      </template>
    </template>
  </h1>
</template>

<script>
  import RemovalChip from './RemovalChip';
  import { entityParamsFromUri } from '@/plugins/europeana/entity';
  import themes from '@/plugins/europeana/themes';
  import { mapState } from 'vuex';
  import { urlIsContentfulAsset, optimisedSrcForContentfulAsset } from '@/plugins/contentful-utils';

  export default {
    name: 'SearchResultsContext',

    components: {
      RemovalChip
    },

    props: {
      /**
       * Editorial overrides
       *
       * Title/label and image override. Used for editorial collection titles and images from Contentful.
       */
      editorialOverrides: {
        type: Object,
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
      entityLabel() {
        return this.editorialOverrides?.title || this.entity?.prefLabel;
      },
      entityImage() {
        if (this.editorialOverrides?.image && urlIsContentfulAsset(this.editorialOverrides.image.url)) {
          return optimisedSrcForContentfulAsset(
            this.editorialOverrides.image,
            { w: 28, h: 28, fit: 'thumb' },
            { acceptMediaTypes: this.$store?.state?.http?.acceptMediaTypes }
          );
        }
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
