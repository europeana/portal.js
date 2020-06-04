<template>
  <div>
    <template
      v-for="(section, index) in content"
    >
      <RichText
        v-if="contentType(section, 'ContentTypeRichText')"
        :key="index"
        :text="section.text"
        :rich-text-is-card="richTextIsCard"
      />
      <ContentCardSection
        v-else-if="contentType(section, 'CardGroup')"
        :key="index"
        :section="section"
      />
      <LatestSection
        v-else-if="contentType(section, 'LatestCardGroup')"
        :key="index"
        :category="section.genre"
        :total="section.total"
        :cards="section.items"
      />
      <HTMLEmbed
        v-else-if="contentType(section, 'embed')"
        :key="index"
        :html="section.embed"
      />
      <CompareImageSlider
        v-else-if="contentType(section, 'ImageComparison')"
        :key="index"
        :left-image-src="section.hasPartCollection.items[0].image.url"
        :left-image-content-type="section.hasPartCollection.items[0].image.contentType"
        :left-image-attribution="attributionFields(section.hasPartCollection.items[0])"
        :left-image-width="section.hasPartCollection.items[0].image.width"
        :left-image-height="section.hasPartCollection.items[0].image.height"
        :right-image-src="section.hasPartCollection.items[1].image.url"
        :right-image-content-type="section.hasPartCollection.items[1].image.contentType"
        :right-image-attribution="attributionFields(section.hasPartCollection.items[1])"
        :right-image-width="section.hasPartCollection.items[1].image.width"
        :right-image-height="section.hasPartCollection.items[1].image.height"
      />
      <ImageWithAttribution
        v-else-if="contentType(section, 'ImageWithAttribution')"
        :key="index"
        :src="section.image.url"
        :content-type="section.image.contentType"
        :width="section.image.width"
        :height="section.image.height"
        :attribution="attributionFields(section)"
      />
    </template>
  </div>
</template>

<script>
  import CompareImageSlider from '../generic/CompareImageSlider';
  import ContentCardSection from './ContentCardSection';
  import LatestSection from './LatestSection';
  import HTMLEmbed from '../generic/HTMLEmbed';
  import ImageWithAttribution from '../generic/ImageWithAttribution';
  import RichText from './RichText';

  export default {
    components: {
      CompareImageSlider,
      ContentCardSection,
      LatestSection,
      HTMLEmbed,
      ImageWithAttribution,
      RichText
    },

    props: {
      richTextIsCard: {
        type: Boolean,
        default: true
      },

      sections: {
        type: Array,
        default: () => []
      }
    },

    data() {
      return {
        content: this.sections
      };
    },

    async fetch() {
      this.content = await this.sectionsWithLatestCardGroups(this.sections);
    },

    methods: {
      async sectionsWithLatestCardGroups(sections) {
        const content = [].concat(sections);
        const genres = content
          .filter(item => item && (item['__typename'] === 'LatestCardGroup'))
          .map(item => item.genre);

        if (genres.length === 1) return content;

        const variables = {
          locale: this.$i18n.isoLocale(),
          preview: this.$route.query.mode === 'preview',
          exhibitions: genres.includes('Exhibitions'),
          blogPosts: genres.includes('Blog posts'),
          galleries: genres.includes('Galleries'),
          limit: 4
        };

        const { data } = await this.$contentful.query('latestCardGroups', variables);
        for (let i = 0; i < content.length; i++) {
          if (content[i] && content[i]['__typename'] === 'LatestCardGroup') {
            let latest = {};
            switch (content[i].genre) {
            case 'Exhibitions':
              latest = data.data.exhibitionPageCollection;
              break;
            case 'Blog posts':
              latest = data.data.blogPostingCollection;
              break;
            case 'Galleries':
              latest = data.data.imageGalleryCollection;
              break;
            }
            content[i] = { ...content[i], ...latest };
          }
        }

        return content;
      },
      contentType(section, typeName) {
        return section && (section['__typename'] === typeName);
      },
      attributionFields(fields) {
        return {
          name: fields.name,
          creator: fields.creator,
          provider: fields.provider,
          rightsStatement: fields.license,
          url: fields.url
        };
      }
    }
  };
</script>

<style lang="scss" scoped>
  /deep/ .attribution {
    &:after {
      padding-top: 0.2rem;
    }
  }
</style>
