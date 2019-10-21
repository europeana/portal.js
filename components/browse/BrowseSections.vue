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
      <ImageWithAttribution
        v-else-if="contentType(section, 'imageWithAttribution')"
        :key="section.sys.id"
        :image-src="section.fields.image.file.url"
        :image-content-type="section.fields.image.file.contentType"
        :attribution="attributionFields(section.fields)"
      />
    </template>
  </div>
</template>

<script>
  import ContentCardSection from './ContentCardSection';
  import ImageWithAttribution from '../generic/ImageWithAttribution';
  import RichText from './RichText';

  export default {
    components: {
      ContentCardSection,
      ImageWithAttribution,
      RichText
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
      }
    }
  };
</script>
