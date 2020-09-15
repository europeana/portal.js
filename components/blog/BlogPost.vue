<template>
  <b-row
    class="flex-md-row"
    data-qa="blog post"
  >
    <b-col
      cols="12"
      class="col-lg-10 mx-auto"
    >
      <article>
        <div class="title">
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
    <b-col
      cols="12"
      class="col-lg-10 mx-auto"
    >
      <article>
        <div class="font-small font-weight-bold d-block">
          <time
            v-if="datePublished"
            class="d-inline-block"
            data-qa="date"
            :datetime="datePublished"
          >
            {{ $t('blog.published', { date: $d(new Date(datePublished), 'short') }) }}
          </time>
          <span>{{ $t('blog.by') }}</span>
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
        <SocialShareModal :media-url="identifier" />
        <!-- eslint-disable vue/no-v-html -->
        <div
          class="article"
          v-html="html"
        />
        <!-- eslint-enable vue/no-v-html -->
      </article>
    </b-col>
  </b-row>
</template>

<script>
  import marked from 'marked';
  import SocialShareModal from '../sharing/SocialShareModal.vue';
  import ShareButton from '../sharing/ShareButton.vue';

  export default {
    name: 'BlogPost',

    components: {
      ImageWithAttribution: () => import('../../components/generic/ImageWithAttribution'),
      BlogAuthor: () => import('./BlogAuthor'),
      SocialShareModal,
      ShareButton
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
        type: String,
        required: true
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
    },

    computed: {
      html() {
        return marked(this.body);
      }
    }
  };
</script>
