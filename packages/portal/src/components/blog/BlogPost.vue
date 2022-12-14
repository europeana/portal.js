<template>
  <div>
    <AuthoredHead
      :title="title"
      :description="description"
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
            <ShareButton class="my-4" />
            <SocialShareModal :media-url="hero ? hero.image.url : null" />
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
            <RelatedCollections
              :entity-uris="relatedLink"
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
  import SocialShareModal from '../sharing/SocialShareModal';
  import ShareButton from '../sharing/ShareButton.vue';
  import BrowseSections from '../browse/BrowseSections';

  export default {
    name: 'BlogPost',

    components: {
      AuthoredHead: () => import('../authored/AuthoredHead'),
      BlogAuthor: () => import('./BlogAuthor'),
      RelatedCategoryTags: () => import('../related/RelatedCategoryTags'),
      ClientOnly,
      SocialShareModal,
      ShareButton,
      BrowseSections,
      RelatedCollections: () => import('@/components/related/RelatedCollections')
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
      }
    }
  };
</script>

<style lang="scss" scoped>
  .author ~ .author::before {
    content: ', ';
  }
</style>
