<template>
  <ContentRichText
    v-if="contentfulEntryHasContentType(section, 'ContentTypeRichText')"
    :text="section.text"
    :rich-text-is-card="richTextIsCard"
  />
  <ContentCardSection
    v-else-if="contentfulEntryHasContentType(section, 'CardGroup')"
    :section="section"
    :lazy="lazy"
    class="mb-5"
  />
  <BrowseAutomatedCardGroup
    v-else-if="contentfulEntryHasContentType(section, 'AutomatedCardGroup')"
    :section-type="section.genre"
    :more-button="section.moreButton"
    :lazy="lazy"
  />
  <EmbedHTML
    v-else-if="contentfulEntryHasContentType(section, 'Embed')"
    :html="section.embed"
    :title="section.title"
    class="mb-5"
  />
  <ImageComparisonSlider
    v-else-if="contentfulEntryHasContentType(section, 'ImageComparison')"
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
  <ImageWithAttributionContainer
    v-else-if="contentfulEntryHasContentType(section, 'ImageWithAttribution')"
    :src="section.image ? section.image.url : null"
    :content-type="section.image ? section.image.contentType : null"
    :width="section.image ? section.image.width : null"
    :height="section.image ? section.image.height : null"
    :alt="section.image && section.image.description ? section.image.description : ''"
    :attribution="attributionFields(section)"
    :rights-statement="section.license"
  />
  <CallToAction
    v-else-if="contentfulEntryHasContentType(section, 'Link')"
    :text="section.text"
    :url="section.url"
  />
  <CallToActionBanner
    v-else-if="contentfulEntryHasContentType(section, 'PrimaryCallToAction') && section.image"
    :name="section.name"
    :name-english="section.nameEN"
    :text="section.text"
    :link="section.relatedLink"
    :illustration="section.image"
  />
  <ContentPrimaryCallToAction
    v-else-if="contentfulEntryHasContentType(section, 'PrimaryCallToAction')"
    :text="section.text"
    :link="section.relatedLink"
  />
  <StoryImageTextSlideScroller
    v-else-if="contentfulEntryHasContentType(section, 'ImageTextSlideGroup')"
    :section="section"
  />
</template>

<script>
  import contentfulMixin from '@/mixins/contentful.js';

  export default {
    name: 'ContentSection',

    components: {
      BrowseAutomatedCardGroup: () => import('../browse/BrowseAutomatedCardGroup'),
      CallToAction: () => import('../generic/CallToAction'),
      CallToActionBanner: () => import('../generic/CallToActionBanner'),
      ContentCardSection: () => import('./ContentCardSection'),
      ContentPrimaryCallToAction: () => import('./ContentPrimaryCallToAction'),
      ContentRichText: () => import('./ContentRichText'),
      EmbedHTML: () => import('../embed/EmbedHTML'),
      ImageComparisonSlider: () => import('../image/ImageComparisonSlider'),
      ImageWithAttributionContainer: () => import('../image/ImageWithAttributionContainer'),
      StoryImageTextSlideScroller: () => import('../story/StoryImageTextSlideScroller')
    },

    mixins: [contentfulMixin],

    props: {
      richTextIsCard: {
        type: Boolean,
        default: true
      },

      section: {
        type: Object,
        required: true
      },

      /**
       * If `true`, image will be lazy-loaded
       */
      lazy: {
        type: Boolean,
        default: true
      }
    },

    methods: {
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
    &::after {
      padding-top: 0.2rem;
    }
  }
</style>
