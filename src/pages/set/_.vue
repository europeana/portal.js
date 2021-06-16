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
            <b-row class="mb-4">
              <b-col>
                <div
                  class="context-label"
                >
                  {{ this.$tc('galleries.galleries', 1) }}
                </div>
                <h1
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
                  v-if="set.visibility === 'private' || set.creator.nickname"
                  class="usergallery-metadata mb-2"
                >
                  <span
                    v-if="set.creator.nickname"
                    class="curator mb-2"
                  >
                    {{ $t('set.labels.curatedBy') }} @{{ set.creator.nickname }}
                  </span>
                  <span
                    v-if="set.visibility === 'private'"
                    class="
                    visibility mb-2"
                  >
                    {{ $t('set.labels.private') }}
                  </span>
                </div>
              </b-col>
            </b-row>
            <div class="d-inline-flex collection-buttons">
              <template
                v-if="userIsOwner"
              >
                <b-button
                  variant="outline-primary"
                  class="text-decoration-none mr-2"
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
              <b-button
                v-b-modal.shareModal
                variant="outline-primary"
                class="text-decoration-none"
              >
                {{ $t('actions.share') }}
              </b-button>
              <SocialShareModal :media-url="shareMediaUrl" />
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
  import { genericThumbnail } from '../../plugins/europeana/thumbnail';

  import AlertMessage from '../../components/generic/AlertMessage';
  import ItemPreviewCardGroup from '../../components/item/ItemPreviewCardGroup';
  import LoadingSpinner from '../../components/generic/LoadingSpinner';
  import SocialShareModal from '../../components/sharing/SocialShareModal.vue';

  export default {
    components: {
      LoadingSpinner,
      AlertMessage,
      ItemPreviewCardGroup,
      SocialShareModal,
      SetFormModal: () => import('../../components/set/SetFormModal')
    },

    middleware: 'sanitisePageQuery',

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

    data() {
      return {
        recommendations: [],
        setFormModalId: `set-form-modal-${this.id}`
      };
    },

    computed: {
      set() {
        return this.$store.state.set.active || {};
      },
      itemCount() {
        return this.set.total || 0;
      },
      setCreatorId() {
        if (this.set.creator) {
          return typeof this.set.creator === 'string' ? this.set.creator : this.set.creator.id;
        } else {
          return null;
        }
      },
      userIsOwner() {
        return this.$store.state.auth.user &&
          this.setCreatorId &&
          this.setCreatorId.endsWith(`/${this.$store.state.auth.user.sub}`);
      },
      displayTitle() {
        if (this.$fetchState.error) {
          return { values: [this.$t('error')] };
        }
        return langMapValueForLocale(this.set.title, this.$i18n.locale);
      },
      displayDescription() {
        return langMapValueForLocale(this.set.description, this.$i18n.locale);
      },
      enableRecommendations() {
        return this.$config.app.features.recommendations;
      },
      displayItemCount() {
        const max = 100;
        const label = this.set.total > max ? 'items.itemOf' : 'items.itemCount';
        return this.$tc(label, this.set.total, { max });
      },
      shareMediaUrl() {
        if (!this.set.items || (this.set.items.length === 0)) {
          return null;
        } else {
          return this.set.items[0].edmPreview ?
            `${this.set.items[0].edmPreview[0]}&size=w400` :
            genericThumbnail(this.set.items[0].id, { type: this.set.items[0].type, size: 'w400' });
        }
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
            return this.$apis.recommendation.recommend('set', `/${this.$route.params.pathMatch}`)
              .then(recommendResponse => {
                this.recommendations = recommendResponse.items || [];
              });
          } else {
            return this.recommendations = [];
          }
        }
      }
    },

    head() {
      return {
        title: this.$pageHeadTitle(this.displayTitle.values[0]),
        meta: [
          { hid: 'title', name: 'title', content: this.displayTitle.values[0] },
          { hid: 'og:title', property: 'og:title', content: (this.displayTitle.values[0]) },
          { hid: 'og:image', property: 'og:image', content: this.shareMediaUrl },
          { hid: 'og:type', property: 'og:type', content: 'article' }
        ]
          .concat(this.displayDescription ? [
            { hid: 'description', name: 'description', content: this.displayDescription.values[0]  },
            { hid: 'og:description', property: 'og:description', content: this.displayDescription.values[0]  }
          ] : [])
      };
    },
    async beforeRouteLeave(to, from, next) {
      await this.$store.commit('set/setActive', null);
      next();
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
    font-weight: 600;
    line-height: 1.125;
    color: $mediumgrey;

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
        font-size: 1.125rem;
      }
    }

    .visibility {
      &:before {
        @extend .icon-font;
        content: '\e92d';
        font-size: 1.125rem;
      }
    }
  }

  .collection-buttons {
    .text {
      font-weight: 600;
    }
  }

  .recommendations h2 {
    color: $mediumgrey;
    font-size: $font-size-medium;
  }
</style>
