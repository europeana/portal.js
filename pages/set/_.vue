<template>
  <b-container v-if="$fetchState.pending">
    <b-row class="flex-md-row py-4 text-center">
      <b-col cols="12">
        <LoadingSpinner />
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
    v-else-if="set.id"
    class="mt-n3"
    data-qa="user gallery page"
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
                  v-if="set.visibility === 'private'"
                  class="usergallery-metadata"
                >
                  <!-- TODO: Fill after the '@' with the set's owner  -->
                  <!-- <span class="curator mr-4">
                    {{ $t('set.labels.curatedBy') }} @placeholderUsername
                  </span>-->
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
                  :set-id="set.id"
                  :modal-id="setFormModalId"
                  :title="set.title"
                  :description="set.description"
                  :visibility="set.visibility"
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
    <b-container
      class="mb-3"
      data-qa="user set"
    >
      <b-row>
        <b-col>
          <h2
            class="related-heading text-uppercase"
            data-qa="item count"
          >
            {{ displayItemCount }}
          </h2>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-container class="px-0">
            <b-row class="mb-3">
              <b-col cols="12">
                <ItemPreviewCardGroup
                  v-model="set.items"
                />
              </b-col>
            </b-row>
          </b-container>
        </b-col>
      </b-row>
      <b-row
        v-if="recommendations.length > 0"
        class="recommendations"
      >
        <b-col>
          <h2 class="related-heading">
            {{ $t('items.youMightLike') }}
          </h2>
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

  export default {
    components: {
      LoadingSpinner,
      AlertMessage,
      ItemPreviewCardGroup,
      SetFormModal: () => import('../../components/set/SetFormModal')
    },
    async beforeRouteLeave(to, from, next) {
      await this.$store.commit('set/setActive', null);
      next();
    },

    middleware: 'sanitisePageQuery',

    data() {
      return {
        recommendations: [],
        setFormModalId: `set-form-modal-${this.id}`
      };
    },

    async fetch() {
      try {
        await this.$store.dispatch('set/fetchActive', this.$route.params.pathMatch);
      } catch (apiError) {
        if (process.server) {
          this.$nuxt.context.res.statusCode = apiError.statusCode;
        }
        throw apiError;
      }
    },

    head() {
      return {
        title: this.$pageHeadTitle(this.displayTitle.values[0])
      };
    },

    computed: {
      set() {
        return this.$store.state.set.active || {};
      },
      itemCount() {
        return this.set.total || 0;
      },
      userIsOwner() {
        return this.$store.state.auth.user &&
          this.set.creator &&
          this.set.creator.endsWith(`/${this.$store.state.auth.user.sub}`);
      },
      displayTitle() {
        if (this.$fetchState.error) return { values: [this.$t('error')] };
        return langMapValueForLocale(this.set.title, this.$i18n.locale);
      },
      displayDescription() {
        return langMapValueForLocale(this.set.description, this.$i18n.locale);
      },
      enableRecommendations() {
        return Boolean(Number(process.env.ENABLE_RECOMMENDATIONS));
      },
      displayItemCount() {
        const max = 100;
        const label = this.set.total > max ? 'items.itemOf' : 'items.itemCount';
        return this.$tc(label, this.set.total, { max });
      }
    },

    watch: {
      'set'() {
        if (this.set === 'DELETED') {
          // Set was deleted
          const path = this.$path({ name: 'account' });
          this.$goto(path);
        }
      },
      'set.total'() {
        this.getRecommendations();
      }
    },

    mounted() {
      this.getRecommendations();
    },

    methods: {
      updateSet() {
        this.$bvModal.hide(this.setFormModalId);
      },
      getRecommendations() {
        if (this.enableRecommendations && this.$auth.loggedIn) {
          if (this.set && this.set.total >= 0) {
            return this.$recommendations.recommend('set', `/${this.$route.params.pathMatch}`)
              .then(recommendResponse => {
                this.recommendations = recommendResponse.items || [];
              });
          } else {
            return this.recommendations = [];
          }
        }
      }
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
    font-size: $font-size-small;
    line-height: 1.125;

    .curator,
    .visibility {
      display: inline-flex;
      align-items: center;

      &:before {
        font-size: 1.5rem;
        padding-right: 0.2rem;
      }
    }

    .curator {
      margin-right: 1.5rem;
      &:before {
        @extend .icon-font;
        content: '\e92e';
      }
    }

    .visibility {
      &:before {
        @extend .icon-font;
        content: '\e92d';
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
