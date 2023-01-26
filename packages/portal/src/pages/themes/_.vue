<template>
  <div
    data-qa="theme page"
    class="page white-page gridless-container responsive-font"
  >
    <ContentHeader
      :title="name"
      :description="description"
      :media-url="shareMediaUrl"
      button-variant="secondary"
    />
    <div class="divider" />
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
      v-if="curatedItems"
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
  </div>
</template>

<script>
  import ContentHeader from '@/components/generic/ContentHeader';
  import pageMetaMixin from '@/mixins/pageMeta';
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
      SmartLink: () => import('@/components/generic/SmartLink')
    },

    mixins: [pageMetaMixin],

    async asyncData({ params, query, error, app }) {
      const variables = {
        locale: app.i18n.isoLocale(),
        identifier: params.pathMatch,
        preview: query.mode === 'preview'
      };

      try {
        const response = await app.$contentful.query('themePage', variables);
        const theme = response.data.data.themePage.items[0];

        return theme;
      } catch (e) {
        error({ statusCode: 500, message: e.toString() });
      }
    },

    data() {
      return {
        name: '',
        entityUri: null,
        description: null,
        primaryImageOfPage: null,
        hasPartCollection: null
      };
    },

    computed: {
      pageMeta() {
        return {
          title: this.name,
          description: this.description,
          ogType: 'article'
        };
      },
      shareMediaUrl() {
        return this.primaryImageOfPage?.image?.url;
      },
      relatedTopics() {
        return this.hasPartCollection?.items?.filter(section => section['__typename'] === 'TopicGroup')[0];
      },
      relatedPersons() {
        return this.hasPartCollection?.items?.filter(section => section['__typename'] === 'PersonGroup')[0];
      },
      relatedGalleries() {
        return this.hasPartCollection?.items?.filter(section => section['__typename'] === 'GalleryGroup')[0];
      },
      callToAction() {
        return this.hasPartCollection?.items?.filter(section => section['__typename'] === 'PrimaryCallToAction')[0];
      },
      curatedItems() {
        return this.hasPartCollection?.items?.filter(section => section['__typename'] === 'CardGroup')[0];
      },
      curatedItemsEncoding() {
        return this.curatedItems?.hasPartCollection?.items?.map(items => items.encoding);
      },
      dailySetOfCuratedItems() {
        return daily(this.curatedItemsEncoding, 8);
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
      margin-bottom: 3rem;

      @media (min-width: $bp-xxxl) {
        margin-bottom: 3vw;
      }
    }

    ::v-deep h2:not(.related-heading) {
      color: $mediumgrey;
      font-size: $font-size-large;
      font-weight: 600;

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
