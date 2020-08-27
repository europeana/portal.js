<template>
  <b-container>
    <b-row class="flex-md-row">
      <b-col cols="12">
        <div
          v-if="$fetchState.pending"
          class="text-center pb-4"
        >
          <LoadingSpinner />
        </div>
        <AlertMessage
          v-else-if="$fetchState.error"
          :error="$fetchState.error.message"
        />
        <template
          v-else
        >
          <div
            v-if="userSets.length === 0"
            class="text-center pb-4"
          >
            {{ $t(`account.notifications.no${capitalizeWord(visibility)}Collections`) }}
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
        </template>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import AlertMessage from '../generic/AlertMessage';
  import ContentCard from '../generic/ContentCard';
  import LoadingSpinner from '../generic/LoadingSpinner';

  export default {
    name: 'UserSets',
    components: {
      AlertMessage,
      ContentCard,
      LoadingSpinner
    },
    props: {
      // May be "public" or "private"
      visibility: {
        type: String,
        default: 'public'
      }
    },
    async fetch() {
      const searchParams = {
        query: `creator:${this.$auth.user.sub} visibility:${this.visibility}`,
        profile: 'itemDescriptions'
      };

      const searchResponse = await this.$sets.search(searchParams);
      this.userSets = searchResponse.data.items || [];
    },
    data() {
      return {
        userSets: []
      };
    },
    methods: {
      setSubTitle(set) {
        const setTotal = set.total || 0;
        return this.$tc('items.itemCount', setTotal, { count: setTotal });
      },
      setPathMatch(set) {
        return set.id.replace('http://data.europeana.eu/set/', '');
      },
      capitalizeWord(word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
    }
  };
</script>
