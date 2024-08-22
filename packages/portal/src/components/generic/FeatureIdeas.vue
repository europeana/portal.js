<template>
  <div>
    <ErrorMessage
      v-if="$fetchState.error"
      :error="$fetchState.error"
      :full-height="false"
      :show-message="false"
      title-tag="h2"
      data-qa="error message"
      class="feature-ideas-error-container"
    />
    <template v-else>
      <ContentCard
        v-for="(feature, index) in features"
        :key="index"
        :title="feature.name"
        :texts="[feature.text]"
        :image-url="feature.image?.image.url"
        :image-content-type="feature.image?.image.contentType"
        :image-width="feature.image?.image.width"
        :image-height="feature.image?.image.height"
        variant="list"
        data-qa="feature idea card"
      >
        <template #footer>
          <b-button
            v-if="!$fetchState.pending"
            class="vote-button d-inline-flex align-items-center text-uppercase mt-auto mr-auto"
            :class="{ voted: hasVotedOnFeature(feature.identifier) }"
            variant="light-flat"
            :aria-label="$t('actions.vote')"
            @click="voteOnFeature(feature.identifier)"
          >
            <span
              class="mr-1"
              :class="feature.voted ? 'icon-thumbsup' : 'icon-thumbsup-outlined'"
            />
            {{ $tc('likes.count', voteCountOnFeature(feature.identifier)) }}
          </b-button>
        </template>
      </ContentCard>
    </template>
  </div>
</template>

<script>
  import axios from 'axios';
  import keycloakMixin from '@/mixins/keycloak';
  import { keycloakResponseErrorHandler } from '@/plugins/europeana/auth';
  import ContentCard from '@/components/content/ContentCard';

  export default {
    name: 'FeatureIdeas',

    components: {
      ContentCard,
      ErrorMessage: () => import('@/components/error/ErrorMessage')
    },

    mixins: [keycloakMixin],

    props: {
      features: {
        type: Array,
        default: () => []
      }
    },

    data() {
      return {
        axiosInstance: null,
        votesOnFeatures: {}
      };
    },

    async fetch() {
      this.axiosInstance = axios.create({
        baseURL: this.$config.app.baseUrl
      });
      this.axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => keycloakResponseErrorHandler(this.$nuxt.context, error)
      );

      if (this.features.length < 1) {
        const error = new Error('No feature ideas');
        error.code = 'noFeatureIdeas';
        this.$error(error);
      }

      const params = { candidate: this.features.map((feature) => feature.identifier).join(',') };
      const votesResponse = await this.axiosInstance({
        url: '/_api/votes',
        method: 'get',
        headers: this.headersForAuthorization(),
        params
      });

      this.votesOnFeatures = votesResponse.data;
    },

    // client-side only for oAuth authorization
    fetchOnServer: false,

    methods: {
      headersForAuthorization() {
        if (this.$auth.loggedIn) {
          return {
            authorization: this.$auth.getToken(this.$auth.strategy?.name)
          };
        } else {
          return {};
        }
      },
      async voteOnFeature(featureId) {
        if (this.$auth.loggedIn) {
          const method = this.hasVotedOnFeature(featureId) ? 'delete' : 'put';

          await this.axiosInstance({
            url: `/_api/votes/${featureId}`,
            method,
            headers: this.headersForAuthorization()
          });

          this.$fetch();
        } else {
          this.keycloakLogin();
        }
      },
      voteCountOnFeature(featureId) {
        return this.votesOnFeatures[featureId]?.total || 0;
      },
      hasVotedOnFeature(featureId) {
        return this.votesOnFeatures[featureId]?.votedByCurrentVoter || false;
      }
    }
  };
</script>

<style lang="scss" scoped>
@import '@europeana/style/scss/variables';

.feature-ideas-error-container {
  ::v-deep .error-explanation {
    flex-direction: column;
    padding-top: 1rem;
    padding-bottom: 1rem;

    section {
      width: 100%;
    }

    img {
      max-width: 250px;

      @media (min-width: $bp-4k) {
        max-width: calc(1.5 * 250px);
      }
    }

    .title {
      color: $greyblack;
      font-size: $font-size-medium;
      font-weight: 600;
      margin-bottom: 1rem !important;

      @media (min-width: $bp-small) {
        font-size: $font-size-large;
      }

      @media (min-width: $bp-4k) {
        font-size: $font-size-large-4k;
      }
    }

    p {
      margin-bottom: 1rem;
    }
  }
}

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

::v-deep .container.error-container {
  max-width: none;
}
</style>

<docs lang="md">
  ```jsx
  <FeatureIdeas :features="[
    { name: 'Feature 1',
      text: 'Feature 1 description. Description of the feature. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      image: {
        image: {
          url: illustrations.search,
          contentType: 'image/svg+xml',
        }
      },
      sys: { id: '1' }
    },
    { name: 'Feature 2',
      text: 'Feature 2 description. Description of the feature. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      image: {
        image: {
          url: illustrations.search,
          contentType: 'image/svg+xml',
        }
      },
      sys: { id: '2' }
    }
  ]" />
  ```
</docs>
