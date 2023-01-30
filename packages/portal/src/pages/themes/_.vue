<template>
  <div
    data-qa="theme page"
    class="page white-page gridless-container responsive-font"
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
      :status-code="$fetchState.error.statusCode"
    />
    <template
      v-else
    >
      <ContentHeader
        :title="name"
        :description="description"
        :media-url="shareMediaUrl"
        button-variant="secondary"
      />
      <div class="divider" />
      <client-only>
        <EntityBadges
          v-if="relatedTopics"
          :title="relatedTopics.headline"
          :entity-uris="relatedTopics.hasPart"
          class="ml-4 mb-5"
        />
        <EntityCardGroup
          v-if="relatedPersons"
          :title="relatedPersons.headline"
          :entity-uris="relatedPersons.hasPart"
          card-variant="mini"
          class="mb-5 mb-sm-4"
          card-group-class="gridless-browse-cards"
        />
        <SetCardGroup
          v-if="relatedGalleries"
          :title="relatedGalleries.headline"
          :set-uris="relatedGalleries.hasPart"
          class="mb-5 mb-sm-4"
          card-group-class="gridless-browse-cards"
        />
        <CallToActionBanner
          v-if="callToAction"
          :name="callToAction.name"
          :text="callToAction.text"
          :link="callToAction.relatedLink"
          :illustration="callToAction.image"
          class="mb-5"
        />
        <RelatedEditorial
          v-if="entityUri"
          :entity-uri="entityUri"
          :card-wrapper="false"
          :limit="6"
          class="mb-5 mb-sm-4"
        />
        <section
          v-if="dailySetOfCuratedItems"
          class="mb-5"
        >
          <h2>{{ curatedItems.headline }}</h2>
          <ItemPreviewCardGroup
            :items="dailySetOfCuratedItems"
            view="grid"
          />
          <SmartLink
            v-if="curatedItems.moreButton"
            :destination="curatedItems.moreButton.url"
            class="btn btn-outline-secondary"
          >
            {{ curatedItems.moreButton.text }}
          </SmartLink>
        </section>
      </client-only>
    </template>
  </div>
</template>

<script>
  import createHttpError from 'http-errors';
  import ContentHeader from '@/components/generic/ContentHeader';
  import pageMetaMixin from '@/mixins/pageMeta';
  import LoadingSpinner from '@/components/generic/LoadingSpinner';
  import { themeEntityUri } from '@/plugins/europeana/themes.js';
  import { daily } from '@/plugins/europeana/utils.js';

  export default {
    name: 'ThemePage',

    components: {
      ContentHeader,
      CallToActionBanner: () => import('@/components/generic/CallToActionBanner'),
      EntityBadges: () => import('@/components/entity/EntityBadges'),
      EntityCardGroup: () => import('@/components/entity/EntityCardGroup'),
      ItemPreviewCardGroup: () => import('@/components/item/ItemPreviewCardGroup'),
      RelatedEditorial: () => import('@/components/related/RelatedEditorial'),
      SetCardGroup: () => import('@/components/set/SetCardGroup'),
      SmartLink: () => import('@/components/generic/SmartLink'),
      ErrorMessage: () => import('@/components/generic/ErrorMessage'),
      LoadingSpinner
    },

    mixins: [pageMetaMixin],

    data() {
      return {
        name: '',
        entityUri: null,
        description: null,
        primaryImageOfPage: null,
        hasPartCollection: null
      };
    },

    async fetch() {
      const variables = {
        locale: this.$i18n.isoLocale(),
        identifier: this.$route.params.pathMatch,
        preview: this.$route.query.mode === 'preview'
      };

      try {
        const response = await this.$contentful.query('themePage', variables);
        const theme = response.data.data.themePage?.items?.[0];

        if (theme?.identifier) {
          this.name = theme.name;
          this.entityUri = themeEntityUri(theme.identifier);
          this.description = theme.description;
          this.primaryImageOfPage = theme.primaryImageOfPage;
          this.hasPartCollection = theme.hasPartCollection;
        } else {
          if (process.server) {
            this.$nuxt.context.res.statusCode = 404;
          }
          throw createHttpError(404, this.$t('messages.notFound'));
        }
      } catch (error) {
        if (process.server) {
          this.$nuxt.context.res.statusCode = error.statusCode || 500;
        }
        throw error;
      }
    },

    computed: {
      pageMeta() {
        return {
          title: this.name,
          description: this.description,
          ogType: 'article',
          ogImage: this.primaryImageOfPage?.image?.url,
          ogImageAlt: this.primaryImageOfPage?.image?.description || ''
        };
      },
      shareMediaUrl() {
        return this.primaryImageOfPage?.image?.url;
      },
      sections() {
        return this.hasPartCollection?.items?.length && this.hasPartCollection.items.filter(section => !!section);
      },
      relatedTopics() {
        return this.sections && this.sections.filter(section => section['__typename'] === 'TopicGroup')[0];
      },
      relatedPersons() {
        return this.sections && this.sections.filter(section => section['__typename'] === 'PersonGroup')[0];
      },
      relatedGalleries() {
        return this.sections && this.sections.filter(section => section['__typename'] === 'GalleryGroup')[0];
      },
      callToAction() {
        return this.sections && this.sections.filter(section => section['__typename'] === 'PrimaryCallToAction')[0];
      },
      curatedItems() {
        return this.sections && this.sections.filter(section => section['__typename'] === 'CardGroup')[0];
      },
      curatedItemsEncoding() {
        const items = this.curatedItems?.hasPartCollection?.items?.length && this.curatedItems.hasPartCollection.items.filter(item => !!item);
        const curatedItemsEncoding = items && items.map(items => items.encoding);
        return curatedItemsEncoding;
      },
      dailySetOfCuratedItems() {
        return this.curatedItemsEncoding && daily(this.curatedItemsEncoding, 8);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables';
  @import '@/assets/scss/mixins';

  .page {
    padding-bottom: 1rem;
    padding-top: 1rem;
    margin-top: -1rem;

    ::v-deep header .col {
      margin-bottom: 2.25rem;

      @media (min-width: $bp-small) {
        margin-bottom: 3rem;
      }

      @media (min-width: $bp-xxxl) {
        margin-bottom: 3vw;
      }
      @media (min-width: $bp-large) {
        &.col-lg-9 {
          flex: 0 0 50%;
          max-width: 50%;
        }
      }

      h1 {
        @media (max-width: ($bp-small - 1px)) {
          font-size: $font-size-medium;
          margin-bottom: 0.375rem;
        }
      }

      .description {
        color: $mediumgrey;

        @media (max-width: ($bp-small - 1px)) {
          font-size: $font-size-small;
        }
      }
    }

    ::v-deep h2:not(.related-heading) {
      color: $mediumgrey;
      font-weight: 600;
      font-size: $font-size-medium;

      @media (min-width: $bp-small) {
        font-size: $font-size-large;
      }

      @media (min-width: $bp-xxxl) {
        font-size: $responsive-font-size-large;
      }
    }
  }

  .divider {
    border-bottom: 1px solid $bodygrey;
    margin-bottom: 1.75rem;

    @media (min-width: $bp-xxxl) {
      border-bottom: 0.0625vw solid $bodygrey;
      margin-bottom: 1.75vw;
    }
  }
</style>
