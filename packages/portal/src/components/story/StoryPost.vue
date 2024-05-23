<template>
  <div>
    <StoryHero
      v-if="useStoryHero"
      :title="title"
      :subtitle="subtitle"
      :hero="hero"
      :context-label="$t('cardLabels.story')"
      class="story-hero"
    />
    <AuthoredHead
      v-else
      :title="title"
      :description="description"
      :hero="hero"
      :context-label="$t('cardLabels.story')"
    />

    <div class="story-article-container position-relative bg-white pt-5">
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
                v-if="useStoryHero && description"
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
  </div>
</template>

<script>
  import ClientOnly from 'vue-client-only';
  import ShareSocialModal from '@/components/share/ShareSocialModal';
  import ShareButton from '@/components/share/ShareButton.vue';
  import BrowseSections from '@/components/browse/BrowseSections';
  import ViewCount from '@/components/generic/ViewCount.vue';
  import StoryHero from './StoryHero.vue';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  export default {
    name: 'StoryPost',

    components: {
      AuthoredHead: () => import('@/components/authored/AuthoredHead'),
      StoryAuthor: () => import('@/components/story/StoryAuthor'),
      BrowseSections,
      ClientOnly,
      EntityBadges: () => import('@/components/entity/EntityBadges'),
      RelatedCategoryTags: () => import('@/components/related/RelatedCategoryTags'),
      ShareButton,
      ShareSocialModal,
      StoryHero,
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

      subtitle: {
        type: String,
        default: ''
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
        useStoryHero: this.hero.image.width >= 800
      };
    },

    mounted() {
      if (this.useStoryHero) {
        gsap.registerPlugin(ScrollTrigger);

        ScrollTrigger.defaults({
          trigger: '.story-article-container',
          scrub: true,
          end: 'top top',
          invalidateOnRefresh: true,
          markers: true
        });

        gsap.to('.hero-content', {
          y: -(0.5 * document.querySelector('.story-hero').clientHeight),
          scrollTrigger: {}
        });

        gsap.to('.story-hero', {
          yPercent: 50,
          scrollTrigger: {}
        });
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
