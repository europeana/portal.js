<template>
  <div class="overflow-hidden d-inline-flex flex-wrap align-items-center">
    <i18n
      :path="i18nPath"
      tag="h1"
      class="context-label"
      :class="{
        'mr-4': suggestLoginForMoreResults,
        'mr-1': multilingualSearchTooltip
      }"
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
        <SearchRemovalChip
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
        <SearchRemovalChip
          :title="query"
          :link-to="queryRemovalLink"
          data-qa="query removal badge"
          class="mb-1 mx-1"
          :badge-variant="badgeVariant"
        />
      </template>
    </i18n><!-- This comment removes white space which gets underlined
 -->
    <i18n
      v-if="suggestLoginForMoreResults"
      path="search.results.loginToSeeMore"
      tag="span"
      class="context-label mr-1"
      data-qa="results more link"
    >
      <template #login>
        <b-link
          class="more-link"
          :href="localePath({ name: 'account-login', query: { redirect: $route.fullPath } })"
          :target="null"
          @click.prevent="$keycloak.login()"
        >
          {{ $t('actions.login') }}
        </b-link>
      </template>
    </i18n><!-- This comment removes white space which gets underlined
 --><b-button
      v-if="multilingualSearchTooltip"
      v-b-tooltip.bottom
      :title="multilingualSearchTooltip"
      class="icon-info-outline p-0 tooltip-button"
      variant="light-flat"
      data-qa="results more tooltip"
    />
    <output
      class="visually-hidden"
      data-qa="results status message"
    >
      {{ $t('searchHasLoaded', [totalResultsLocalised]) }}
    </output>
  </div>
</template>

<script>
  import SearchRemovalChip from './SearchRemovalChip';
  import { entityParamsFromUri } from '@/plugins/europeana/entity';
  import europeanaEntitiesOrganizationsMixin from '@/mixins/europeana/entities/organizations';

  export default {
    name: 'SearchResultsContext',

    components: {
      SearchRemovalChip
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
      // TODO: it's not possible to pluralise these keys properly due to the
      // i18n component usage here. i18n-vue 9.x supports a :plural prop for
      // the updated i18n-t component. Depends on Vue 3.
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
        return this.$i18n.n(this.totalResults);
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
        return {
          currentPath: this.$route.path,
          params: this.$route.params,
          query: {
            ...this.activeCriteria,
            query: null
          }
        };
      },
      entityRemovalLink() {
        return {
          name: 'search', query: {
            ...this.activeCriteria
          }
        };
      },
      activeCriteria() {
        return {
          boost: this.$route?.query?.boost,
          qa: this.$route?.query?.qa,
          qf: this.$route?.query?.qf,
          query: this.$route.query?.query,
          reusability: this.$route?.query?.reusability,
          view: this.$route?.query?.view
        };
      },
      translateProfileEnabledForCurrentLocale() {
        return this.$config?.app?.search?.translateLocales?.includes(this.$i18n.locale);
      },
      suggestLoginForMoreResults() {
        return !this.$auth.loggedIn && this.translateProfileEnabledForCurrentLocale;
      },
      multilingualSearchTooltip() {
        if (this.translateProfileEnabledForCurrentLocale) {
          if (this.$auth.loggedIn) {
            return this.$t('search.results.showingMultilingualResults');
          } else {
            return this.$t('search.results.loginToSeeMultilingualResults');
          }
        } else {
          return null;
        }
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
  display: inline-block;

  .more-link {
    text-decoration: none;
    color: $blue;
    transition: color 150ms ease-in-out;

    &:hover {
      color: $darkblue;
      transition: color 150ms ease-in-out;
    }
  }

  @at-root .xxl-page & {
    @media (min-width: $bp-4k) {
      font-size: $font-size-small-4k;
    }
  }

  ::v-deep .badge {
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
