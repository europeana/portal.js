<template>
  <b-card
    class="text-center info-card"
    data-qa="info card"
    no-body
    :class="cardClass"
  >
    <component
      :is="url ? 'SmartLink' : 'div'"
      :destination="url"
      :link-class="url ? 'card-link' : null"
    >
      <div
        v-if="image"
        class="card-img"
      >
        <span :class="image" />
      </div>
      <b-card-body data-qa="card body">
        <b-card-title
          v-if="info"
          title-tag="div"
          data-qa="card info"
        >
          <span>
            {{ info }}
          </span>
        </b-card-title>
        <b-card-text
          text-tag="div"
          class="text-uppercase"
        >
          {{ label }}
        </b-card-text>
      </b-card-body>
    </component>
  </b-card>
</template>

<script>
  import SmartLink from './SmartLink';
  export default {
    name: 'InfoCard',

    components: {
      SmartLink
    },

    props: {
      url: {
        type: Object,
        default: null
      },
      info: {
        type: String,
        default: ''
      },
      label: {
        type: String,
        default: null
      },
      image: {
        type: String,
        default: ''
      },
      variant: {
        type: String,
        default: 'default' // other options: dark
      }
    },

    computed: {
      cardClass() {
        return this.url ? `linked-card ${this.variant}-card` : `${this.variant}-card`;
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/icon-font';

  .info-card {
    background: $white;
    border-radius: $border-radius-large;
    box-shadow: none;
    color: $greyblack;
    border: none;
    transition: box-shadow 0.25s;

    &.dark-card {
      background: $bodygrey;
    }

    &.linked-card:hover {
      box-shadow: $boxshadow-small;
      transition: box-shadow 0.25s;
    }

    a {
      text-decoration: none;
    }

    .card-body {
      padding: 0.625rem 1rem 0.5rem;
    }

    .card-title {
      color: $blue;
      font-size: 1.5rem;
      line-height: 1.75rem;
      margin-bottom: 0.25rem;
    }

    .card-text {
      font-weight: 700;
      font-size: $font-size-extrasmall;
      line-height: 1.75rem;
    }

    .card-img {
      @extend %icon-font;

      font-size: 2rem;
      margin-top: 1rem;

      .ic-3d {
        &::after {
          content: '\e942';
        }
      }

      .ic-video {
        &::after {
          content: '\e943';
        }
      }

      .ic-sound {
        &::after {
          content: '\e944';
        }
      }

      .ic-text {
        &::after {
          content: '\e945';
        }
      }

      .ic-image {
        &::after {
          content: '\e946';
        }
      }
    }
  }
</style>

<docs lang="md">
  Variant "default":
  ```jsx
  <InfoCard
    :url="{ name: 'search', query: { query: '', qf: 'TYPE:`IMAGE`' } }"
    info="29,734,524"
    label="image"
    image="ic-image"
  />
  ```

  Variant "dark":
  ```jsx
  <InfoCard
    :url="{ name: 'search', query: { query: '', qf: 'TYPE:`IMAGE`' } }"
    info="29,734,524"
    label="image"
    image="ic-image"
    variant="dark"
  />
  ```
</docs>
