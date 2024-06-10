<template>
  <div>
    <StoryHero
      v-if="enableStoryHero"
      :title="title"
      :subtitle="subtitle"
      :hero-image="heroImage"
      :context-label="$tc('stories.stories', 1)"
      data-qa="story hero"
    />
    <AuthoredHead
      v-else
      :title="title"
      :subtitle="subtitle"
      :description="description"
      :hero="heroImage"
      :context-label="$tc('stories.stories', 1)"
      data-qa="authored head"
    />
    <article
      class="story-article-container position-relative bg-white"
      :class="{ 'pt-5': enableStoryHero }"
    >
      <b-container>
        <b-row class="justify-content-center">
          <b-col
            cols="12"
            class="col-lg-8"
          >
            <p
              v-if="showDescriptionInArticle"
              class="lead"
              data-qa="article description"
            >
              {{ description }}
            </p>
            <div class="font-small font-weight-bold d-block">
              <time
                v-if="datePublished"
                class="d-inline-block"
                data-qa="date"
                :datetime="datePublished"
              >
                {{ $t('authored.publishedDate', { date: $d(new Date(datePublished), 'short') }) }}
              </time>
              <span
                v-if="authors"
              >
                {{ $t('authored.by') }}
              </span>
              <template
                v-for="(author, index) in authors"
              >
                <StoryAuthor
                  :key="index"
                  class="author d-inline"
                  :name="author.name"
                  :organisation="author.affiliation"
                  :url="author.url"
                />
              </template>
            </div>
            <div class="my-4 d-flex align-items-center">
              <ShareButton class="mr-4" />
              <ShareSocialModal :media-url="heroImage ? heroImage.image.url : null" />
              <ViewCount />
            </div>
          </b-col>
        </b-row>
      </b-container>
      <template v-for="(section, index) in browseAndScrollifySections">
        <b-container
          v-if="Array.isArray(section)"
          :key="index"
        >
          <b-row class="justify-content-center">
            <b-col
              cols="12"
              class="col-lg-8"
            >
              <div
                class="authored-section"
                data-qa="story sections"
              >
                <ContentSection
                  v-for="(subSection, subIndex) in section"
                  :key="`sub-${subIndex}`"
                  :section="subSection"
                  :rich-text-is-card="false"
                />
              </div>
            </b-col>
          </b-row>
        </b-container>
        <ContentSection
          v-else
          :key="index"
          :section="section"
          :rich-text-is-card="false"
          data-qa="story image text slide scroller"
        />
      </template>
    </article>
    <b-container
      class="footer-margin"
    >
      <b-row class="justify-content-center">
        <b-col
          cols="12"
          class="col-lg-8"
        >
          <RelatedCategoryTags
            v-if="tags.length"
            :tags="tags"
            class="related-container"
          />
          <client-only>
            <EntityBadges
              :entity-uris="relatedLink"
              class="related-container"
            />
            <ThemeBadges
              v-if="themes && themes.length"
              :themes-identifiers="themes"
              class="related-container"
            />
          </client-only>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  import ClientOnly from 'vue-client-only';
  import ShareSocialModal from '@/components/share/ShareSocialModal';
  import ShareButton from '@/components/share/ShareButton.vue';
  import ContentSection from '@/components/content/ContentSection';
  import ViewCount from '@/components/generic/ViewCount.vue';

  export default {
    name: 'StoryPost',

    components: {
      AuthoredHead: () => import('@/components/authored/AuthoredHead'),
      ContentSection,
      ClientOnly,
      EntityBadges: () => import('@/components/entity/EntityBadges'),
      RelatedCategoryTags: () => import('@/components/related/RelatedCategoryTags'),
      ShareButton,
      ShareSocialModal,
      StoryAuthor: () => import('@/components/story/StoryAuthor'),
      StoryHero: () => import('@/components/story/StoryHero'),
      ThemeBadges: () => import('@/components/theme/ThemeBadges'),
      ViewCount
    },

    props: {
      datePublished: {
        type: String,
        default: ''
      },

      title: {
        type: String,
        required: true
      },

      englishTitleLength: {
        type: Number,
        default: 0
      },

      subtitle: {
        type: String,
        default: ''
      },

      englishSubtitleLength: {
        type: Number,
        default: 0
      },

      description: {
        type: String,
        default: ''
      },

      body: {
        type: Object,
        default: null
      },

      identifier: {
        type: String,
        required: true
      },

      heroImage: {
        type: Object,
        default: null
      },

      authors: {
        type: Array,
        default: () => []
      },

      tags: {
        type: Array,
        default: () => []
      },

      relatedLink: {
        type: Array,
        default: () => []
      },

      themes: {
        type: Array,
        default: () => []
      }
    },

    data() {
      return {
        browseAndScrollifySections: this.splitSections(),
        // only show the description in the article when there is a description and the hero is enabled or AuthorHead is enabled and there is a subtitle.
        showDescriptionInArticle: this.description && (this.enableStoryHero || this.subtitle),
        // only show the hero when the hero image is larger than 800px and the title is less than 80 characters and the subtitle is less than 140 characters.
        enableStoryHero: this.heroImage?.image?.width >= 800 && this.englishTitleLength <= 80 && (this.englishSubtitleLength ? this.englishSubtitleLength <= 140 : true)
      };
    },

    methods: {
      // split the sections into individual ImageTextSlideGroups, or arrays of
      // other entry types
      splitSections() {
        return this.body.items.reduce((memo, item) => {
          if (item['__typename'] === 'ImageTextSlideGroup') {
            memo.push(item);
          } else {
            if (!Array.isArray(memo[memo.length - 1])) {
              memo.push([]);
            }
            memo[memo.length - 1].push(item);
          }
          return memo;
        }, []);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .author ~ .author::before {
    content: ', ';
  }

  .text-page p.lead {
    font-size: $font-size-medium;
    color: $black;
    margin-bottom: 1.5rem;
  }
</style>
