<template>
  <b-container v-if="$fetchState.pending">
    <b-row class="flex-md-row py-4 text-center">
      <b-col cols="12">
        <LoadingSpinner
          v-if="$fetchState.pending"
        />
      </b-col>
    </b-row>
  </b-container>
  <b-container v-else-if="$fetchState.error">
    <b-row class="flex-md-row py-4">
      <b-col cols="12">
        <AlertMessage
          :error="$fetchState.error.message"
        />
      </b-col>
    </b-row>
  </b-container>
  <div
    v-else
    data-qa="user gallery page"
    class="mt-n3"
  >
    <b-container
      fluid
    >
      <b-row class="flex-md-row pt-5 bg-white mb-4">
        <b-col
          cols="12"
        >
          <b-container class="mb-5">
            <b-row class="mb-3">
              <b-col>
                <h1
                  class="pt-3"
                  :lang="displayTitle.code"
                >
                  {{ displayTitle.values[0] }}
                </h1>
                <p
                  class="usergallery-description mb-3 w-75"
                  :lang="displayDescription.code"
                >
                  {{ displayDescription.values[0] }}
                </p>
                <!-- TODO: to avoid showing an empty div + whitespace, the v-if is on the div
                    This can be changed when this functionality is further developed
                -->
                <div
                  v-if="visibility === 'private'"
                  class="usergallery-metadata"
                >
                  <!-- TODO: Fill after the '@' with the set's owner  -->
                  <!-- <span class="curator mr-4">
                    {{ $t('set.labels.curatedBy') }} @placeholderUsername
                  </span> -->
                  <span
                    class="visibility"
                  >
                    {{ $t('set.labels.private') }}
                  </span>
                </div>
              </b-col>
            </b-row>
            <div class="collection-buttons">
              <template
                v-if="userIsOwner"
              >
                <b-button
                  variant="outline-primary text-decoration-none"
                  @click="$bvModal.show(setFormModalId)"
                >
                  {{ $t('actions.edit') }}
                </b-button>
                <SetFormModal
                  :set-id="id"
                  :modal-id="setFormModalId"
                  :title="title"
                  :description="description"
                  :visibility="visibility"
                  @update="updateSet"
                />
              </template>
              <!-- <b-button
                v-if="visibility === 'public'"
                variant="outline-primary text-decoration-none"
              >
                <span class="text">
                  {{ $t('actions.share') }}
                </span>
              </b-button> -->
            </div>
          </b-container>
        </b-col>
      </b-row>
    </b-container>
    <b-container class="mb-3">
      <b-row>
        <b-col>
          <h2 class="related-heading text-uppercase">
            {{ $tc('items.itemCount', total, { count: total }) }}
          </h2>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-container class="px-0">
            <b-row class="mb-3">
              <b-col cols="12">
                <ItemPreviewCardGroup
                  v-model="items"
                />
              </b-col>
            </b-row>
          </b-container>
        </b-col>
      </b-row>
      <b-row
        v-if="recommendations && recommendations.length > 0"
        class="recommendations"
      >
        <b-col>
          <h2>{{ $t('items.youMightLike') }}</h2>
          <ItemPreviewCardGroup
            v-model="recommendations"
          />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  import { langMapValueForLocale } from  '../../plugins/europeana/utils';
  import AlertMessage from '../../components/generic/AlertMessage';
  import ItemPreviewCardGroup from '../../components/item/ItemPreviewCardGroup';
  import LoadingSpinner from '../../components/generic/LoadingSpinner';
  import { mapGetters } from 'vuex';

  export default {
    components: {
      LoadingSpinner,
      AlertMessage,
      ItemPreviewCardGroup,
      SetFormModal: () => import('../../components/set/SetFormModal')
    },

    middleware: 'sanitisePageQuery',

    // TODO: error handling for Nuxt 2.12 fetch()
    //       https://nuxtjs.org/blog/understanding-how-fetch-works-in-nuxt-2-12/#error-handling
    async fetch() {
      const token = this.$auth.loggedIn ? this.$auth.getToken('keycloak') : null;
      const headers = {};
      if (token) headers['Authorization'] = token;
      const apiUrl = `${this.apiConfig.set.origin}${this.apiConfig.set.path}/${this.$route.params.pathMatch}?wskey=${this.apiConfig.set.key}&profile=itemDescriptions`;
      const set = await fetch(apiUrl, { headers })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          if (process.server) {
            this.$nuxt.context.res.statusCode = response.status;
            return response.json();
          }
        });
      if (set.id) {
        this.id = set.id;
        this.title = set.title;
        this.description = set.description;
        this.visibility = set.visibility;
        this.creator = set.creator;
        this.total = set.total || 0;
        this.items = set.items;
      } else {
        throw new Error(set.error);
      }
    },

    data() {
      return {
        id: null,
        creator: null,
        description: null,
        items: [],
        recommendations: [],
        setFormModalId: `set-form-modal-${this.id}`,
        title: null,
        total: 0,
        visibility: null
      };
    },

    computed: {
      ...mapGetters({
        apiConfig: 'apis/config'
      }),
      userIsOwner() {
        return this.$store.state.auth.user &&
          this.creator &&
          this.creator.endsWith(`/${this.$store.state.auth.user.sub}`);
      },
      displayTitle() {
        return langMapValueForLocale(this.title, this.$i18n.locale);
      },
      displayDescription() {
        return langMapValueForLocale(this.description, this.$i18n.locale);
      }
    },

    mounted() {
      if (!this.$auth.loggedIn) return;
      this.$recommendations.recommend('set', `/${this.$route.params.pathMatch}`)
        .then(recommendResponse => {
          this.recommendations = recommendResponse.items;
        });
    },

    methods: {
      updateSet(set) {
        this.id = set.id;
        this.title = set.title;
        this.description = set.description;
        this.visibility = set.visibility;
        this.$bvModal.hide(this.setFormModalId);
      }
    },

    head() {
      return {
        title: this.displayTitle.values[0]
      };
    }
  };
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/variables.scss';
  @import '../../assets/scss/icons.scss';

  .usergallery-description {
    color: $mediumgrey;
  }

  .usergallery-metadata {
    font-size: 0.9rem;
    font-weight: 600;
    height: 1.6rem;
    vertical-align: middle;
    .curator {
      &:before {
        @extend .icon-font;
        content: '\e92e';
        font-size: 1.4rem;
        padding-right: 0.2rem;
      }
    }
    .visibility {
      &:before {
        @extend .icon-font;
        content: '\e92d';
        font-size: 1.4rem;
        padding-right: 0.2rem;
      }
    }
  }
  .collection-buttons {
    button {
      &:first-child {
        margin-right: 1rem;
      }
    }
    .text {
      font-weight: 600;
    }
  }

  .recommendations h2 {
    color: $mediumgrey;
    font-size: $font-size-medium;
  }
</style>
