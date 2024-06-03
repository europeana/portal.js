<template>
  <div>
    <AuthoredHead
      :title="title"
      :description="description"
      :hero="hero"
      :context-label="$t('cardLabels.story')"
    />
    <article>
      <b-container>
        <b-row class="justify-content-center">
          <b-col
            cols="12"
            class="col-lg-8"
          >
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
          </b-col>
        </b-row>
      </b-container>
      <template v-for="(section, index) in browseAndScrollifySections">
        <StoryImageTextSlideScroller
          v-if="section.component === 'ImageTextSlideScroller'"
          :key="'scroller-' + index"
          :section="section.section"
          data-qa="story image text slide scroller"
        />
        <b-container
          v-else
          :key="'browse-' + index"
        >
          <b-row class="justify-content-center">
            <b-col
              cols="12"
              class="col-lg-8"
            >
              <BrowseSections
                :sections="section.sections"
                :rich-text-is-card="false"
                class="authored-section"
                data-qa="story sections"
              />
            </b-col>
          </b-row>
        </b-container>
      <!-- eslint-enable vue/no-v-html -->
      </template>
    </article>
    <b-container
      class="footer-margin"
    >
      <b-row class="justify-content-center">
        <b-col
          cols="12"
          class="col-lg-8"
        >
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
  import BrowseSections from '../browse/BrowseSections';
  import ViewCount from '../generic/ViewCount.vue';

  export default {
    name: 'StoryPost',

    components: {
      AuthoredHead: () => import('../authored/AuthoredHead'),
      StoryAuthor: () => import('./StoryAuthor'),
      BrowseSections,
      ClientOnly,
      EntityBadges: () => import('../entity/EntityBadges'),
      RelatedCategoryTags: () => import('../related/RelatedCategoryTags'),
      ShareButton,
      ShareSocialModal,
      StoryImageTextSlideScroller: () => import('./StoryImageTextSlideScroller'),
      ThemeBadges: () => import('../theme/ThemeBadges'),
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
        browseAndScrollifySections: this.splitSections()
      };
    },

    methods: {
      splitSections() {
        const sections = this.body.items;

        const nestedBrowseAndsScrollifySections = [];
        let currentBrowseSections = [];

        sections.forEach(section => {
          if (section['__typename'] === 'ImageTextSlideGroup') {
            if (currentBrowseSections.length) {
              nestedBrowseAndsScrollifySections.push({
                component: 'BrowseSections',
                sections: currentBrowseSections
              });
              currentBrowseSections = [];
            }
            nestedBrowseAndsScrollifySections.push({
              component: 'ImageTextSlideScroller',
              section
            });
          } else {
            currentBrowseSections.push(section);
          }
        });

        if (currentBrowseSections.length) {
          nestedBrowseAndsScrollifySections.push({
            component: 'BrowseSections',
            sections: currentBrowseSections
          });
        }

        return nestedBrowseAndsScrollifySections;
      }
    }
  };
</script>

<style lang="scss" scoped>
  .author ~ .author::before {
    content: ', ';
  }
</style>
