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
      // TODO: fetch the votes for each feature and remove mock functionality
      // const featureIds = this.features.map(feature => feature.sys.id).join(',');
      // this.votesOnFeatures = await this.$axios.$get(`/api/votes/${featureIds}`);
      for (const feature of this.features) {
        const featureVotes = { count: Math.floor(Math.random() * 99), currentlyVotedOn: false };
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
        // await this.$axios.$post(`/api/vote/${featureId}`);
        console.log('Voting on feature', featureId);
        if (this.$auth.loggedIn) {
          if (this.hasVotedOnFeature(featureId)) {
            this.votesOnFeatures[featureId].count = this.votesOnFeatures[featureId].count - 1;
            this.votesOnFeatures[featureId].currentlyVotedOn = false;
          } else {
            this.votesOnFeatures[featureId].count = this.votesOnFeatures[featureId].count + 1;
            this.votesOnFeatures[featureId].currentlyVotedOn = true;
          }
        } else {
          this.keycloakLogin();
        }
      },
      voteCountOnFeature(featureId) {
        return this.votesOnFeatures[featureId].count;
      },
      hasVotedOnFeature(featureId) {
        return this.votesOnFeatures[featureId].currentlyVotedOn;
      }
    }
  };
</script>

<style lang="scss" scoped>
@import '@europeana/style/scss/variables';

::v-deep .content-card.list-card {
  max-width: none;

  .card-img {
    background-color: $bodygrey;

    img {
      width: 80px;
      height: auto;
      margin: 0 auto;

      @media (min-width: $bp-4k) {
        width: 120px;
      }
    }
  }

  .card-wrapper {

    &:hover {
      box-shadow: none;
    }

    .title-texts-wrapper {
      max-height: none;
      margin-bottom: 0.5rem;
    }

    .card-text p {
      display: inline;
      -webkit-line-clamp: none;
    }
  }
}

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

    @media (min-width: $bp-4k) {
      font-size: 1.5rem;
    }
  }
}
</style>
