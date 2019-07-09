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
        :style="{'background-image': 'url(' + imageUrl + ')'}"
        class="card-img"
      />
      <b-card-body>
        <b-card-title>
          {{ title }}
        </b-card-title>
        <b-card-text
          v-for="(text, index) in texts"
          :key="index"
        >
          {{ text }}
        </b-card-text>
        <span
          v-if="viewMoreLabelKey"
          class="view-more"
        >
          {{ $t(viewMoreLabelKey) }}
        </span>
      </b-card-body>
    </SmartLink>
  </b-card>
</template>

<script>
  export default {
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
      },
      viewMoreLabelKey: {
        type: String,
        default: null
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
    min-height: 20rem;
    transition: box-shadow 0.25s;

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
