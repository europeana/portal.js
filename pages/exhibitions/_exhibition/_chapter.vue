<template>
  <div
    data-qa="exhibition chapter"
    class="text-page figure-attribution"
  >
    <AuthoredHead
      :title="page.name"
      :exhibition-title="exhibitionTitle"
      :description="page.headline"
      :hero="hero"
    />
    <b-container>
      <b-row>
        <b-col
          cols="12"
          class="col-lg-8"
        >
          <h1
            v-if="!hero"
            data-qa="exhibition chapter title"
          >
            {{ page.name }}
          </h1>
        </b-col>
      </b-row>
      <b-row class="justify-content-center">
        <b-col
          cols="12"
          class="col-lg-8"
        >
          <article>
            <ShareButton class="mb-4" />
            <SocialShareModal :media-url="optimisedImageUrl" />
            <BrowseSections
              v-if="page"
              :sections="page.hasPartCollection.items"
              :rich-text-is-card="false"
              class="authored-section"
            />
          </article>
        </b-col>
      </b-row>
      <client-only>
        <b-row
          v-if="chapters"
          class="justify-content-center mt-3"
        >
          <b-col
            cols="12"
            class="mt-3 col-lg-8"
          >
            <LinkList
              :items="manipulateChapters(chapters, exhibitionIdentifier)"
              :title="$t('exhibitions.chapters')"
            />
          </b-col>
        </b-row>
      </client-only>
      <b-row class="footer-margin" />
    </b-container>
  </div>
</template>

<script>
  import ClientOnly from 'vue-client-only';
  import BrowseSections from '../../../components/browse/BrowseSections';
  import SocialShareModal from '../../../components/sharing/SocialShareModal.vue';
  import ShareButton from '../../../components/sharing/ShareButton.vue';
  import exhibitionChapters from '../../../mixins/exhibitionChapters';

  export default {
    components: {
      BrowseSections,
      ClientOnly,
      ShareButton,
      SocialShareModal,
      AuthoredHead: () => import('../../../components/authored/AuthoredHead'),
      LinkList: () => import('../../../components/generic/LinkList')
    },
    mixins: [
      exhibitionChapters
    ],
    asyncData({ params, query, error, app, store }) {
      const variables = {
        identifier: params.exhibition,
        locale: app.i18n.isoLocale(),
        preview: query.mode === 'preview'
      };

      return app.$contentful.query('exhibitionChapterPage', variables)
        .then(response => response.data.data)
        .then(data => {
          let chapter;
          let exhibition;

          if (data.exhibitionPageCollection.total === 1) {
            exhibition = data.exhibitionPageCollection.items[0];
            chapter = exhibition.hasPartCollection.items.find(item => item.identifier === params.chapter);
          }

          if (!chapter || !exhibition) {
            error({ statusCode: 404, message: app.i18n.t('messages.notFound') });
            return;
          }

          store.commit('breadcrumb/setBreadcrumbs', [
            {
              text: app.i18n.tc('exhibitions.exhibitions', 2),
              to: app.$path({ name: 'exhibitions' })
            },
            {
              text: exhibition.name,
              to: app.$path({
                name: 'exhibitions-exhibition',
                params: {
                  exhibition: exhibition.identifier
                }
              })
            },
            {
              text: chapter.name,
              active: true
            }
          ]);
          return {
            chapters: exhibition.hasPartCollection.items,
            credits: exhibition.credits,
            exhibitionIdentifier: params.exhibition,
            exhibitionTitle: exhibition.name,
            page: chapter
          };
        })
        .catch((e) => {
          error({ statusCode: 500, message: e.toString() });
        });
    },
    computed: {
      chapterNavigation() {
        return this.chapters.map((chapter) => {
          return {
            identifier: chapter.identifier, name: chapter.name, url: this.chapterUrl(chapter.identifier)
          };
        });
      },
      hero() {
        return this.page.primaryImageOfPage ? this.page.primaryImageOfPage : null;
      },
      heroImage() {
        return this.hero ? this.hero.image : null;
      },
      optimisedImageUrl() {
        if (!this.heroImage) return;
        return this.$options.filters.optimisedImageUrl(
          this.heroImage.url,
          this.heroImage.contentType,
          { width: 800, height: 800 }
        );
      }
    },
    methods: {
      chapterUrl(identifier) {
        return this.$path({
          name: 'exhibitions-exhibition-chapter',
          params: {
            exhibition: this.exhibitionIdentifier, chapter: identifier
          }
        });
      }
    },
    beforeRouteLeave(to, from, next) {
      this.$store.commit('breadcrumb/clearBreadcrumb');
      next();
    },
    head() {
      return {
        title: this.$pageHeadTitle(this.page.name),
        meta: [
          { hid: 'title', name: 'title', content: this.page.name },
          { hid: 'og:title', property: 'og:title', content: this.page.name },
          { hid: 'og:image', property: 'og:image', content: this.optimisedImageUrl },
          { hid: 'og:type', property: 'og:type', content: 'article' }
        ]
          .concat(this.page.description ? [
            { hid: 'description', name: 'description', content: this.page.description },
            { hid: 'og:description', property: 'og:description', content: this.page.description }
          ] : [])
      };
    }
  };
</script>
