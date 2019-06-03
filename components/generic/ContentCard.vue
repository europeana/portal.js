<template>
  <b-card
    class="mb-4 text-left"
    data-qa="content card"
    no-body
  >
    <div
      v-if="imageUrl"
      :aria-label="name"
      :style="{'background-image': 'url(' + imageUrl + ')'}"
      class="card-img"
    >
      <b-link
        v-if="identifier"
        :to="linkToRecord"
        class="card-link record-link"
        :aria-label="$t('goToRecord')"
      />
      <b-link
        v-else
        :href="url"
        class="card-link"
        :aria-label="$t('readMore')"
      />
    </div>
    <b-card-body>
      <b-card-title>
        <b-link
          v-if="identifier"
          :to="linkToRecord"
          class="card-link record-link"
        >
          {{ name }}
        </b-link>
        <b-link
          v-else
          :href="url"
          class="card-link"
        >
          {{ name }}
        </b-link>
      </b-card-title>
      <b-card-text
        v-for="text in cardText"
        :key="text"
      >
        {{ text }}
      </b-card-text>
      <b-link
        v-if="identifier"
        :to="linkToRecord"
        class="card-link record-link"
      >
        {{ $t('goToRecord') }}
      </b-link>
      <b-link
        v-else
        :href="url"
        class="card-link"
      >
        {{ $t('readMore') }}
      </b-link>
    </b-card-body>
  </b-card>
</template>

<script>
  export default {
    props: {
      name: {
        type: String,
        default: ''
      },
      description: {
        type: String,
        default: ''
      },
      url: {
        type: String,
        default: 'https://www.europeana.eu/'
      },
      imageUrl: {
        type: String,
        default: ''
      },
      creator: {
        type: String,
        default: ''
      },
      provider: {
        type: String,
        default: ''
      },
      identifier: {
        type: String,
        default: ''
      }
    },
    computed: {
      linkToRecord () {
        return this.localePath({ name: 'record-all', params: { pathMatch: this.identifier.replace(/^\/+/g, '') } });
      },
      cardText () {
        return [this.description, this.creator, this.provider].filter(v => v);
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
      box-shadow: 0 4px 12px 0 rgba(0,0,0,0.4)
    }

    .card-body {
      flex: 0;
      padding: 1rem;
      width: 100%;
    }

    .card-title {
      font-size: $font-size-small;
      font-weight: normal;

      a {
        color: inherit;

        &:hover {
          color: $blue;
          text-decoration: none;
        }
      }
    }
  }
</style>
