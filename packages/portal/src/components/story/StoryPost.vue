<template>
  <div>
    <AuthoredHead
      :title="title"
      :description="description"
      :hero="hero"
      :context-label="$t('cardLabels.stories')"
    />
    <b-container
      class="footer-margin"
    >
      <b-row class="justify-content-center">
        <b-col
          cols="12"
          class="col-lg-8"
        >
          <article>
            <!-- eslint-disable vue/no-v-html -->
            <div class="font-small font-weight-bold d-block">
              <time
                v-if="datePublished"
                class="d-inline-block"
                data-qa="date"
                :datetime="datePublished"
              >
                {{ $t('story.published', { date: $d(new Date(datePublished), 'short') }) }}
              </time>
              <span
                v-if="authors"
              >
                {{ $t('story.by') }}
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
              <ShareSocialModal :media-url="hero ? hero.image.url : null" />
              <ViewCount />
            </div>
            <BrowseSections
              :sections="body.items"
              :rich-text-is-card="false"
              class="authored-section"
              data-qa="story sections"
            />
            <!-- eslint-enable vue/no-v-html -->
          </article>
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
  import ShareSocialModal from '../share/ShareSocialModal';
  import ShareButton from '../share/ShareButton.vue';
  import BrowseSections from '../browse/BrowseSections';
  import ViewCount from '../generic/ViewCount.vue';

  export default {
    name: 'StoryPost',

    components: {
      AuthoredHead: () => import('../authored/AuthoredHead'),
      StoryAuthor: () => import('./StoryAuthor'),
      BrowseSections,
      ClientOnly,
      EntityBadges: () => import('../entity/EntityBadges'),
      RelatedCategoryTags: () => import('../related/RelatedCategoryTags'),
      ShareButton,
      ShareSocialModal,
      ThemeBadges: () => import('../theme/ThemeBadges'),
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

      hero: {
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
    }
  };
</script>

<style lang="scss" scoped>
  .author ~ .author::before {
    content: ', ';
  }
</style>
