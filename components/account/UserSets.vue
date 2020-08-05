<template>
  <b-container data-qa="user sets">
    <b-row class="flex-md-row mt-3 pb-5">
      <b-col cols="12">
        <b-card-group
          class="card-deck-4-cols"
          deck
        >
          <ContentCard
            v-for="set in usersets"
            :key="set.id"
            :sub-title="setSubTitle(set)"
            :title="set.title"
            :image-url="set.thumbnail"
            :texts="[set.description]"
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
    name: 'UserSets',
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
      this.usersets =  await this.$sets.getSetImages(setsNoImage);
    },
    data() {
      return {
        usersets: {
          type: Array,
          default: () => []
        }
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
