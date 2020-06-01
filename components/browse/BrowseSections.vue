<template>
  <div>
    <template
      v-for="(section, index) in sections"
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
        v-else-if="contentType(section, 'imageComparison')"
        :key="index"
        :left-image-src="section.hasPart[0].fields.image.fields.file.url"
        :left-image-content-type="section.hasPart[0].fields.image.fields.file.contentType"
        :left-image-attribution="attributionFields(section.hasPart[0].fields)"
        :left-image-width="section.hasPart[0].fields.image.fields.file.details.image.width"
        :left-image-height="section.hasPart[0].fields.image.fields.file.details.image.height"
        :right-image-src="section.hasPart[1].fields.image.fields.file.url"
        :right-image-content-type="section.hasPart[1].fields.image.fields.file.contentType"
        :right-image-attribution="attributionFields(section.hasPart[1].fields)"
        :right-image-width="section.hasPart[1].fields.image.fields.file.details.image.width"
        :right-image-height="section.hasPart[1].fields.image.fields.file.details.image.height"
      />
      <ImageWithAttribution
        v-else-if="contentType(section, 'imageWithAttribution')"
        :key="index"
        :src="section.image.fields.file.url"
        :content-type="section.image.fields.file.contentType"
        :width="section.image.fields.file.details.image.width"
        :height="section.image.fields.file.details.image.height"
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

    methods: {
      contentType(section, typeName) {
        // console.log('section', section);
        return section['__typename'] === typeName;
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
