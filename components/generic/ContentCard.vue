<template>
  <b-card
    class="mb-4 text-left"
    data-qa="content card"
    no-body
  >
    <SmartLink
      :destination="url"
    >
      <div
        v-if="imageUrl"
        :aria-label="name"
        :style="{'background-image': 'url(' + imageUrl + ')'}"
        class="card-img"
      />
      <b-card-body>
        <b-card-title>
          {{ name }}
        </b-card-title>
        <b-card-text
          v-for="text in texts"
          :key="text"
        >
          {{ text }}
        </b-card-text>
        {{ $t(viewMoreLabelKey) }}
      </b-card-body>
    </SmartLink>
  </b-card>
</template>

<script>
  export default {
    props: {
      name: {
        type: String,
        default: ''
      },
      texts: {
        type: Array,
        default: () => []
      },
      url: {
        type: String,
        default: 'https://www.europeana.eu/'
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

  .card-img {
    background-position: center center;
    background-size: cover;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    display: flex;
    flex: 1 1 auto;
    min-height: 10rem;
    width: 100%;

    a {
      flex: 1;
    }
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
      box-shadow: 0 4px 12px 0 rgba(0,0,0,0.4);
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
      color: $black;
      &:hover {
        color: $black;
      }
    }
  }
</style>
