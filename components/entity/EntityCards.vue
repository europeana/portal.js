<template>
  <section>
    <ContentCard
      v-for="entity in entities"
      :key="entity.id"
      variant="entity"
      :title="entityTitle(entity)"
      :image-url="depiction(entity)"
      :url="entityRoute(entity)"
      :data-qa="entity.prefLabel.en + ' entity card'"
    />
  </section>
</template>

<script>
  import ContentCard from '../../components/generic/ContentCard';

  import {
    getEntityDescription,
    getEntitySlug,
    getEntityTypeHumanReadable,
    getWikimediaThumbnailUrl
  } from '../../plugins/europeana/entity';

  export default {
    name: 'EntityCards',

    components: {
      ContentCard
    },

    props: {
      entities: {
        type: Array,
        default: () => []
      }
    },

    methods: {
      getEntityDescription,
      getEntitySlug,
      getEntityTypeHumanReadable,
      getWikimediaThumbnailUrl,

      depiction(entity) {
        return (!entity || !entity.depiction) ? null : getWikimediaThumbnailUrl(entity.depiction.id);
      },

      entityTitle(entity) {
        return entity.prefLabel;
      },

      entityRoute(entity) {
        return {
          name: 'collections-type-all',
          params: {
            type: getEntityTypeHumanReadable(entity.type),
            pathMatch: getEntitySlug(entity.id, entity.prefLabel.en)
          }
        };
      }
    }
  };
</script>
