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
          class="card-deck-4-cols pb-5"
          deck
        >
          <b-row
            v-if="visibility === 'curated'"
            class="w-100 px-3"
          >
            <b-col class="related-heading d-inline-flex">
              <span class="icon-info mr-1" />
              <h2 class="related-heading text-uppercase">
                {{ $t('account.curatedCollectionsInfo') }}
              </h2>
            </b-col>
          </b-row>
          <ContentCard
            v-for="set in userSets"
            :key="set.id"
            :sub-title="setSubTitle(set)"
            :title="set.title"
            :image-url="$apis.set.getSetThumbnail(set)"
            :texts="[set.description]"
            :url="{ name: 'set-all', params: { pathMatch: setPathMatch(set) } }"
            data-qa="user set"
          />
          <CreateSetButton
            v-if="visibility !== 'curated'"
            :visibility="visibility"
          />
        </b-card-group>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import ContentCard from '../generic/ContentCard';
  import CreateSetButton from './CreateSetButton.vue';

  export default {
    name: 'UserSets',
    components: {
      ContentCard,
      CreateSetButton
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
        if (this.visibility === 'curated') {
          return this.$store.state.set.curations;
        }
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
