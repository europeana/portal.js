<template>
  <div
    v-if="collections.length"
    data-qa="related collections"
    class="related-collections"
  >
    <h2 class="related-heading text-uppercase">
      {{ title || $t('related.collections.title') }}
    </h2>
    <div
      class="badges-wrapper d-flex flex-wrap"
    >
      <LinkBadge
        v-for="relatedCollection in collections"
        :id="relatedCollection.id"
        :key="relatedCollection.id"
        ref="options"
        :link-to="relatedCollection.url || collectionLinkGen(relatedCollection)"
        :title="collectionTitle(relatedCollection)"
        :img="$apis.entity.imageUrl(relatedCollection)"
        :type="relatedCollection.type"
        :badge-variant="badgeVariant"
        :click-event-handler="() => clickEventHandler(relatedCollection.url || collectionLinkGen(relatedCollection))"
      />
    </div>
  </div>
</template>

<script>
  import pick from 'lodash/pick.js';

  import collectionLinkGenMixin from '@/mixins/collectionLinkGen';
  import { collectionTitle } from '@/utils/europeana/entities/entityLinks';
  import LinkBadge from '../generic/LinkBadge';

  export default {
    name: 'EntityBadges',

    components: {
      LinkBadge
    },

    mixins: [
      collectionLinkGenMixin
    ],

    props: {
      /**
       * Title which appears above the badges
       */
      title: {
        type: String,
        default: ''
      },
      /**
       * Array of already fetched entity objects to be used for the badges
       */
      relatedCollections: {
        type: Array,
        default: () => []
      },
      /**
       * Array of entity uris which will be used to fetch entity data for the badges
       */
      entityUris: {
        type: Array,
        default: () => []
      },
      /**
       * Variant of the badges that define their styles
       */
      badgeVariant: {
        type: String,
        default: 'secondary'
      }
    },

    data() {
      return {
        collections: this.relatedCollections
      };
    },

    async fetch() {
      if (((this.entityUris?.length || 0) > 0) && ((this.relatedCollections?.length || 0) === 0)) {
        const entities = await this.$apis.entity.find(this.entityUris);
        this.collections = entities?.map((entity) => pick(entity, ['id', 'prefLabel', 'isShownBy', 'logo'])) || [];
        this.$emit('entitiesFromUrisFetched', this.collections);
      }
      this.$emit('fetched');
    },

    mounted() {
      this.draw();
    },

    updated() {
      this.draw();
    },

    methods: {
      collectionTitle,
      draw() {
        this.$nextTick(() => {
          this.$redrawVueMasonry?.();
        });
      },
      clickEventHandler(link) {
        this.$store.commit('search/setLoggableInteraction', true);
        if (this.$matomo) {
          this.$matomo.trackEvent('Related_collections', 'Click related collection', link);
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .badges-wrapper {
    a {
      max-width: 100%;
    }
  }

  .related-collections ::v-deep .badge-pill {
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;

    @at-root .xxl-page & {
      @media (min-width: $bp-4k) {
        margin-right: 0.75rem;
        margin-bottom: 0.75rem;
      }
    }
  }

  .related-collections-card .related-collections ::v-deep .badge-pill {
    margin-bottom: 0.75rem;
    margin-right: 0.75rem;

    @at-root .xxl-page & {
      @media (min-width: $bp-4k) {
        margin-right: 1.125rem;
        margin-bottom: 1.125rem;
      }
    }
  }
</style>

<docs lang="md">
  ```jsx
  <EntityBadges
    :related-collections="[
      {
      id: 'http://data.europeana.eu/concept/238',
      isShownBy: { thumbnail: 'https://api.europeana.eu/thumbnail/v3/200/8a4531e9596247152fb127caa8ab8d2b' },
      prefLabel: { en: 'Sonata' }
      },
      {
      id: 'http://data.europeana.eu/concept/1482250000004477257',
      logo:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Albertina_Logo.svg/28px-Albertina_Logo.svg.png'
      ,
      type: 'Organization',
      prefLabel: { en: 'Albertina', de: 'Albertina' }
      }]"
  />
  ```
</docs>
