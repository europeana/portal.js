<template>
  <div class="home-cta d-lg-flex flex-lg-row flex-column">
    <div class="cta-illustration align-self-stretch flex-lg-fill">
      <div class="geometry" />
    </div>
    <div class="cta-content align-self-stretch flex-lg-fill">
      <h2>
        {{ name }}
      </h2>
      <!-- eslint-disable vue/no-v-html -->
      <div
        v-html="html"
      />
      <!-- eslint-enable   vue/no-v-html -->
      <SmartLink
        :destination="link.url"
        data-qa="call to action"
        class="btn btn-cta btn-primary"
      >
        {{ link.text }}
      </SmartLink>
    </div>
  </div>
</template>

<script>
  import SmartLink from '@/components/generic/SmartLink';
  import { marked } from 'marked';

  export default {
    name: 'CallToActionBanner',

    components: {
      SmartLink
    },
    props: {
      name: {
        type: String,
        required: true
      },
      text: {
        type: String,
        required: true
      },
      link: {
        type: Object,
        required: true
      }
    },
    computed: {
      html() {
        // TODO: Update the styling of the RichString component and use that instead.
        return marked.parse(this.text);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables';

  .home-cta {
    background-color: $bodygrey;
    margin: 2rem auto;
    max-width: 75%;
    border-radius: 0.4rem;

    .cta-illustration {
      min-height: 11rem;
      padding: 4.25rem;
      overflow: hidden;

      .geometry {
        margin-left: auto;
        margin-right: auto;
        margin-bottom: -70%;
        border-radius: 1rem;
        width: 70%;
        max-width: 21rem;
        padding-top: min(70%, 21rem);
        background-color: $lightgrey;
        transform: rotate(45deg);
      }
    }

    .cta-content {
      padding: 4.25rem;
      text-align: center;
    }

    .btn-primary.btn-cta {
      margin-bottom: 0;
    }
  }
</style>
