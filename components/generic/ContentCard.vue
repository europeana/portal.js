<template>
  <b-card
    class="mb-4 text-left"
    data-qa="content card"
    no-body
  >
    <div
      v-if="image && image.fields"
      :aria-label="name"
      :style="{'background-image': 'url(' + image.fields.file.url + ')'}"
      class="card-img"
    >
      <a
        :href="url"
        aria-label="Read more"
      />
    </div>
    <b-card-body>
      <b-card-title>
        <a
          :href="url"
        >
          {{ name }}
        </a>
      </b-card-title>
      <b-card-text>
        {{ description }}
        <template v-if="creator || institution">
          {{ creator }} <br>
          {{ institution }}
        </template>
      </b-card-text>
      <b-link
        v-if="recordId"
        :to="linkToRecord"
        class="card-link"
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
      image: {
        type: Object,
        default: () => {}
      },
      creator: {
        type: String,
        default: ''
      },
      institution: {
        type: String,
        default: ''
      },
      recordId: {
        type: String,
        default: ''
      }
    },
    computed: {
      linkToRecord () {
        return this.localePath({ name: 'record-all', params: { pathMatch: this.recordId.replace(/^\/+/g, '') } });
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
