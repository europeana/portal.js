<template>
  <b-container>
    <div class="header mx-auto text-center text-lg-left">
      <h2>
        {{ title }}
      </h2>
      <!-- eslint-disable vue/no-v-html -->
      <div
        v-if="text"
        class="text mb-3"
        v-html="parseMarkdownHtml(text)"
      />
    <!-- eslint-enable vue/no-v-html -->
    </div>
    <div
      v-for="(section, index) in sections"
      :key="index"
    >
      <LandingAutomatedCardGroup
        v-if="contentType(section, 'AutomatedCardGroup')"
        :genre="section.genre"
        :static-items="section.staticItems"
      />
    </div>
  </b-container>
</template>

<script>
  import parseMarkdownHtmlMixin from '@/mixins/parseMarkdownHtml';

  export default {
    name: 'LandingSubSection',

    components: {
      LandingAutomatedCardGroup: () => import('@/components/landing/LandingAutomatedCardGroup')
    },

    mixins: [parseMarkdownHtmlMixin],

    props: {
      /**
       * H2 title to display above the info cards
       */
      title: {
        type: String,
        default: null
      },
      /**
       * Text to display under title and above the info cards
       */
      text: {
        type: String,
        default: null
      },
      /**
       * List of sections
       */
      sections: {
        type: Array,
        default: () => []
      }
    },

    methods: {
      contentType(section, typeName) {
        return section && (section['__typename'] === typeName);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .container {
    padding-top: 4rem;
    padding-bottom: 2rem;

    @media (min-width: $bp-medium) {
      padding-bottom: 4rem;
    }
  }

  .header {
    max-width: $max-text-column-width;
    padding-bottom: 1rem;

    @media (min-width: $bp-medium) {
      padding-bottom: 4rem;
    }

    h2 {
      font-family: $font-family-ubuntu;
      font-size: $font-size-large;
      font-weight: 500;

      @media (min-width: $bp-medium) {
        font-size: $font-size-xl;
      }

      @media (min-width: $bp-4k) {
        font-size: $font-size-xl-4k;
      }
    }
  }

  .text {
    color: $mediumgrey;
  }
</style>

<docs lang="md">
  ```jsx
    <LandingSubSection
      title="This is a title for a sub section"
      text="A __description__ what this section is all about"
      :sections="[{
        __typename: 'AutomatedCardGroup',
        staticItems:[ { info: '16,000 +', label: 'Visits per day' }, { info: '57,000,000 +', label: 'Items' }, { info: '2,600 +', label: 'Providing institutions' } ]
        }]"
    />
  ```
</docs>
