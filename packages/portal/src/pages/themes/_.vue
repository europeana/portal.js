<template>
  <div
    data-qa="theme page"
    class="page xxl-page"
  >
    <LoadingSpinner
      v-if="$fetchState.pending"
      class="flex-md-row py-4 text-center"
    />
    <ErrorMessage
      v-else-if="$fetchState.error"
      data-qa="error message container"
      :error="$fetchState.error"
      :show-message="false"
    />
    <b-container
      v-else
    >
      <ContentHeader
        :title="name"
        :description="description"
        :media-url="pageMetaOgImage"
        button-variant="secondary"
        class="half-col"
      />
      <client-only>
        <transition
          appear
          name="fade"
        >
          <div
            v-show="mayShowSection('relatedTopics')"
          >
            <EntityBadges
              v-if="relatedTopics"
              :title="relatedTopics.headline"
              :entity-uris="relatedTopics.hasPart"
              class="ml-4 mb-5"
              @fetched="handleSectionFetched('relatedTopics')"
            />
          </div>
        </transition>
        <transition
          appear
          name="fade"
        >
          <div
            v-show="mayShowSection('relatedPersons')"
          >
            <EntityCardGroup
              v-if="relatedPersons"
              :title="relatedPersons.headline"
              :entity-uris="relatedPersons.hasPart"
              card-variant="mini"
              class="mb-5 mb-sm-4"
              @fetched="handleSectionFetched('relatedPersons')"
            />
          </div>
        </transition>
        <transition
          appear
          name="fade"
        >
          <div
            v-show="mayShowSection('relatedGalleries')"
          >
            <SetCardGroup
              v-if="relatedGalleries"
              :title="relatedGalleries.headline"
              :set-uris="relatedGalleries.hasPart"
              class="mb-5 mb-sm-4"
              @fetched="handleSectionFetched('relatedGalleries')"
            />
          </div>
        </transition>
        <transition
          appear
          name="fade"
        >
          <div
            v-show="mayShowSection('callToAction')"
          >
            <CallToActionBanner
              v-if="callToAction"
              :name="callToAction.name"
              :name-english="callToAction.nameEN"
              :text="callToAction.text"
              :link="callToAction.relatedLink"
              :illustration="callToAction.image"
              class="mb-5"
            />
          </div>
        </transition>
        <transition
          appear
          name="fade"
        >
          <div
            v-show="mayShowSection('relatedEditorial')"
          >
            <RelatedEditorial
              :theme="identifier"
              :card-wrapper="false"
              :limit="6"
              class="mb-5 mb-sm-4"
              @fetched="handleSectionFetched('relatedEditorial')"
            />
          </div>
        </transition>
        <transition
          appear
          name="fade"
        >
          <div
            v-show="mayShowSection('dailySetOfCuratedItems')"
          >
            <section
              v-if="dailySetOfCuratedItems"
              class="mb-5"
            >
              <h2
                class="card-group-title"
              >
                {{ curatedItems.headline }}
              </h2>
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
        </transition>
      </client-only>
    </b-container>
  </div>
</template>

