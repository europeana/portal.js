<template>
  <div>
    <AuthoredHead
      :title="title"
      :description="description"
      :hero="hero"
    />
    <b-container>
      <b-row class="justify-content-center">
        <b-col
          cols="12"
          class="col-lg-8"
        >
          <article>
            <!-- eslint-disable vue/no-v-html -->
            <!-- share :media-url="" -->
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
              <BlogAuthor
                v-for="(author, index) in authors"
                :key="index"
                class="d-inline-block"
                :name="author.name"
                :organisation="author.affiliation"
                :url="author.url"
              />
            </div>
            <ShareButton class="my-4" />
            <SocialShareModal :media-url="hero.image.url" />
            <BrowseSections
              :sections="body.items"
              :rich-text-is-card="false"
              class="authored-section"
              data-qa="blog-sections"
            />
            <!-- eslint-enable vue/no-v-html -->
          </article>
          <BlogTags
            v-if="tags"
            :tags="tags"
          />
        </b-col>
      </b-row>
      <b-row class="footer-margin" />
    </b-container>
  </div>
</template>

<script>
  import SocialShareModal from '../sharing/SocialShareModal.vue';
  import ShareButton from '../sharing/ShareButton.vue';
  import BrowseSections from '../browse/BrowseSections';

  export default {
    name: 'BlogPost',

    components: {
      AuthoredHead: () => import('../../components/authored/AuthoredHead'),
      BlogAuthor: () => import('./BlogAuthor'),
      BlogTags: () => import('../../components/blog/BlogTags'),
      SocialShareModal,
      ShareButton,
      BrowseSections
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
      }
    }
  };
</script>
