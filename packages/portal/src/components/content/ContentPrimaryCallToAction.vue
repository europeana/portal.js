<template>
  <div class="primary-cta text-center">
    <h2
      v-if="title"
      data-qa="primary cta title"
    >
      {{ title }}
    </h2>
    <!-- eslint-disable vue/no-v-html -->
    <div
      class="primary-cta-rich-text text-left"
      v-html="parseMarkdownHtml(text)"
    />
    <!-- eslint-enable vue/no-v-html -->
    <SmartLink
      :destination="link.url"
      data-qa="call to action"
      class="btn btn-cta"
      :class="buttonVariant"
      hide-external-icon
    >
      {{ link.text }}
    </SmartLink>
  </div>
</template>

<script>
  import SmartLink from '../generic/SmartLink';
  import { parseMarkdownHtml } from '@/utils/markdown.js';

  export default {
    name: 'ContentPrimaryCallToAction',

    components: {
      SmartLink
    },

    props: {
      title: {
        type: String,
        default: ''
      },
      text: {
        type: String,
        default: ''
      },
      link: {
        type: Object,
        default: null
      },
      buttonVariant: {
        type: String,
        default: 'btn-primary'
      }
    },

    methods: {
      parseMarkdownHtml
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .primary-cta {
    background-color: $white;
    padding: 1.5rem calc((50vw - 50%) / 2);
    margin: 0 calc((-50vw + 50%) / 2) 2rem;

    @media (min-width: $bp-large) {
      padding: 1.5rem 50px;
      margin: 0 auto 2rem;
      max-width: calc(66.667% + 100px);
    }

    .btn-primary.btn-cta {
      margin-bottom: 0;
      margin-top: 0;
    }
  }

  .white-page .primary-cta {
    background-color: $bodygrey;
    max-width: calc(100% + 100px);

    @media (min-width: $bp-large) {
      margin: 0 -50px 2rem;
      max-width: calc(100% + 100px);
    }
  }

  .xxl-page.white-page .primary-cta {
    margin: 0 0 2rem;

    @media (min-width: $bp-large) {
      width: calc(50%);
      max-width: calc($max-text-column-width + 100px);
    }
  }
</style>
