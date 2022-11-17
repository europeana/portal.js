<template>
  <div
    :class="$fetchState.error && 'white-page'"
  >
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
    <ErrorMessage
      v-else-if="$fetchState.error"
      data-qa="error message container"
      :error="$fetchState.error.message"
      :title-path="$fetchState.error.titlePath"
      :description-path="$fetchState.error.descriptionPath"
      :illustration-src="$fetchState.error.illustrationSrc"
    />
    <b-container
      v-else-if="!setGalleriesEnabled"
    >
      <ContentWarningModal
        v-if="contentWarning"
        :title="contentWarning.name"
        :description="contentWarning.description"
        :page-slug="`galleries/${identifier}`"
      />
      <ContentHeader
        :title="title"
        :description="htmlDescription"
        :media-url="shareMediaUrl"
        :context-label="$tc('galleries.galleries', 1)"
      />
      <b-row class="flex-md-row pb-5">
        <b-col cols="12">
          <div
            v-masonry
            transition-duration="0"
            item-selector=".card"
            horizontal-order="true"
            column-width=".masonry-container .card"
            class="masonry-container"
            data-qa="gallery images"
          >
            <ContentCard
              v-for="image in images"
              :key="image.identifier"
              v-masonry-tile
              :title="imageTitle(image)"
              :image-url="imageUrl(image)"
              :lazy="false"
              :url="{ name: 'item-all', params: { pathMatch: image.identifier.slice(1) } }"
            />
          </div>
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
                    class="d-inline-flex align-items-center mr-2"
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
                  />
                </template>
                <ShareButton />
                <SocialShareModal :media-url="shareMediaUrl" />
                <PublishSetButton
                  v-if="set.visibility !== 'private' && userIsPublisher"
                  :set-id="set.id"
                  :visibility="set.visibility"
                />
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
                    :draggable-items="userIsOwner"
                    @endItemDrag="reorderItems"
                  />
                </b-col>
              </b-row>
            </b-container>
          </b-col>
        </b-row>
        <client-only>
          <SetRecommendations
            v-if="displayRecommendations"
            :identifier="`/${setId}`"
            :type="set.type"
          />
        </client-only>
      </b-container>
    </div>
  </div>
</template>

