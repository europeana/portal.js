<template>
  <b-card
    class="mb-4 text-left"
    data-qa="content card"
    no-body
  >
    <SmartLink
      :destination="url"
      link-class="card-link"
    >
      <div
        v-if="imageUrl"
        :aria-label="title"
        :style="cardImageStyle"
        class="card-img"
      />
      <b-card-body>
        <b-card-title>
          {{ title | truncate(90, $t('formatting.ellipsis')) }}
        </b-card-title>
        <b-card-text
          v-for="(text, index) in texts"
          :key="index"
        >
          {{ text }}
        </b-card-text>
      </b-card-body>
    </SmartLink>
  </b-card>
</template>

<script>
  import SmartLink from './SmartLink';

  export default {
    components: {
      SmartLink
    },
    props: {
      title: {
        type: String,
        default: ''
      },
      texts: {
        type: Array,
        default: () => []
      },
      url: {
        type: [String, Object],
        default: ''
      },
      imageUrl: {
        type: String,
        default: ''
      }
    },
    computed: {
      cardImageStyle() {
        return {
          backgroundImage: `url("${this.imageUrl}")`
        };
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "./assets/scss/variables.scss";

  a {
    display: flex;
    flex-direction: column;
  }

  .card-img {
    background-position: center center;
    background-size: cover;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    display: flex;
    flex: 1 1 auto;
    min-height: 10rem;
    width: 100%;
  }

  .card {
    background: $extralightgrey;
    border-radius: $border-radius-small;
    box-shadow: $boxshadow-small;
    color: $black;
    font-size: $font-size-extrasmall;
    height: auto;
    line-height: 1.1875rem;
    transition: box-shadow 0.25s;

    @media (min-width: $bp-medium) {
      min-height: 20rem;
    }

    &:hover {
      box-shadow: $boxshadow-large;
      background-color: $lightgrey;
    }

    .card-body {
      flex: 0;
      padding: 1rem;
      width: 100%;
    }

    .card-title {
      font-size: $font-size-small;
      font-weight: normal;
    }

    .card-title:last-child {
      margin-bottom: 0;
    }

    .card-text {
      color: $darkgrey;
    }

    .card-link {
      min-height: 100%;
      color: $black;
      &:hover {
        color: $black;
      }
    }
  }
</style>
