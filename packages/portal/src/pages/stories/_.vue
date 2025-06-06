<template>
  <div
    data-qa="story page"
    class="text-page"
  >
    <LoadingSpinner
      v-if="$fetchState.pending"
      class="pt-5 flex-md-row py-4 text-center"
    />
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
  import { useLogEvent } from '@/composables/logEvent.js';
  import storyPageGraphql from '@/graphql/queries/storyPage.graphql';
  import pageMetaMixin from '@/mixins/pageMeta';

  export default {
    name: 'StoriesPage',

    components: {
      ContentWarningModal: () => import('@/components/content/ContentWarningModal'),
      ErrorMessage: () => import('@/components/error/ErrorMessage'),
      LoadingSpinner: () => import('@/components/generic/LoadingSpinner'),
      StoryPost
    },

    mixins: [
      pageMetaMixin
    ],

    inject: [
      'canonicalUrl'
    ],

    setup() {
      const { logEvent } = useLogEvent();

      return { logEvent };
    },

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
        const response = await this.$contentful.query(storyPageGraphql, variables);
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
      if (!this.$fetchState.error) {
        this.logEvent('view', this.canonicalUrl.withOnlyQuery, this.$session);
      }
    }
  };
</script>
