<template>
  <b-row
    class="flex-md-row"
    data-qa="blog post"
  >
    <b-container>
      <b-row class="justify-content-center">
        <b-col cols="12">
          <article>
            <div class="title mb-4">
              <h1 data-qa="blog post title">
                {{ title }}
              </h1>
              <p
                v-if="description"
                class="lead"
              >
                {{ description }}
              </p>
            </div>
          </article>
        </b-col>
      </b-row>
      <b-row class="justify-content-center">
        <b-col cols="12">
          <ImageWithAttribution
            v-if="heroImage"
            :src="heroImage.url"
            :image-content-type="heroImage.contentType"
            :rights-statement="hero.license"
            :attribution="hero"
            hero
          />
        </b-col>
      </b-row>
    </b-container>
    <b-container>
      <b-row class="justify-content-center">
        <b-col cols="12">
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
            <SocialShareModal :media-url="heroImage.url" />
            <BrowseSections
              :sections="body.hasPartCollection.items"
              :rich-text-is-card="false"
              class="blog-sections"
              data-qa="blog-sections"
            />
            <!-- eslint-enable vue/no-v-html -->
          </article>
        </b-col>
      </b-row>
      <b-row class="footer-margin" />
    </b-container>
  </b-row>
</template>

<script>
  import SocialShareModal from '../sharing/SocialShareModal.vue';
  import ShareButton from '../sharing/ShareButton.vue';
  import BrowseSections from '../browse/BrowseSections';

  export default {
    name: 'BlogPost',

    components: {
      ImageWithAttribution: () => import('../../components/generic/ImageWithAttribution'),
      BlogAuthor: () => import('./BlogAuthor'),
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

      heroImage: {
        type: Object,
        default: null
      },

      authors: {
        type: Array,
        default: () => []
      }
    }
  };
</script>

<style lang="scss" scoped>

  .blog-sections {
    text-align: center;
  }

  /deep/ .blog-sections .col {
    margin-left: auto;
    margin-right: auto;
    text-align: left;
  }

  // TODO: temp solution, as rich text sections are always sized "col-12 col-lg-9"
  // preferably, this should be removed from the RichText component itself and be taken care on page level
  /deep/ .blog-sections .col-lg-9 {
    flex: 0 0 100%;
    max-width: 100%;
  }

  /deep/ figure {
    display: inline-block;
    margin: 0;
    max-width: 100%;

    img {
      max-height: 85vh;
      max-width: 100%;
    }

    &.compare-image-wrapper {
      display: inline-block;
      img {
        max-height: 85vh;
      }
    }
  }

  /deep/ iframe {
    max-height: initial;
    max-width: 100%;
  }

</style>
