<template>
  <div>
    <template
      v-for="section in sections"
    >
      <RichText
        v-if="contentType(section, 'richText')"
        :key="section.sys.id"
        :headline="section.fields.headline"
        :text="section.fields.text"
      />
      <ContentCardSection
        v-else-if="contentType(section, 'cardGroup')"
        :key="section.sys.id"
        :section="section"
      />
      <CompareImageSlider
        v-else-if="contentType(section, 'imageComparison')"
        :key="section.sys.id"
        :left-image-src="section.fields.hasPart[0].fields.image.fields.file.url"
        :left-image-attribution="attributionFields(section.fields.hasPart[0].fields)"
        :right-image-src="section.fields.hasPart[1].fields.image.fields.file.url"
        :right-image-attribution="attributionFields(section.fields.hasPart[1].fields)"
      />
    </template>
  </div>
</template>

<script>
  import RichText from './RichText';
  import CompareImageSlider from '../generic/CompareImageSlider';
  import ContentCardSection from './ContentCardSection';

  export default {
    components: {
      RichText,
      CompareImageSlider,
      ContentCardSection
    },

    props: {
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
