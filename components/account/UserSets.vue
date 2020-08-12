<template>
  <b-container>
    <b-row class="flex-md-row pb-5">
      <b-col cols="12">
        <b-card-group
          class="card-deck-4-cols"
          deck
        >
          <ContentCard
            v-for="set in sets"
            :key="set.id"
            :sub-title="setSubTitle(set)"
            :title="set.title"
            :image-url="set.thumbnail"
            :texts="[set.description]"
            :url="{ name: 'set-all', params: { pathMatch: set.id } }"
            data-qa="user set"
          />
        </b-card-group>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
  import ContentCard from '../../components/generic/ContentCard';

  export default {
    name: 'sets',
    components: {
      ContentCard
    },
    props: {
      setIds: {
        type: Array,
        default: () => []
      }
    },
    async fetch() {
      const setsNoImage = await this.$sets.getAllSets(this.setIds);
      this.sets =  await this.$sets.getSetImages(setsNoImage);
    },
    data() {
      return {
        sets: []
      };
    },
    methods: {
      setSubTitle(set) {
        const setTotal = set.total || 0;
        return this.$tc('items.itemCount', setTotal, { count: setTotal });
      }
    }
  };
</script>