<script>
  import ClientOnly from 'vue-client-only';

  import ContentHeader from '@/components/content/ContentHeader';
  import LoadingSpinner from '@/components/generic/LoadingSpinner';
  import themePageGraphql from '@/graphql/queries/themePage.graphql';
  import pageMetaMixin from '@/mixins/pageMeta';
  import { daily } from '@/plugins/europeana/utils.js';

  export default {
    name: 'ThemePage',

    components: {
      CallToActionBanner: () => import('@/components/generic/CallToActionBanner'),
      ClientOnly,
      ContentHeader,
      EntityBadges: () => import('@/components/entity/EntityBadges'),
      EntityCardGroup: () => import('@/components/entity/EntityCardGroup'),
      ErrorMessage: () => import('@/components/error/ErrorMessage'),
      ItemPreviewCardGroup: () => import('@/components/item/ItemPreviewCardGroup'),
      LoadingSpinner,
      RelatedEditorial: () => import('@/components/related/RelatedEditorial'),
      SetCardGroup: () => import('@/components/set/SetCardGroup'),
      SmartLink: () => import('@/components/generic/SmartLink')
    },

    mixins: [pageMetaMixin],

    data() {
      return {
        name: '',
        entityUri: null,
        description: null,
        identifier: null,
        primaryImageOfPage: null,
        hasPartCollection: null,
        sectionsFetched: [],
        showAllSections: false
      };
    },

    async fetch() {
      const variables = {
        locale: this.$i18n.localeProperties.iso,
        identifier: this.$route.params.pathMatch,
        preview: this.$route.query.mode === 'preview'
      };

      try {
        const response = await this.$contentful.query(themePageGraphql, variables);
        const theme = response.data.themePage?.items?.[0];

        if (theme?.identifier) {
          this.identifier = theme.identifier;
          this.name = theme.name;
          this.description = theme.description;
          this.primaryImageOfPage = theme.primaryImageOfPage;
          this.hasPartCollection = theme.hasPartCollection;
        } else {
          this.$error(404, { scope: 'page' });
        }
      } catch (error) {
        this.$error(error, { scope: 'page' });
      }
    },

    computed: {
      sectionsToShow() {
        return [
          this.relatedTopics ? 'relatedTopics' : null,
          this.relatedPersons ? 'relatedPersons' : null,
          this.relatedGalleries ? 'relatedGalleries' : null,
          this.callToAction ? 'callToAction' : null,
          'relatedEditorial',
          this.dailySetOfCuratedItems ? 'dailySetOfCuratedItems' : null
        ].filter((section) => !!section);
      },
      sectionsToFetch() {
        return this.sectionsToShow.filter((section) => {
          return ['relatedTopics', 'relatedPersons', 'relatedGalleries', 'relatedEditorial'].includes(section);
        });
      },
      pageMeta() {
        return {
          title: this.name,
          description: this.description,
          ogType: 'article',
          ogImage: this.primaryImageOfPage?.image,
          ogImageAlt: this.primaryImageOfPage?.image?.description || ''
        };
      },
      sections() {
        return this.hasPartCollection?.items?.length && this.hasPartCollection.items.filter(section => !!section);
      },
      relatedTopics() {
        return this.sections?.filter(section => section['__typename'] === 'TopicGroup')[0];
      },
      relatedPersons() {
        return this.sections?.filter(section => section['__typename'] === 'PersonGroup')[0];
      },
      relatedGalleries() {
        return this.sections?.filter(section => section['__typename'] === 'GalleryGroup')[0];
      },
      callToAction() {
        return this.sections?.filter(section => section['__typename'] === 'PrimaryCallToAction')[0];
      },
      curatedItems() {
        return this.sections?.filter(section => section['__typename'] === 'CardGroup')[0];
      },
      curatedItemsEncoding() {
        const items = this.curatedItems?.hasPartCollection?.items?.length && this.curatedItems.hasPartCollection.items.filter(item => !!item);
        const curatedItemsEncoding = items?.map(items => items.encoding);
        return curatedItemsEncoding;
      },
      dailySetOfCuratedItems() {
        return this.curatedItemsEncoding && daily(this.curatedItemsEncoding, 8);
      }
    },

    mounted() {
      setTimeout(() => this.showAllSections = true, 600);
    },

    methods: {
      // A section may only be shown when its content has been fetched, and so
      // has the content of all earlier sections. This prevents e.g. the 3rd
      // section being shown 1st if it's quicker to fetch, then the 1st and 2nd
      // sections being shown causing the 3rd to jump down in the view.
      mayShowSection(candidate) {
        if (this.showAllSections) {
          return true;
        }
        const index = this.sectionsToShow.findIndex((section) => section === candidate);
        return this.sectionsToShow.slice(0, index + 1)
          .filter((section) => this.sectionsToFetch.includes(section))
          .every((section) => this.sectionsFetched.includes(section));
      },
      handleSectionFetched(section) {
        this.sectionsFetched.push(section);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/mixins';
  @import '@europeana/style/scss/transitions';

  .page {
    padding-bottom: 1rem;

    @media (min-width: $bp-4k) {
      padding-bottom: 1.5rem;
    }

    ::v-deep .content-header .divider {
      margin-bottom: 1.75rem;
    }
  }

  .xxl-page ::v-deep .masonry-container {
    margin-left: -$grid-gutter;
    margin-right: -$grid-gutter;
    width: calc(100% + #{$grid-gutter * 2});

    .masonry-tile {
      @media (min-width: $bp-medium) {
        margin-left: $grid-gutter;
        margin-right: $grid-gutter;
        width: calc(100% / 2 - #{$grid-gutter * 2});
      }

      @media (min-width: $bp-large) {
        width: calc(100% / 4 - #{$grid-gutter * 2});
      }

      @media (min-width: $bp-wqhd) {
        width: calc(100% / 6 - #{$grid-gutter * 2});
      }

      @media (min-width: ($bp-4k)) {
        margin-left: $grid-gutter-4k;
        margin-right: $grid-gutter-4k;
        width: calc(100% / 6 - #{$grid-gutter-4k * 2});
      }
    }
  }
</style>
