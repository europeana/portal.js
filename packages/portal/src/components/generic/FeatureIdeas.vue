<template>
  <div>
    <template v-if="features?.length">
      <ContentCard
        v-for="feature, i in features"
        :key="i"
        :title="feature.name"
        :texts="[feature.text]"
        :image-url="feature.image.image.url"
        :image-content-type="feature.image.image.contentType"
        :image-width="feature.image.image.width"
        :image-height="feature.image.image.height"
        variant="list"
      >
        <template #footer>
          <b-button
            class="vote-button d-inline-flex align-items-center text-uppercase mt-auto mr-auto"
            :class="{ voted: hasVotedOnFeature(feature.sys.id) }"
            variant="light-flat"
            :aria-label="$t('actions.vote')"
            @click="voteOnFeature(feature.sys.id)"
          >
            <span
              class="mr-1"
              :class="feature.voted ? 'icon-thumbsup' : 'icon-thumbsup-outlined'"
            />
            {{ $t('statuses.likesCount', { count: voteCountOnFeature(feature.sys.id) }) }}
          </b-button>
        </template>
      </ContentCard>
    </template>
  </div>
</template>

<script>
  import keycloak from '@/mixins/keycloak';
  import ContentCard from '@/components/content/ContentCard';

  export default {
    name: 'FeatureIdeas',

    components: {
      ContentCard
    },

    mixins: [keycloak],

    props: {
      features: {
        type: Array,
        default: () => []
      }
    },

    data() {
      return {
        votesOnFeatures: {}
      };
    },

    fetch() {
      for (const feature of this.features) {
        // TODO: fetch the votes for each feature and remove mock functionality
        const featureVotes = { count: Math.floor(Math.random() * 99), userIds: ['001'] }; // await this.$axios.$get(`/api/votes/${feature.sys.id}`);
        this.votesOnFeatures[feature.sys.id] = featureVotes;
      }
    },

    computed: {
      userId() {
        return this.$auth.user?.sub;
      }
    },

    methods: {
      voteOnFeature(featureId) {
        // TODO: Implement voting on feature and remove mock functionality
        console.log('Voting on feature', featureId);
        if (this.$auth.loggedIn) {
          if (this.hasVotedOnFeature(featureId)) {
            this.votesOnFeatures[featureId].count = this.votesOnFeatures[featureId].count - 1;
            this.votesOnFeatures[featureId].userIds.splice(this.votesOnFeatures[featureId].userIds.indexOf(this.userId));
          } else {
            this.votesOnFeatures[featureId].count = this.votesOnFeatures[featureId].count + 1;
            this.votesOnFeatures[featureId].userIds.push(this.userId);
          }
        } else {
          this.keycloakLogin();
        }
      },
      voteCountOnFeature(featureId) {
        return this.votesOnFeatures[featureId].count;
      },
      hasVotedOnFeature(featureId) {
        return this.votesOnFeatures[featureId].userIds.includes(this.userId);
      }
    }
  };
</script>

<style lang="scss" scoped>
@import '@europeana/style/scss/variables';

  .vote-button {

    &:hover,
    &.voted {
      .icon-thumbsup-outlined::before {
        content: '\e921';
      }
    }

    &.voted {
      color: $blue;
    }

    .icon-thumbsup-outlined,
    .icon-thumbsup {
      font-size: 1.125rem;
    }
  }
</style>
