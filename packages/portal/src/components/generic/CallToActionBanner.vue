<template>
  <div
    class="cta-banner d-flex flex-md-row flex-column"
    :class="variant"
  >
    <div
      v-if="illustration"
      class="cta-illustration align-self-stretch"
    >
      <OptimisedImage
        :alt="illustration.image.description"
        :src="illustration.image.url"
        :width="illustration.image.width"
        :height="illustration.image.height"
        :content-type="illustration.image.contentType"
        :max-width="1100"
        :lazy="true"
      />
    </div>
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
        v-if="link"
        :destination="link.url"
        data-qa="call to action"
        class="btn btn-cta btn-primary"
        hide-external-icon
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
      OptimisedImage: () => import('@/components/generic/OptimisedImage')
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
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables';

  .cta-banner {
    background-color: $yellowgrey;
    margin-bottom: 2rem;
    margin-left: auto;
    margin-right: auto;
    font-size: 1rem;
    border-radius: 0.25em;
    border: 0.25em solid $greyblack;
    box-shadow: 0.75em 0.75em 0 0 $greyblack;
    max-width: calc(#{$max-card-width * 3} + #{$grid-gutter * 4});

    @media (min-width: $bp-wqhd) {
      width: calc((100% / 6) * 4 - $grid-gutter);
    }

    @media (min-width: $bp-4k) {
      max-width: calc((100% / 6) * 4 - $grid-gutter-4k);
      width: calc((100% / 6) * 4 - $grid-gutter-4k);
      font-size: 1.5rem;
      margin-bottom: 3rem;
    }

    .cta-content {
      padding: 2.25em 1.75em 2.5em;
      text-align: center;
      font-size: 1rem;

      @media (min-width: $bp-extralarge) {
        font-size: 1.375rem;
      }

      @media (min-width: $bp-4k) {
        font-size: calc(1.5 * 1.375rem);
      }

      h2 {
        color: $mediumgrey;
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 0;

        @media (min-width: $bp-extralarge) {
          font-size: $font-size-extralarge;
        }

        @media (min-width: $bp-4k) {
          font-size: $font-size-extralarge-4k;
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
      font-weight: 700;
      border-radius: 0.25em;
      margin-top: 1rem;
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
        color: $greyblack;

        &:hover {
          background-color: $white;
        }
      }
    }

    .cta-illustration {
      margin-top: 1rem;
      margin-left: 1rem;
      margin-right: 1rem;
      height: 175px;
      position: relative;
      flex-shrink: 0;

      @media (min-width: $bp-medium) {
        height: auto;
        width: 40%;
      }

      @media (min-width: $bp-4k) {
        margin-top: 1.5rem;
        margin-left: 1.5rem;
        margin-right: 1.5rem;
      }

      img {
        position: absolute;
        left: 0;
        bottom: 0;
        max-height: 100%;
        right: 0;
        margin: 0 auto;
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
