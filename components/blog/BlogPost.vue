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
        <time
          v-if="datePublished"
          class="font-weight-bold pb-3 d-block"
          data-qa="date"
          :datetime="datePublished"
        >
          {{ $d(new Date(datePublished), 'short') }}
        </time>
        <ShareButton class="mb-4" />
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
      }
    },

    computed: {
      html() {
        return marked(this.body);
      }
    }
  };
</script>
