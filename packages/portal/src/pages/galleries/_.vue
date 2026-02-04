<template>
  <div class="page">
    <LoadingSpinner
      v-if="$fetchState.pending"
      class="flex-md-row py-4 text-center"
    />
    <ErrorMessage
      v-else-if="$fetchState.error"
      data-qa="error message container"
      :error="$fetchState.error"
    />
    <div
      v-if="set.id"
      data-qa="user gallery page"
    >
      <b-container class="mb-5">
        <b-row class="mb-2">
          <b-col>
            <div
              class="context-label"
            >
              {{ $tc('galleries.galleries', 1) }}
            </div>
            <h1
              :lang="langAttribute(displayTitle.code)"
            >
              {{ displayTitle.values[0] }}
            </h1>
            <p
              class="usergallery-description mb-3 w-75"
              :lang="langAttribute(displayDescription.code)"
            >
              {{ displayDescription.values[0] }}
            </p>
            <!-- TODO: to avoid showing an empty div + whitespace, the v-if is on the div
                      This can be changed when this functionality is further developed
                  -->
            <div
              v-if="displayMetadata"
              class="usergallery-metadata"
            >
              <span
                v-if="set.creator.nickname"
                class="curator mb-2"
              >
                {{ $t('set.labels.curatedBy') }}
                <img
                  v-if="set.creator.nickname === $config.app.galleries.europeanaAccount"
                  :src="logoSrc"
                  alt="Europeana"
                  width="96"
                  height="20"
                  class="ml-1 logo"
                >
                <template
                  v-else
                >
                  @{{ set.creator.nickname }}
                </template>
              </span>
              <span
                v-if="set.visibility === 'private'"
                class="visibility mb-2"
              >
                <span class="icon-lock" />
                {{ $t('set.labels.private') }}
              </span>
              <span
                v-if="set.visibility === 'published'"
                class="visibility mb-2"
              >
                <span class="icon-ic-download" />
                {{ $t('set.labels.published') }}
              </span>
            </div>
          </b-col>
        </b-row>
        <div class="d-inline-flex flex-wrap collection-buttons">
          <template v-if="set.visibility !== 'private'">
            <ShareButton
              class="mr-2 mt-2"
            />
            <ShareSocialModal
              :media-url="shareMediaUrl"
              :share-to="[{
                identifier: 'weavex',
                name: 'WEAVEx',
                url: weaveUrl,
                tooltip: $t('set.shareTo.weavex.tooltip')
              }]"
            />
          </template>
          <template
            v-if="userCanEditSet"
          >
            <b-button
              class="d-inline-flex align-items-center mr-2 mt-2"
              data-qa="edit set button"
              @click="$bvModal.show(setFormModalId)"
            >
              <span class="icon-edit pr-1" />
              {{ $t('actions.edit') }}
            </b-button>
            <SetFormModal
              :set-id="set.id"
              :modal-id="setFormModalId"
              :title="set.title"
              :description="set.description"
              :visibility="set.visibility"
              :user-is-owner="userIsOwner"
              :type="set.type"
            />
          </template>
          <SetPublicationRequestWidget
            v-if="userCanRequestSetPublication"
            :set="set"
            data-qa="set request publication button"
            class="mr-2 mt-2"
          />
          <SetPublishButton
            v-if="userCanPublishSet"
            :set-id="set.id"
            :visibility="set.visibility"
            class="mr-2 mt-2"
          />
        </div>
      </b-container>
      <ItemPreviewInterface
        :items="set.items"
        :loading="$fetchState.pending"
        :per-page="perPage"
        :total="set.total"
        :show-pins="setIsEntityBestItems && userIsEntityEditor"
        :user-editable-items="userCanEditSet"
        @endItemDrag="repositionItem"
      >
        <template #footer>
          <client-only>
            <SetRecommendations
              v-if="displayRecommendations"
              :identifier="`/${setId}`"
              :type="set.type"
            />
          </client-only>
        </template>
      </ItemPreviewInterface>
    </div>
  </div>
