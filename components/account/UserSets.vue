<template>
  <b-container>
    <b-row class="flex-md-row pb-5">
      <b-col cols="12">
        <LoadingSpinner
          v-if="$fetchState.pending"
        />
        <AlertMessage
          v-if="$fetchState.error"
          :error="$fetchState.error.message"
        />
        <b-card-group
          v-else
          class="card-deck-4-cols"
          deck
        >
          <ContentCard
            v-for="set in userSets"
            :key="set.id"
            :sub-title="setSubTitle(set)"
            :title="set.title"
            :image-url="setThumbnail(set)"
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
  import AlertMessage from '../../components/generic/AlertMessage';
  import ContentCard from '../../components/generic/ContentCard';
  import LoadingSpinner from '../../components/generic/LoadingSpinner';

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
      setThumbnail(set) {
        const firstItemWithEdmPreview = (set.items || []).find(item => item.edmPreview);
        return firstItemWithEdmPreview ? firstItemWithEdmPreview.edmPreview[0] : null;
      }
    }
  };
</script>
