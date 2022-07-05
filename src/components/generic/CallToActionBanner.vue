<template>
  <div class="gridless-container">
    <div
      class="home-cta d-flex flex-md-row flex-column"
      :class="variant"
    >
      <div
        v-if="illustration"
        class="cta-illustration align-self-stretch"
        :style="`background-image: url(${illustration.image.url})`"
      />
      <div class="cta-content align-self-stretch flex-md-fill">
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
      },
      illustration: {
        type: Object,
        default: null
      },
      /**
       * Banner variant to use
       * @values yellowgrey, grey, blue
       */
      variant: {
        type: String,
        default: 'yellowgrey'
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
    background-color: $yellowgrey;
    margin: 3.5em auto 3em;
    font-size: 1rem;
    border-radius: 0.25em;
    border: 0.25em solid $black;
    box-shadow: 0.75em 0.75em 0 0 $black;

    @media (min-width: $bp-xxxl) {
      font-size: 1vw;
    }

    .cta-content {
      padding: 2.5em;
      text-align: center;
      font-size: 1em;

      h2 {
        color: $mediumgrey;
        font-size: 2em;
        font-weight: 700;
      }

      p {
        font-size: 1em;
      }
    }

    .btn-primary.btn-cta {
      margin-bottom: 0;
      text-transform: capitalize;
      border: 0.1875em solid $black;
      box-shadow: 0.25em 0.25em 0 0 $black;
      font-weight: 700;
      padding: 0.5em 1em;
      border-radius: 0.25em;

      @media (min-width: $bp-xxxl) {
        font-size: 1vw;
      }
    }

    &.light {
      background-color: $bodygrey;
    }

    &.innovationblue {
      background-color: $innovationblue;

      .cta-content {
        color: $white;

        h2 {
          color: $white;
        }
      }

      .btn-primary.btn-cta {
        background-color: $yellowgrey;
        color: $black;

        &:hover {
          background-color: $white;
        }
      }
    }

    .cta-illustration {
      background-repeat: no-repeat;
      background-position: center bottom;
      background-size: contain;
      margin-top: 1em;
      margin-left: 1em;
      margin-right: 1em;
      height: 175px;

      @media (min-width: $bp-medium) {
        height: auto;
        width: 40%;
      }
    }
  }
</style>