</template>

<script>
  import { langMapValueForLocale } from '@europeana/i18n';
  import ClientOnly from 'vue-client-only';
  import { computed } from 'vue';
  import ItemPreviewInterface from '@/components/item/ItemPreviewInterface';
  import ShareButton from '@/components/share/ShareButton.vue';
  import ShareSocialModal from '@/components/share/ShareSocialModal.vue';
  import useScrollTo from '@/composables/scrollTo.js';
  import { useSelectedItems } from '@/composables/selectedItems.js';
  import entityBestItemsSetMixin from '@/mixins/europeana/entities/entityBestItemsSet';
  import langAttributeMixin from '@/mixins/langAttribute';
  import pageMetaMixin from '@/mixins/pageMeta';
  import redirectToMixin from '@/mixins/redirectTo';

  export default {
    name: 'GalleryPage',
    components: {
      ClientOnly,
      ErrorMessage: () => import('@/components/error/ErrorMessage'),
      ItemPreviewInterface,
      LoadingSpinner: () => import('@/components/generic/LoadingSpinner'),
      SetFormModal: () => import('@/components/set/SetFormModal'),
      SetPublicationRequestWidget: () => import('@/components/set/SetPublicationRequestWidget'),
      SetPublishButton: () => import('@/components/set/SetPublishButton'),
      SetRecommendations: () => import('@/components/set/SetRecommendations'),
      ShareButton,
      ShareSocialModal

    },
    mixins: [
      entityBestItemsSetMixin,
      langAttributeMixin,
      redirectToMixin,
      pageMetaMixin
    ],
    provide() {
      return {
        currentSet: computed(() => this.set),
        fetchCurrentSet: this.fetchSet
      };
    },
    beforeRouteLeave(_to, _from, next) {
      this.$store.commit('set/setActiveRecommendations', []);
      this.$store.commit('entity/setPinned', []);
      this.$store.commit('entity/setBestItemsSetId', null);
      this.clearSelectedItems();
      next();
    },
    setup() {
      const { scrollToSelector } = useScrollTo();
      const { clear: clearSelectedItems } = useSelectedItems();
      return { clearSelectedItems, scrollToSelector };
    },
    data() {
      return {
        logoSrc: require('@europeana/style/img/logo.svg'),
        identifier: null,
        perPage: 48,
        set: {},
        title: '',
        rawDescription: ''
      };
    },
    async fetch() {
      // NOTE: this helps prevent lazy-loading issues when paginating in Chrome 103
      await this.$nextTick();
      process.client && this.scrollToSelector('#header');

      try {
        this.validateRoute();
        await this.fetchSet();
        this.redirectToPrefPath(this.setId, this.set.title.en);

        if (this.setIsEntityBestItems && this.userIsEntityEditor) {
          this.$store.commit('entity/setBestItemsSetId', this.setId);
          this.storeEntityBestItemsSetPinnedItems(this.set);
        }
      } catch (e) {
        this.$error(e, { scope: 'gallery' });
      }
    },
    computed: {
      page() {
        return Number(this.$route.query.page || 1);
      },
      pageMeta() {
        return {
          title: this.displayTitle.values[0],
          description: this.displayDescription?.values?.[0],
          ogType: 'article',
          ogImage: this.shareMediaUrl
        };
      },
      setId() {
        return this.$route.params.pathMatch.split('-')[0];
      },
      setFormModalId() {
        return `set-form-modal-${this.setId}`;
      },
      setCreatorId() {
        return this.set.creator && typeof this.set.creator === 'string' ? this.set.creator : this.set.creator.id;
      },
      userIsOwner() {
        return this.$auth.loggedIn && this.$auth.user &&
          this.setCreatorId?.endsWith(`/${this.$auth.user.sub}`);
      },
      userIsEntityEditor() {
        return this.$auth.userHasClientRole('entities', 'editor') &&
          this.$auth.userHasClientRole('usersets', 'editor');
      },
      userIsPublisher() {
        return this.$auth.userHasClientRole('usersets', 'publisher');
      },
      userCanHandleRecommendations() {
        return this.userIsOwner || (this.setIsEntityBestItems && this.userIsEntityEditor);
      },
      userCanEditSet() {
        return this.userIsOwner || (this.userIsPublisher && this.set.visibility === 'published');
      },
      userCanRequestSetPublication() {
        return this.userIsOwner && this.set.visibility === 'public';
      },
      userCanPublishSet() {
        return this.userIsPublisher &&
          (this.set.type === 'Collection') &&
          (this.set.visibility !== 'private');
      },
      setIsEntityBestItems() {
        return this.set.type === 'EntityBestItemsSet';
      },
      displayRecommendations() {
        return this.enableRecommendations && this.$auth.loggedIn && this.userCanHandleRecommendations;
      },
      enableRecommendations() {
        if (!this.$features.showSetRecommendations) {
          return false;
        }
        if (this.setIsEntityBestItems) {
          return this.$features.acceptEntityRecommendations ||
            this.$features.rejectEntityRecommendations;
        }
        return true;
      },
      displayTitle() {
        return langMapValueForLocale(this.set.title, this.$i18n.locale);
      },
      displayDescription() {
        return langMapValueForLocale(this.set.description, this.$i18n.locale);
      },
      shareMediaUrl() {
        return this.$apis.thumbnail.edmPreview(this.set?.items?.[0]?.edmPreview?.[0], { size: 400 });
      },
      displayMetadata() {
        return ['private', 'published'].includes(this.set.visibility) || this.set.creator?.nickname;
      },
      weaveUrl() {
        return `https://experience.weave-culture.eu/import/europeana/set/${this.setId}`;
      }
    },

    watch: {
      '$store.state.entity.pinned.length'() {
        if (this.setIsEntityBestItems) {
          this.$fetch();
        }
      },
      async '$route.query.page'() {
        await this.$fetch();
        this.clearSelectedItems();
      }
    },

    mounted() {
      this.$redrawVueMasonry?.();
    },

    methods: {
      async fetchSet() {
        const responses = await Promise.all([
          this.$apis.set.get(this.setId),
          this.$apis.set.getItems(this.setId, {
            page: this.page,
            pageSize: this.perPage
          })
        ]);

        this.set = {
          ...responses[0],
          items: responses[1]
        };

        if ((this.$store.state.set.selectedItems || []).length > 0) {
          this.$store.dispatch('set/refreshSelected');
        }
      },
      validateRoute() {
        if (!/^\d+(-.+)?$/.test(this.$route.params.pathMatch)) {
          this.$error(404, { scope: 'page' });
        }
      },
      async repositionItem({ itemId, position }) {
        try {
          await this.$apis.set.repositionItem(this.setId, itemId, position);
        } catch (e) {
          this.$error(e, { scope: 'gallery' });
        } finally {
          // always re-fetch in case of failure e.g. write lock, so moved items
          // go back where they were
          await this.fetchSet();
          this.$redrawVueMasonry?.();
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/icon-font';
  @import '@europeana/style/scss/masonry';

  .usergallery-description {
    color: $darkgrey;
  }

  .usergallery-metadata {
    font-size: $font-size-small;
    font-weight: 600;
    line-height: 1.125;
    color: $darkgrey;

    img.logo {
      height: 1.25rem;
      width: auto;
    }

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
      .icon-lock,
      .icon-ic-download {
        font-size: 1.125rem;
      }

      .icon-lock {
        padding-right: 0.2rem;
      }

      .icon-ic-download {
        transform: rotate(180deg);
        padding-left: 0.2rem;
      }
    }
  }

  .collection-buttons {
    .text {
      font-weight: 600;
    }
  }

  ::v-deep .card-group-list.card-columns {
    column-count: 1;
  }
</style>
