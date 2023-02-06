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
              card-group-class="gridless-browse-cards"
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
              card-group-class="gridless-browse-cards"
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
        </transition>
      </client-only>
    </template>
  </div>
</template>

<script>
  import createHttpError from 'http-errors';
  import ContentHeader from '@/components/generic/ContentHeader';
  import pageMetaMixin from '@/mixins/pageMeta';
  import LoadingSpinner from '@/components/generic/LoadingSpinner';
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
        identifier: null,
        primaryImageOfPage: null,
        hasPartCollection: null,
        sectionsFetched: [],
        showAllSections: false
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
          this.identifier = theme.identifier;
          this.name = theme.name;
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

  .fade-enter-active {
    transition: $standard-transition;
    opacity: 0;
  }

  .fade-enter-to {
    opacity: 1;
  }
</style>
