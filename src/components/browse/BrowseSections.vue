<template>
  <div class="figure-attribution">
    <div
      v-for="(section, index) in content"
      :key="index"
    >
      <RichText
        v-if="contentType(section, 'ContentTypeRichText')"
        :text="section.text"
        :rich-text-is-card="richTextIsCard"
      />
      <ContentCardSection
        v-else-if="contentType(section, 'CardGroup')"
        :section="section"
      />
      <LatestSection
        v-else-if="contentType(section, 'LatestCardGroup') && section.total"
        :category="section.genre"
        :total="section.total"
        :cards="section.items"
      />
      <AutomatedCardGroup
        v-else-if="contentType(section, 'AutomatedCardGroup')"
        :section-type="section.genre"
      />
      <HTMLEmbed
        v-else-if="contentType(section, 'Embed')"
        :html="section.embed"
      />
      <CompareImageSlider
        v-else-if="contentType(section, 'ImageComparison')"
        :left-image-src="imageCompareImage(section, 0) ? imageCompareImage(section, 0).url : null"
        :left-image-content-type="imageCompareImage(section, 0) ? imageCompareImage(section, 0).contentType : null"
        :left-image-attribution="attributionFields(section.hasPartCollection.items[0])"
        :left-image-width="imageCompareImage(section, 0) ? imageCompareImage(section, 0).width : null"
        :left-image-height="imageCompareImage(section, 0) ? imageCompareImage(section, 0).height : null"
        :right-image-src="imageCompareImage(section, 1) ? imageCompareImage(section, 1).url : null"
        :right-image-content-type="imageCompareImage(section, 1) ? imageCompareImage(section, 1).contentType : null"
        :right-image-attribution="attributionFields(section.hasPartCollection.items[1])"
        :right-image-width="imageCompareImage(section, 1) ? imageCompareImage(section, 1).width : null"
        :right-image-height="imageCompareImage(section, 1) ? imageCompareImage(section, 1).height : null"
      />
      <ImageWithAttribution
        v-else-if="contentType(section, 'ImageWithAttribution')"
        :src="section.image ? section.image.url : null"
        :content-type="section.image ? section.image.contentType : null"
        :width="section.image ? section.image.width : null"
        :height="section.image ? section.image.height : null"
        :alt="section.image && section.image.description ? section.image.description : ''"
        :attribution="attributionFields(section)"
        :rights-statement="section.license"
      />
      <CallToAction
        v-else-if="contentType(section, 'Link')"
        :text="section.text"
        :url="section.url"
      />
      <PrimaryCallToAction
        v-else-if="contentType(section, 'PrimaryCallToAction')"
        :text="section.text"
        :link="section.relatedLink"
      />
    </div>
  </div>
</template>

<script>
  export default {
    components: {
      CompareImageSlider: () => import('../generic/CompareImageSlider'),
      ContentCardSection: () => import('./ContentCardSection'),
      LatestSection: () => import('./LatestSection'),
      HTMLEmbed: () => import('../generic/HTMLEmbed'),
      ImageWithAttribution: () => import('../generic/ImageWithAttribution'),
      CallToAction: () => import('../generic/CallToAction'),
      RichText: () => import('./RichText'),
      AutomatedCardGroup: () => import('./AutomatedCardGroup'),
      PrimaryCallToAction: () => import('./PrimaryCallToAction')
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

    async fetch() {
      this.content = await this.sectionsWithLatestCardGroups(this.sections);
    },

    data() {
      return {
        content: this.sections
      };
    },

    methods: {
      async sectionsWithLatestCardGroups(sections) {
        const content = [].concat(sections);
        const genres = content
          .filter(item => item && (item['__typename'] === 'LatestCardGroup'))
          .map(item => item.genre);

        if (genres.length === 0) {
          return content;
        }

        const variables = {
          locale: this.$i18n.isoLocale(),
          preview: this.$route.query.mode === 'preview',
          exhibitions: genres.includes('Exhibitions'),
          blogPosts: genres.includes('Blog posts'),
          galleries: genres.includes('Galleries'),
          limit: 4
        };

        let responseData;
        try {
          const response = await this.$contentful.query('latestCardGroups', variables);
          responseData = response.data;
        } catch (e) {
          return content;
        }

        // merge the latest card group data into the main content
        for (let i = 0; i < content.length; i++) {
          if (content[i] && content[i]['__typename'] === 'LatestCardGroup') {
            let latest = {};
            switch (content[i].genre) {
            case 'Exhibitions':
              latest = responseData.data.exhibitionPageCollection;
              break;
            case 'Blog posts':
              latest = responseData.data.blogPostingCollection;
              break;
            case 'Galleries':
              latest = responseData.data.imageGalleryCollection;
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
          name: fields?.name,
          creator: fields?.creator,
          provider: fields?.provider,
          rightsStatement: fields?.license,
          url: fields?.url
        };
      },
      imageCompareImage(section, index) {
        return section.hasPartCollection?.items?.[index]?.image;
      }
    }
  };
</script>

<style lang="scss" scoped>
  ::v-deep .attribution {
    &:after {
      padding-top: 0.2rem;
    }
  }
</style>
