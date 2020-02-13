<template>
  <div>
    <template
      v-for="section in sections"
    >
      <RichText
        v-if="contentType(section, 'richText')"
        :key="section.sys.id"
        :text="section.fields.text"
        :rich-text-is-card="richTextIsCard"
      />
      <ContentCardSection
        v-else-if="contentType(section, 'cardGroup')"
        :key="section.sys.id"
        :section="section"
      />
      <HTMLEmbed
        v-else-if="contentType(section, 'embed')"
        :key="section.sys.id"
        :html="section.fields.embed"
      />
      <CompareImageSlider
        v-else-if="contentType(section, 'imageComparison')"
        :key="section.sys.id"
        :left-image-src="section.fields.hasPart[0].fields.image.fields.file.url"
        :left-image-content-type="section.fields.hasPart[0].fields.image.fields.file.contentType"
        :left-image-attribution="attributionFields(section.fields.hasPart[0].fields)"
        :right-image-src="section.fields.hasPart[1].fields.image.fields.file.url"
        :right-image-content-type="section.fields.hasPart[1].fields.image.fields.file.contentType"
        :right-image-attribution="attributionFields(section.fields.hasPart[1].fields)"
      />
      <ImageWithAttribution
        v-else-if="contentType(section, 'imageWithAttribution')"
        :key="section.sys.id"
        :src="section.fields.image.fields.file.url"
        :content-type="section.fields.image.fields.file.contentType"
        :attribution="attributionFields(section.fields)"
      />
    </template>
  </div>
</template>

<script>
  import CompareImageSlider from '../generic/CompareImageSlider';
  import ContentCardSection from './ContentCardSection';
  import HTMLEmbed from '../generic/HTMLEmbed';
  import ImageWithAttribution from '../generic/ImageWithAttribution';
  import RichText from './RichText';

  export default {
    components: {
      CompareImageSlider,
      ContentCardSection,
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
      contentType(section, id) {
        if (!section.sys.contentType) {
          return;
        }
        return section.sys.contentType.sys.id === id;
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
    align-items: flex-start;
    &:after {
      padding-top: 0.2rem;
    }
  }
</style>
