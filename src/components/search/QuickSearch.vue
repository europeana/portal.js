<template>
  <div
    v-if="allThemes.length"
    class="quick-search"
  >
    <div class="context-label">
      {{ $t('header.quickSearch') }}
    </div>
    <div class="quick-search-chips">
      <RelatedChip
        v-for="(link, index) in allThemes"
        :key="index"
        ref="options"
        :title="link.prefLabel ? link.prefLabel : link.name"
        :link-to="linkGen(link)"
        :img="imageUrl(link)"
        badge-variant="secondary"
        data-qa="quick search chips"
      />
    </div>
  </div>
</template>

<script>
  import RelatedChip from '../generic/RelatedChip';

  import { BASE_URL as EUROPEANA_DATA_URL } from '@/plugins/europeana/data';
  import { getEntityTypeHumanReadable, getEntitySlug, getWikimediaThumbnailUrl } from '@/plugins/europeana/entity';
  import { getEntityUri } from '@/plugins/europeana/entity';
  import themes from '@/plugins/europeana/themes';
  import { mapState } from 'vuex';

  export default {
    name: 'QuickSearch',

    components: {
      RelatedChip
    },

    async fetch() {
      if (this.allThemes.length === 0) {
        const themesURIs = themes.map(theme => getEntityUri('topic', theme.id));
        const allThemesFromAPI = await this.$apis.entity.find(themesURIs);
        this.$store.commit('search/set', ['allThemes', allThemesFromAPI]);
      }
    },

    computed: {
      ...mapState({ allThemes: state => state.search.allThemes })
    },

    methods: {
      linkGen(item) {
        const id = item.id;
        const name = item.prefLabel[this.$i18n.locale];
        const uriMatch = id.match(`^${EUROPEANA_DATA_URL}/([^/]+)(/base)?/(.+)$`);

        return this.$path({
          name: 'collections-type-all', params: {
            type: getEntityTypeHumanReadable(uriMatch[1]),
            pathMatch: getEntitySlug(id, name)
          }
        });
      },

      imageUrl(item) {
        let url = null;

        if (item.image) {
          url = `${item.image}&size=w200`;
        } else if (item.isShownBy?.thumbnail) {
          url = `${item.isShownBy.thumbnail}&size=w200`;
        } else if (item.logo) {
          url = getWikimediaThumbnailUrl(item.logo.id, 28);
        }

        return url;
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables';

  .quick-search {
    border-top: 1px solid $middlegrey;
    padding: 0.5rem 1.25rem 1.25rem;
    overflow: scroll;
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */

    &::-webkit-scrollbar {
      display: none;
    }

    .context-label {
      margin-bottom: 0.75rem;
    }

    .badge {
      margin-right: 0.75rem;

      &:last-child {
        margin-right: 0;
      }
    }
  }
</style>