<script>
  import ClientOnly from 'vue-client-only';
  import createHttpError from 'http-errors';
  import {
    ITEM_URL_PREFIX as EUROPEANA_DATA_URL_ITEM_PREFIX,
    SET_URL_PREFIX as EUROPEANA_DATA_URL_SET_PREFIX
  } from '@/plugins/europeana/data';
  import { langMapValueForLocale } from  '@/plugins/europeana/utils';
  import ItemPreviewCardGroup from '@/components/item/ItemPreviewCardGroup';
  import ShareButton from '@/components/sharing/ShareButton.vue';
  import SocialShareModal from '@/components/sharing/SocialShareModal.vue';
  import redirectToPrefPathMixin from '@/mixins/redirectToPrefPath';

  // TODO: the following imports are only needed for contentful Galleries.
  import ContentHeader from '../../components/generic/ContentHeader';
  import { marked } from 'marked';
  import stripMarkdown from '@/mixins/stripMarkdown';

  export default {
    name: 'GalleryPage',
    components: {
      ClientOnly,
      LoadingSpinner: () => import('@/components/generic/LoadingSpinner'),
      ErrorMessage: () => import('@/components/generic/ErrorMessage'),
      ItemPreviewCardGroup,
      ShareButton,
      SocialShareModal,
      SetFormModal: () => import('@/components/set/SetFormModal'),
      SetRecommendations: () => import('@/components/set/SetRecommendations'),
      // TODO: The following components are only used in contentful galleries
      ContentHeader,
      ContentCard: () => import('../../components/generic/ContentCard'),
      ContentWarningModal: () => import('@/components/generic/ContentWarningModal'),
      PublishSetButton: () => import('@/components/set/PublishSetButton')

    },
    mixins: [
      redirectToPrefPathMixin,
      // TODO: markdown is only used in contentful galleries
      stripMarkdown

    ],
    async beforeRouteLeave(_to, _from, next) {
      if (this.setGalleriesEnabled) {
        await this.$store.commit('set/setActive', null);
        await this.$store.commit('set/setActiveRecommendations', []);
        await this.$store.commit('entity/setFeaturedSetId', null);
        await this.$store.commit('entity/setPinned', []);
      }
      next();
    },
    data() {
      return {
        identifier: null,
        images: [],
        title: '',
        rawDescription: '',
        contentWarning: null
      };
    },
    async fetch() {
      if (this.setGalleriesEnabled) {
        try {
          this.validateRoute();
          await this.$store.dispatch('set/fetchActive', this.setId);
          this.redirectToPrefPath('galleries-all', this.setId, this.set.title.en);
          if (this.setIsEntityBestItems && this.userIsEntityEditor) {
            await this.$store.commit('entity/setFeaturedSetId', this.setId);
            await this.$store.dispatch('entity/getPins');
          }
        } catch (error) {
          this.handleFetchError(error);
        }
      } else {
        await this.fetchContentfulGallery();
      }
    },
    head() {
      return {
        title: this.$pageHeadTitle(this.displayTitle.values[0]),
        meta: [
          { hid: 'title', name: 'title', content: this.displayTitle.values[0] },
          { hid: 'og:title', property: 'og:title', content: this.displayTitle.values[0] },
          { hid: 'og:image', property: 'og:image', content: this.shareMediaUrl },
          { hid: 'og:type', property: 'og:type', content: 'article' }
        ]
          .concat(this.displayDescription && this.displayDescription.values[0] ? [
            { hid: 'description', name: 'description', content: this.displayDescription.values[0] },
            { hid: 'og:description', property: 'og:description', content: this.displayDescription.values[0] }
          ] : [])
      };
    },
    computed: {
      setGalleriesEnabled() {
        return this.$features.setGalleries;
      },
      set() {
        return this.$store.state.set.active || {};
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
      userIsPublisher() {
        const user = this.$store.state.auth.user;
        const publisher = user?.resource_access?.usersets?.roles?.includes('publisher');
        return !!publisher;
      },
      userCanEdit() {
        return this.userIsOwner || (this.setIsEntityBestItems && this.userIsEntityEditor);
      },
      setIsEntityBestItems() {
        return this.set.type === 'EntityBestItemsSet';
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
      displayTitle() {
        if (this.$fetchState.error) {
          return { values: [this.$t(this.$fetchState.error.metaTitlePath || 'error')] };
        }
        // TODO: remove contentful gallery fallback
        if (this.setGalleriesEnabled) {
          return langMapValueForLocale(this.set.title, this.$i18n.locale);
        }
        return { values: [this.title] };
      },
      displayDescription() {
        // TODO: remove contentful gallery fallback
        if (this.setGalleriesEnabled) {
          return langMapValueForLocale(this.set.description, this.$i18n.locale);
        }
        return { values: [this.description] };
      },
      shareMediaUrl() {
        // TODO: remove contentful gallery fallback
        if (this.setGalleriesEnabled) {
          return this.$apis.thumbnail.edmPreview(this.set?.items?.[0]?.edmPreview?.[0], { size: 400 });
        }
        return this.images.length === 0 ? null : this.imageUrl(this.images[0]);
      },
      // TODO: description & htmlDescription are only used for contentful galleries.
      description() {
        return this.stripMarkdown(this.rawDescription);
      },
      htmlDescription() {
        return marked.parse(this.rawDescription);
      }
    },

    mounted() {
      if (typeof this.$redrawVueMasonry === 'function') {
        this.$redrawVueMasonry();
      }
    },

    methods: {
      validateRoute() {
        if (!/^\d+(-.+)?$/.test(this.$route.params.pathMatch)) {
          throw createHttpError(400, 'Invalid set ID');
        }
      },
      reorderItems(items) {
        this.$store.dispatch('set/update', {
          id: `${EUROPEANA_DATA_URL_SET_PREFIX}/${this.setId}`,
          body: {
            type: this.set.type,
            title: this.set.title,
            description: this.set.description,
            visibility: this.set.visibility,
            items: items.map(item => `${EUROPEANA_DATA_URL_ITEM_PREFIX}${item.id}`)
          },
          params: { profile: 'standard' }
        });
      },
      async fetchContentfulGallery() {
        // TODO: Remove this method, when using set driven galleries.
        const variables = {
          identifier: this.$route.params.pathMatch,
          locale: this.$i18n.isoLocale(),
          preview: this.$route.query.mode === 'preview'
        };

        await this.$contentful.query('galleryPage', variables)
          .then(response => response.data.data)
          .then(data => {
            if (data.imageGalleryCollection.items.length === 0) {
              const error = new Error(this.$t('messages.notFound'));
              error.statusCode = 404;
              error.titlePath = 'errorMessage.pageNotFound.title';
              error.metaTitlePath = 'errorMessage.pageNotFound.metaTitle';
              error.illustrationSrc = require('@/assets/img/illustrations/il-page-not-found.svg');
              throw error;
            }

            const gallery = data.imageGalleryCollection.items[0];

            this.contentWarning = gallery.contentWarning;
            this.identifier = variables.identifier;
            this.images = gallery.hasPartCollection.items.filter(image => image !== null);
            this.rawDescription = gallery.description;
            this.title = gallery.name;
          })
          .catch((e) => {
            throw e;
          });
      },
      imageTitle(data) {
        if (data.encoding) {
          return data.encoding.dcTitleLangAware || data.encoding.dcDescriptionLangAware || this.$t('record.record');
        }
        return data.name;
      },
      imageUrl(data) {
        const edmPreview = data.encoding?.edmPreview?.[0] || data.thumbnailUrl;
        return this.$apis.thumbnail.edmPreview(edmPreview, { size: 400 });
      },
      handleFetchError(error) {
        if (process.server) {
          this.$nuxt.context.res.statusCode = error.statusCode || 500;
        }
        if (error.statusCode === 403 || error.statusCode === 401) {
          error.titlePath = 'errorMessage.galleryUnauthorised.title';
          error.descriptionPath = 'errorMessage.galleryUnauthorised.description';
          error.metaTitlePath = 'errorMessage.galleryUnauthorised.metaTitle';
          error.illustrationSrc = require('@/assets/img/illustrations/il-gallery-unauthorised.svg');
        }
        if (error.statusCode === 404) {
          error.titlePath = 'errorMessage.pageNotFound.title';
          error.metaTitlePath = 'errorMessage.pageNotFound.metaTitle';
          error.illustrationSrc = require('@/assets/img/illustrations/il-page-not-found.svg');
        }
        throw error;
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables';
  @import '@/assets/scss/icons';
  @import '@/assets/scss/masonry';

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
