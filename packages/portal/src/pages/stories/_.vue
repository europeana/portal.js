<template>
  <div
    data-qa="story page"
    class="page text-page"
  >
    <b-container
      v-if="$fetchState.pending"
      class="pt-5"
      data-qa="loading spinner container"
    >
      <b-row class="flex-md-row py-4 text-center">
        <b-col cols="12">
          <LoadingSpinner />
        </b-col>
      </b-row>
    </b-container>
    <ErrorMessage
      v-else-if="$fetchState.error"
      data-qa="error message container"
      :error="$fetchState.error"
    />
    <div
      v-else-if="post.identifier"
    >
      <ContentWarningModal
        v-if="post.contentWarning"
        :title="post.contentWarning.name"
        :description="post.contentWarning.description"
        :page-slug="`stories/${post.identifier}`"
      />
      <StoryPost
        :date-published="post.datePublished"
        :title="post.name"
        :english-title-length="post.nameEN?.length"
        :subtitle="post.headline"
        :english-subtitle-length="post.headlineEN?.length"
        :description="post.description"
        :body="post.hasPartCollection"
        :identifier="post.identifier"
        :hero-image="heroImage"
        :media-url="pageMetaOgImage"
        :authors="post.authorCollection.items.length > 0 ? post.authorCollection.items : null"
        :tags="post.categoriesCollection && post.categoriesCollection.items"
        :themes="post.genre"
        :related-link="post.relatedLink"
      />
    </div>
  </div>
</template>

<script>
  import StoryPost from '@/components/story/StoryPost';
  import logEventMixin from '@/mixins/logEvent';
  import pageMetaMixin from '@/mixins/pageMeta';
  import canonicalUrlMixin from '@/mixins/canonicalUrl';

  export default {
    name: 'StoriesPage',

    components: {
      ContentWarningModal: () => import('@/components/content/ContentWarningModal'),
      LoadingSpinner: () => import('@/components/generic/LoadingSpinner'),
      ErrorMessage: () => import('@/components/error/ErrorMessage'),
      StoryPost
    },

    mixins: [
      canonicalUrlMixin,
      pageMetaMixin,
      logEventMixin
    ],

    data() {
      return {
        post: {}
      };
    },

    async fetch() {
      const variables = {
        identifier: this.$route.params.pathMatch,
        locale: this.$i18n.localeProperties.iso,
        preview: this.$route.query.mode === 'preview'
      };

      let data;
      try {
        const response = await this.$contentful.query('storyPage', variables);
        data = response.data.data;
      } catch (e) {
        this.$error(e);
      }

      if (data.storyCollection.items.length === 0) {
        this.$error(404, { scope: 'page' });
      } else {
        this.post = data.storyCollection.items[0];
      }
    },

    computed: {
      pageMeta() {
        return {
          title: this.post.name,
          subtitle: this.post.headline,
          description: this.post.description,
          ogType: 'article',
          ogImage: this.post.primaryImageOfPage?.image,
          ogImageAlt: this.post.primaryImageOfPage?.image?.description || ''
        };
      },
      heroImage() {
        return this.post.primaryImageOfPage || null;
      }
    },

    mounted() {
      this.logEvent('view', this.canonicalUrl({ fullPath: true, locale: false }));
    }
  };
</script>
