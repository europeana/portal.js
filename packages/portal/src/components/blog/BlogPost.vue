<template>
  <div class="page text-page">
    <AuthoredHead
      :title="title"
      :description="introduction"
      :hero="hero"
      :context-label="$tc('blog.posts', 1)"
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
                {{ $t('authored.publishedDate', { date: $d(new Date(datePublished), 'short', $i18n.localeProperties.iso) }) }}
              </time>
              <span
                v-if="authors"
              >
                {{ $t('authored.by') }}
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
            <div class="authored-section">
              <ContentSection
                v-for="(section, index) in body.items"
                :key="index"
                :section="section"
                :rich-text-is-card="false"
                data-qa="blog-sections"
              />
            </div>
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
  import ContentSection from '../content/ContentSection';
  import ViewCount from '../generic/ViewCount.vue';

  export default {
    name: 'BlogPost',

    components: {
      AuthoredHead: () => import('../authored/AuthoredHead'),
      BlogAuthor: () => import('./BlogAuthor'),
      ContentSection,
      ClientOnly,
      EntityBadges: () => import('@/components/entity/EntityBadges'),
      RelatedCategoryTags: () => import('../related/RelatedCategoryTags'),
      ShareButton,
      ShareSocialModal,
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

      introduction: {
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
