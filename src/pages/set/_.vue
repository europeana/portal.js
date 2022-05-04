<template>
  <b-container
    v-if="$fetchState.pending"
    data-qa="loading spinner container"
  >
    <b-row class="flex-md-row py-4 text-center">
      <b-col cols="12">
        <LoadingSpinner />
      </b-col>
    </b-row>
  </b-container>
  <b-container
    v-else-if="$fetchState.error"
    data-qa="alert message container"
  >
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
                  {{ $tc('galleries.galleries', 1) }}
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
                  data-qa="edit set button"
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
                />
              </template>
              <b-button
                v-b-modal.share-modal
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
                  :items="set.items"
                  :show-pins="setIsEntityBestItems && userIsEntityEditor"
                />
              </b-col>
            </b-row>
          </b-container>
        </b-col>
      </b-row>
      <client-only>
        <SetRecommendations
          v-if="displayRecommendations"
          :identifier="`/${$route.params.pathMatch}`"
          :type="set.type"
        />
      </client-only>
    </b-container>
  </div>
</template>

<script>
  import ClientOnly from 'vue-client-only';

  import { langMapValueForLocale } from  '@/plugins/europeana/utils';

  import ItemPreviewCardGroup from '@/components/item/ItemPreviewCardGroup';
  import SocialShareModal from '@/components/sharing/SocialShareModal.vue';

  export default {
    name: 'SetPage',

    components: {
      ClientOnly,
      LoadingSpinner: () => import('@/components/generic/LoadingSpinner'),
      AlertMessage: () => import('@/components/generic/AlertMessage'),
      ItemPreviewCardGroup,
      SocialShareModal,
      SetFormModal: () => import('@/components/set/SetFormModal'),
      SetRecommendations: () => import('@/components/set/SetRecommendations')
    },

    async beforeRouteLeave(to, from, next) {
      await this.$store.commit('set/setActive', null);
      await this.$store.commit('set/setActiveRecommendations', []);
      await this.$store.commit('entity/setFeaturedSetId', null);
      await this.$store.commit('entity/setPinned', []);
      next();
    },

    middleware: 'sanitisePageQuery',

    async fetch() {
      await this.$store.dispatch('set/fetchActive', this.setId);

      if (this.setIsEntityBestItems && this.userIsEntityEditor) {
        await this.$store.commit('entity/setFeaturedSetId', this.setId);
        await this.$store.dispatch('entity/getPins');
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
          .concat(this.displayDescription && this.displayDescription.values[0] ? [
            { hid: 'description', name: 'description', content: this.displayDescription.values[0]  },
            { hid: 'og:description', property: 'og:description', content: this.displayDescription.values[0]  }
          ] : [])
      };
    },

    computed: {
      set() {
        return this.$store.state.set.active || {};
      },
      setId() {
        return this.$route.params.pathMatch;
      },
      setFormModalId() {
        return `set-form-modal-${this.setId}`;
      },
      setCreatorId() {
        return this.set.creator && typeof this.set.creator === 'string' ? this.set.creator : this.set.creator.id;
      },
      userIsOwner() {
        return this.$auth.loggedIn && this.$store.state.auth.user &&
          this.setCreatorId &&
          this.setCreatorId.endsWith(`/${this.$store.state.auth.user.sub}`);
      },
      userIsEntityEditor() {
        const user = this.$store.state.auth.user;
        const entitiesEditor = user?.resource_access?.entities?.roles?.includes('editor');
        const usersetsEditor = user?.resource_access?.usersets?.roles?.includes('editor');
        return entitiesEditor && usersetsEditor;
      },
      userCanEdit() {
        return this.userIsOwner || (this.setIsEntityBestItems && this.userIsEntityEditor);
      },
      setIsEntityBestItems() {
        return this.set.type === 'EntityBestItemsSet';
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
      displayRecommendations() {
        return this.enableRecommendations && this.$auth.loggedIn && this.userCanEdit;
      },
      enableRecommendations() {
        if (this.setIsEntityBestItems) {
          return this.$features.acceptEntityRecommendations ||
            this.$features.rejectEntityRecommendations;
        }
        return true;
      },
      displayItemCount() {
        const max = 100;
        const label = this.set.total > max ? 'items.itemOf' : 'items.itemCount';
        return this.$tc(label, this.set.total, { max });
      },
      shareMediaUrl() {
        return this.$apis.thumbnail.edmPreview(this.set?.items?.[0]?.edmPreview?.[0], { size: 400 });
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables';
  @import '@/assets/scss/icons';

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

      &::before {
        font-size: 1.5rem;
        padding-right: 0.2rem;
      }
    }

    .curator {
      margin-right: 1.5rem;

      &::before {
        @extend %icon-font;

        content: '\e92e';
        font-size: 1.125rem;
      }
    }

    .visibility {
      &::before {
        @extend %icon-font;

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
</style>
