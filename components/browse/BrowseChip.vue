<template>
  <div>
    <b-badge
      v-for="relatedEntity in relatedEntities"
      :key="relatedEntity.path"
      :to="localePath({
        name: 'entity-type-all',
        params: {
          type: relatedEntity.type,
          pathMatch: relatedEntity.path
        }
      })"
      pill
      variant="nocolor"
      class="mb-3 mr-3 font-weight-normal bg-trabrowse chipnsparent"
      data-qa="browse chip"
    >
      {{ relatedEntity.title }}
    </b-badge>
  </div>
</template>


<script>
  import axios from 'axios';
  import * as entities from '../../plugins/europeana/entity';

  export default {
    data() {
      return {
        relatedEntities: null
      };
    },

    async mounted() {
      const params = this.$route.params;

      axios
        .all(
          [entities.relatedEntities(params.type, params.pathMatch, {
            wskey: process.env.EUROPEANA_API_KEY,
            entityKey: process.env.EUROPEANA_ENTITY_API_KEY
          })]
        )
        .then(axios.spread(res => this.relatedEntities = res))
        .catch((err) => {
          return {
            error: err.message
          };
        });
    }
  };
</script>

<style lang="scss" scoped>
  @import "./assets/scss/variables.scss";

  .badge-nocolor {
    border: 1px solid $darkgrey;
    color: $black;
    font-size: 0.875rem;
    height: 4rem;
    line-height: 3.5rem;
    min-width: 6rem;
  }
</style>
