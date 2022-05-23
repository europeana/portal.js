<template>
  <div class="home-cta d-flex flex-row">
    <div class="cta-illustration align-self-stretch flex-fill">
      <div class="geometry"/>
    </div>
    <div class="cta-content align-self-stretch flex-fill">
      <h2>
        {{ callToAction.name }}
      </h2>
      <div
        v-html="html"
      />
      <SmartLink
        :destination="callToAction.relatedLink.url"
        data-qa="call to action"
        class="btn btn-cta btn-primary"
      >
        {{ callToAction.relatedLink.text }}
      </SmartLink>
    </div>
  </div>
</template>

<script>
  import SmartLink from '@/components/generic/SmartLink';
  import { marked } from 'marked';

  export default {
    name: 'PrimaryCallToAction',

    components: {
      SmartLink
    },
    props: {
      callToAction: {
        type: Object,
        default: null
      }
    },
    computed: {
      html() {
        // TODO: Update the styling of the RichText component and use that instead.
        return marked.parse(this.callToAction.text);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables';

  .home-cta {
    background-color: $bodygrey;
    padding: 4.25rem;
    margin: 2rem auto;
    max-width: 80%;
    border-radius: 0.4rem;
    overflow: hidden;

    .cta-illustration {
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
      text-align: center;
    }

    .btn-primary.btn-cta {
      margin-bottom: 0;
    }
  }
</style>
