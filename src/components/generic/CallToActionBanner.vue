<template>
  <div
    class="home-cta d-flex flex-lg-row flex-column"
    :class="variant"
  >
    <div
      v-if="illustration"
      class="cta-illustration align-self-stretch"
    >
      <b-img
        :src="illustration.image.url"
        :alt="illustration.image.description"
      />
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
    max-width: 86%;
    background-color: $yellowgrey;
    margin: 3.5em auto 3em;
    font-size: 1rem;
    border-radius: 0.25em;
    border: 0.25em solid $black;
    box-shadow: 0.75em 0.75em 0 0 $black;

    @media (min-width: $bp-xxxl) {
      font-size: 1vw;
      max-width: 75%;
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
      overflow: hidden;
      margin: 1em auto 0;
      padding: 0 0.5em;
      max-width: 300px;

      @media (min-width: $bp-large) {
        max-width: none;
        flex-basis: 45%;
        margin: auto 0 0;
        padding: 1em 4em 0;
        flex-shrink: 0;
      }

      @media (min-width: $bp-extralarge) {
        flex-basis: 40%;
      }

      img {
        width: 100%;
      }
    }
  }
</style>
