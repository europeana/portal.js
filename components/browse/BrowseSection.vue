<template>
  <section class="container">
    <div class="mt-3 w-100" data-qa="thisisatest">
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
      </template>
    </div>
  </section>
</template>

<script>
  import RichText from './RichText';
  import ContentCardSection from './ContentCardSection';

  export default {
    components: {
      RichText,
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
        return section.sys.contentType.sys.id === id;
      }
    }
  };
</script>
