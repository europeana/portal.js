<template>
  <div
    class="cta-banner d-flex flex-md-row flex-column"
    :class="variant"
  >
    <div
      v-if="illustration"
      class="cta-illustration align-self-stretch"
    >
      <ImageOptimised
        :alt="illustration.image.description"
        :src="illustration.image.url"
        :width="illustration.image.width"
        :height="illustration.image.height"
        :content-type="illustration.image.contentType"
        :max-width="1100"
        :lazy="true"
      />
    </div>
    <div class="cta-content align-self-stretch d-flex flex-column align-items-center justify-content-center">
      <h2>
        {{ name }}
      </h2>
      <!-- eslint-disable vue/no-v-html -->
      <div
        v-html="html"
      />
      <!-- eslint-enable   vue/no-v-html -->
      <SmartLink
        v-if="link"
        :destination="link.url"
        data-qa="call to action"
        class="btn btn-cta btn-primary"
        hide-external-icon
        @click.capture.native="handleClickEvent"
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
      SmartLink,
      ImageOptimised: () => import('@/components/image/ImageOptimised')
    },
    props: {
      name: {
        type: String,
        required: true
      },
      nameEnglish: {
        type: String,
        default: null
      },
      text: {
        type: String,
        required: true
      },
      link: {
        type: Object,
        default: null
      },
      illustration: {
        type: Object,
        default: null
      },
      /**
       * Banner variant to use
       * @values yellowgrey, light, innovationblue
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
    },

    methods: {
      handleClickEvent() {
        this.$matomo?.trackEvent('CTA banner', 'Click CTA banner link', `CTA banner: ${this.nameEnglish}`);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .cta-banner {
    background-color: $yellowgrey;
    margin-bottom: 2rem;
    margin-left: auto;
    margin-right: auto;
    font-size: $font-size-base;
    border-radius: 0.25em;
    border: 0.25em solid $greyblack;
    box-shadow: 0.75em 0.75em 0 0 $greyblack;
    width: 100%;

    @media (min-width: $bp-wqhd) {
      min-height: 320px;
    }

    @media (min-width: $bp-4k) {
      font-size: $font-size-large;
      margin-bottom: 3rem;
      min-height: 442px;
    }

    .cta-content {
      padding: 1.5rem 1.75rem 2.5rem;
      text-align: center;
      font-size: $font-size-base;

      @media (min-width: $bp-medium) {
        height: auto;
        flex: 0 0 60%;
      }

      @media (min-width: $bp-extralarge) {
        font-size: $font-size-medium;
        padding: 3rem 3.75rem;
      }

      @media (min-width: $bp-4k) {
        font-size: $font-size-medium-4k;
      }

      h2 {
        color: $darkgrey;
        font-size: $font-size-large;
        font-weight: 700;
        margin-bottom: 0.5rem;

        @media (min-width: $bp-extralarge) {
          font-size: $font-size-xl;
        }

        @media (min-width: $bp-4k) {
          font-size: $font-size-xl-4k;
        }
      }

      ::v-deep p {
        margin-bottom: 1em;
      }
    }

    .btn-primary.btn-cta {
      margin-bottom: 0;
      text-transform: none;
      border: 0.1875em solid $greyblack;
      box-shadow: 0.25em 0.25em 0 0 $greyblack;
      font-size: $font-size-base;
      font-weight: 700;
      border-radius: 0.25em;
      margin-top: 0;
    }

    @media (min-width: $bp-4k) {
      font-size: $font-size-base-4k;
    }

    &.light {
      background-color: $lightgrey;
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
        color: $greyblack;

        &:hover {
          background-color: $white;
        }
      }
    }

    .cta-illustration {
      position: relative;
      flex-shrink: 0;

      @media (max-width: ($bp-medium - 1px)) {
        background-color: $illustration-whitegrey;
        height: 175px;
      }

      @media (min-width: $bp-medium) {
        flex: 0 0 40%;
      }

      ::v-deep img {
        padding: 1rem 1rem 0;
        position: absolute;
        left: 0;
        bottom: 0;
        max-height: 100%;
        right: 0;
        margin: 0 auto;

        @media (min-width: $bp-4k) {
          padding: 1.5rem 1.5rem 0;
        }
      }
    }
  }

  .home-cta {
    margin: 3rem auto;

    @media (min-width: $bp-4k) {
      margin: 4.5rem auto;
    }
  }
</style>

<docs lang="md">
  Variant "yellowgrey" (default):
  ```jsx
  <CallToActionBanner
    name="Call to action name"
    text="This is a call to action text"
    :link="{ url: '/', text: 'Click here' }"
  />
  ```
  Variant "yellowgrey" (default) with illustration:
  ```jsx
  <CallToActionBanner
    name="Call to action name"
    text="This is a call to action text"
    :link="{ url: '/', text: 'Click here' }"
    :illustration="{
      image: { url: 'https://images.ctfassets.net/i01duvb6kq77/1DxiDhy46cX5eBheNYFdP7/42518b79959f2ea5cd270f9cffa022b2/homepage_A_v4_blackline.svg',
       width: 890, height: 724 } }"
  />
  ```
  Variant "light" with illustration
  ```jsx
  <CallToActionBanner
    name="Call to action name"
    text="This is a call to action text"
    :link="{ url: '/', text: 'Click here' }"
    :illustration="{ image: { url: 'https://images.ctfassets.net/i01duvb6kq77/1DxiDhy46cX5eBheNYFdP7/42518b79959f2ea5cd270f9cffa022b2/homepage_A_v4_blackline.svg',
    width: 890, height: 724  } }"
    variant="light"
  />
  ```
  Variant "innovationblue" with illustration
  ```jsx
  <CallToActionBanner
    name="Call to action name"
    text="This is a call to action text"
    :link="{ url: '/', text: 'Click here' }"
    :illustration="{ image: { url: 'https://images.ctfassets.net/i01duvb6kq77/1DxiDhy46cX5eBheNYFdP7/42518b79959f2ea5cd270f9cffa022b2/homepage_A_v4_blackline.svg',
    width: 890, height: 724  } }"
    variant="innovationblue"
  />
  ```
</docs>
