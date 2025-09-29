<template>
  <div
    class="landing-info-card-group"
    :class="[variant, backgroundImageClasses]"
  >
    <b-container
      class="text-center"
    >
      <b-col class="header col-lg-8 text-center mx-auto px-0">
        <component :is="titleTag">
          {{ title }}
        </component>
        <!-- eslint-disable vue/no-v-html -->
        <div
          v-if="text"
          class="text mb-3"
          v-html="parseMarkdown(text)"
        />
        <!-- eslint-enable vue/no-v-html -->
      </b-col>
      <div
        v-if="infoCards.length"
        class="cards-wrapper d-lg-flex flex-wrap mx-auto"
        :class="{
          'justify-content-between text-lg-left': twoColCardsLayout,
          'justify-content-center': threeColCardsLayout
        }"
        data-qa="landing info card group cards wrapper"
      >
        <LandingInfoCard
          v-for="(card, index) in infoCards"
          :key="index"
          :card="card"
          :centered-content="threeColCardsLayout"
        />
      </div>
      <SmartLink
        v-if="link?.url"
        :destination="link.url"
        data-qa="call to action"
        class="btn btn-cta btn-primary"
        hide-external-icon
      >
        {{ link.text }}
      </SmartLink>
    </b-container>
  </div>
</template>

<script>
  import parseMarkdown from '@/utils/markdown/parse.js';

  export default {
    name: 'LandingInfoCardGroup',

    components: {
      LandingInfoCard: () => import('@/components/landing/LandingInfoCard'),
      SmartLink: () => import('@/components/generic/SmartLink')
    },

    props: {
      /**
       * Heading title to display above the info cards
       */
      title: {
        type: String,
        default: null
      },
      /**
       * Heading title level to use. Override default for when used in subsection to keep correct heading structure.
       */
      titleTag: {
        type: String,
        default: 'h2'
      },
      /**
       * Text to display under title and above the info cards
       */
      text: {
        type: String,
        default: null
      },
      /**
       * List of info cards
       */
      infoCards: {
        type: Array,
        default: () => []
      },
      link: {
        type: Object,
        default: null
      },
      /**
       * Variant to define layout and style
       * @values pro, ds4ch
       */
      variant: {
        type: String,
        default: 'pro'
      },
      /**
       * Background image Object
       */
      backgroundImage: {
        type: Object,
        default: () => {}
      }
    },

    data() {
      return {
        backgroundImageClasses: this.backgroundImage?.profile?.background && `bg-color-${this.backgroundImage?.profile?.background}`,
        threeColCardsLayout: this.infoCards.length % 3 === 0,
        twoColCardsLayout: this.infoCards.length % 3 !== 0
      };
    },

    methods: {
      parseMarkdown
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .container {
    margin-top: 3rem;

    @media (min-width: $bp-large) {
      margin-top: 6rem;
      margin-bottom: 2rem;
    }

    @media (min-width: $bp-4k) {
      margin-top: 15rem;
      margin-bottom: 7rem;
    }
  }

  .landing-info-card-group {

    &.bg-color-alternate {
      background-color: $lightgrey;

      .container {
        padding-top: 3rem;
        margin-top: 0;
        margin-bottom: 0;

        @media (min-width: $bp-large) {
          padding-top: 6rem;
          padding-bottom: 2rem;
        }

        @media (min-width: $bp-4k) {
          padding-top: 15rem;
          padding-bottom: 7rem;
        }
      }
    }
  }

  .header {
    @media (min-width: $bp-xxl) {
      max-width: $max-text-column-width;
    }

    @media (min-width: $bp-4k) {
      max-width: $max-text-column-width-landing-4k;
    }
  }

  .text {
    color: $darkgrey;
  }

  .cards-wrapper {
    max-width: 1250px;
    margin-top: 3rem;

    @media (min-width: $bp-large) {
      margin-top: 4rem;
    }

    @media (min-width: $bp-4k) {
      margin-top: 8rem;
      max-width: 2500px;
    }
  }

  .btn {
    margin-bottom: 3rem;

    @media (min-width: $bp-large) {
      margin-bottom: 4rem;
    }

    @media (min-width: $bp-4k) {
      margin-bottom: 8rem;
    }
  }
</style>

<!-- Only DS4CH styles after this line! -->
<style lang="scss" scoped>
  @import '@europeana/style/scss/DS4CH/variables';

  .landing-info-card-group.ds4ch {

    .header {
      @media (min-width: $bp-4k) {
        max-width: 1450px !important;
        padding-bottom: 5rem;
      }
    }

    h2 {
      @extend %title-2;
      margin-bottom: 0.75rem;

      @media (min-width: $bp-4k) {
        margin-bottom: 2rem;
      }
    }

    .text {
      color: $black;

      @media (min-width: $bp-4k) {
        font-size: 2.5rem;
        margin-bottom: 3.125rem;
      }
    }
  }
</style>

<docs lang="md">
  ```jsx
    import '@europeana/style/scss/landing.scss';
    <div class="landing-page xxl-page">
      <LandingInfoCardGroup
        title="This is a title for an info card group"
        text="A __description__ what this section is all about"
        :info-cards="[{
          __typename: 'InfoCard',
          name: 'Title for an info card',
          text: 'This text contains info. It can be __marked__ and accompanied by an image.',
          image: {
            url: illustrations.support,
            contentType: 'image/svg+xml', description: '', width: 111, height: 111
          }
        }, {
          __typename: 'InfoCard',
          name: 'Title for an info card',
          text: 'This text contains info. It can be __marked__ and accompanied by an image.',
          image: {
            url: illustrations.support,
            contentType: 'image/svg+xml', description: '', width: 111, height: 111
          }
        }]"
      />
    </div>
  ```
  Card group in 3 column layout
  ```jsx
    import '@europeana/style/scss/landing.scss';
    <div class="landing-page xxl-page">
      <LandingInfoCardGroup
        title="This is a title for an info card group"
        text="A __description__ what this section is all about"
        :info-cards="[{
          __typename: 'InfoCard',
          name: 'Title for an info card',
          text: 'This text contains info. It can be __marked__ and accompanied by an image.',
          image: {
            url: illustrations.support,
            contentType: 'image/svg+xml', description: '', width: 111, height: 111
          },
          link: {
            url: '/',
            text: 'Read more link'
          }
        }, {
          __typename: 'InfoCard',
          name: 'Title for an info card',
          text: 'This text contains info. It can be __marked__ and accompanied by an image.',
          image: {
            url: illustrations.support,
            contentType: 'image/svg+xml', description: '', width: 111, height: 111
          },
          link: {
            url: '/',
            text: 'Read more link'
          }
        },
          {
          __typename: 'InfoCard',
          name: 'Title for an info card',
          text: 'This text contains info. It can be __marked__ and accompanied by an image.',
          image: {
            url: illustrations.support,
            contentType: 'image/svg+xml', description: '', width: 111, height: 111
          },
          link: {
            url: '/',
            text: 'Read more link'
          }
        }]"
      />
    </div>
  ```
</docs>
