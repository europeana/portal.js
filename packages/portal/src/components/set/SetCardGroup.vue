<template>
  <div
    v-if="sets.length"
  >
    <h2
      v-if="title"
      class="card-group-title"
    >
      {{ title }}
    </h2>
    <b-card-group
      class="card-deck-4-cols"
      :class="cardGroupClass"
      deck
    >
      <ContentCard
        v-for="(set, index) in sets"
        :key="set.slug"
        :title="set.title"
        :url="{ name: 'galleries-all', params: { pathMatch: set.slug } }"
        :image-url="set.thumbnail"
        :texts="[set.description]"
        :show-subtitle="false"
        :offset="index"
        :card-variant="cardVariant"
      />
    </b-card-group>
  </div>
</template>

<script>
  import { getLabelledSlug } from '@/plugins/europeana/utils.js';

  export default {
    name: 'SetCardGroup',

    components: {
      ContentCard: () => import('@/components/content/ContentCard')
    },

    props: {
      title: {
        type: String,
        default: ''
      },
      setUris: {
        type: Array,
        default: () => []
      },
      cardVariant: {
        type: String,
        default: 'default'
      },
      cardGroupClass: {
        type: String,
        default: null
      }
    },

    data() {
      return {
        sets: []
      };
    },

    async fetch() {
      if (this.setUris?.length) {
        // TODO: this is very inefficient, requiring a GET request for each
        //       linked set, but the Set API does not yet support searching
        //       by multiple IDs combined with OR. refactor when the API
        //       supports searching by multiple IDs.
        let setResponse = await Promise.all(this.setUris.map(async(id) => {
          const numericId = id.toString().split('/').pop();
          const setSearchResponse = await this.$apis.set.search({ query: `set_id:${numericId}`, qf: `lang:${this.$i18n.locale}`, profile: 'itemDescriptions' });
          return setSearchResponse?.items?.[0];
        }));
        setResponse = setResponse.filter(set => !!set);

        if (setResponse)  {
          this.sets = this.parseSets(setResponse);
        }
      }
      this.$emit('fetched');
    },

    methods: {
      parseSets(sets) {
        return sets.map((set) => {
          return {
            slug: getLabelledSlug(set.id, set.title.en),
            title: set.title,
            description: set.description,
            thumbnail: this.setPreviewUrl(set.items?.[0].edmPreview)
          };
        });
      },
      setPreviewUrl(edmPreview) {
        return this.$apis.thumbnail.edmPreview(edmPreview, { size: 400 });
      }
    }
  };
</script>
