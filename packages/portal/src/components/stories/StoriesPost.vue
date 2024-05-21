<template>
  <div>
    <AuthoredHead
      v-if="useAuthoredHead"
      :title="title"
      :description="description"
      :hero="hero"
      :context-label="$tc('blog.posts', 1)"
    />
    <StoriesPostHero
      v-else
      :title="title"
      :hero="hero"
      :context-label="$tc('story')"
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
            <p
              v-if="!useAuthoredHead && description"
              class="lead"
            >
              {{ description }}
            </p>
            <!-- eslint-disable vue/no-v-html -->
            <div class="font-small font-weight-bold d-block">
              <time
                v-if="datePublished"
                class="d-inline-block"
                data-qa="date"
                :datetime="datePublished"
              >
                {{ $t('blog.published', { date: $d(new Date(datePublished), 'short') }) }}
              </time>
              <span
                v-if="authors"
              >
                {{ $t('blog.by') }}
              </span>
              <template
                v-for="(author, index) in authors"
              >
                <BlogAuthor
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
              data-qa="blog-sections"
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
  import ShareSocialModal from '@/components/share/ShareSocialModal';
  import ShareButton from '@/components/share/ShareButton.vue';
  import BrowseSections from '@/components/browse/BrowseSections';
  import ViewCount from '@/components/generic/ViewCount.vue';
  import StoriesPostHero from './StoriesPostHero.vue';

  export default {
    name: 'BlogPost',

    components: {
      AuthoredHead: () => import('@/components/authored/AuthoredHead'),
      BlogAuthor: () => import('@/components/blog/BlogAuthor'),
      BrowseSections,
      ClientOnly,
      EntityBadges: () => import('@/components/entity/EntityBadges'),
      RelatedCategoryTags: () => import('@/components/related/RelatedCategoryTags'),
      ShareButton,
      ShareSocialModal,
      StoriesPostHero,
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
    },

    data() {
      return {
        useAuthoredHead: this.hero.image.width < 800
      };
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
