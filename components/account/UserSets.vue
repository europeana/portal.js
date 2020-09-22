<template>
  <b-container>
    <b-row class="flex-md-row">
      <b-col cols="12">
        <div
          v-if="userSets.length === 0"
          class="text-center pb-4"
        >
          {{ $t(`account.notifications.noCollections.${visibility}`) }}
        </div>
        <b-card-group
          v-else
          class="card-deck-4-cols pb-5"
          deck
        >
          <ContentCard
            v-for="set in userSets"
            :key="set.id"
            :sub-title="setSubTitle(set)"
            :title="set.title"
            :image-url="$sets.getSetThumbnail(set)"
            :texts="[set.description]"
            :url="{ name: 'set-all', params: { pathMatch: setPathMatch(set) } }"
            data-qa="user set"
          />
        </b-card-group>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import ContentCard from '../generic/ContentCard';

  export default {
    name: 'UserSets',
    components: {
      ContentCard
    },
    props: {
      // May be "public" or "private"
      visibility: {
        type: String,
        default: 'public'
      }
    },
    computed: {
      userSets() {
        return this.$store.state.set.creations.filter(set => set.visibility === this.visibility);
      }
    },
    methods: {
      setSubTitle(set) {
        const setTotal = set.total || 0;
        return this.$tc('items.itemCount', setTotal, { count: setTotal });
      },
      setPathMatch(set) {
        return set.id.replace('http://data.europeana.eu/set/', '');
      }
    }
  };
</script>
