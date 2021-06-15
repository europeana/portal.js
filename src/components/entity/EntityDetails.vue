<template>
  <b-row class="mb-3">
    <b-col>
      <img
        v-if="depiction"
        :src="depiction"
        alt=""
        class="depiction"
        data-qa="entity depiction"
      >
      <div
        class="context-label"
        data-qa="entity label"
      >
        {{ contextLabel }}
      </div>
      <h1
        :lang="title.code"
        data-qa="entity title"
      >
        {{ title.values[0] }}
      </h1>
      <div
        v-if="hasDescription"
        class="mb-2 w-75 description"
      >
        <p
          data-qa="entity description"
          :lang="description.code"
        >
          {{ showAll ? fullDescription : truncatedDescription }}
        </p>
        <b-button
          v-if="fullDescription.length > limitCharacters"
          data-qa="entity show link"
          class="btn-link is-size-4 p-0"
          variant="link"
          @click="toggleMoreDescription"
        >
          {{ showAll ? $t('showLess') : $t('showMore') }}
        </b-button>
      </div>
      <div
        v-if="externalLink"
        class="external-link"
        data-qa="entity external link"
      >
        {{ $t('website') }}:
        <b-link
          :href="externalLink"
          target="_blank"
        >
          {{ externalLink }}
        </b-link>
      </div>
    </b-col>
  </b-row>
</template>

<script>
  export default {
    props: {
      title: {
        type: Object,
        required: true
      },
      // Description as object with 'values' (array of strings) and 'code' two letter language code
      description: {
        type: Object,
        default: null
      },
      isEditorialDescription: {
        type: Boolean,
        default: false
      },
      contextLabel: {
        type: String,
        required: true
      },
      depiction: {
        type: String,
        default: null
      },
      externalLink: {
        type: String,
        default: null
      }
    },
    data() {
      return {
        limitCharacters: 255,
        showAll: false
      };
    },
    computed: {
      truncatedDescription() {
        return this.$options.filters.truncate(this.fullDescription, this.limitCharacters, this.$t('formatting.ellipsis'));
      },
      hasDescription() {
        return this.description && this.description.values && this.description.values.length >= 1;
      },
      fullDescription() {
        return this.hasDescription ? this.description.values[0] : '';
      }
    },
    methods: {
      toggleMoreDescription() {
        this.showAll = !this.showAll;
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/variables.scss';
  @import '../../assets/scss/icons.scss';

  h1 {
    margin-bottom: 0.5rem;
  }

  .depiction {
    height: 60px;
    width: 60px;
    border-radius: 50%;
    margin-bottom: 1.5rem;
    object-fit: cover;
  }

  .btn-link {
    color: $black;
    display: inline-block;
    text-decoration: underline;
    text-transform: uppercase;

    &:hover {
      text-decoration: none;
    }
  }

  .external-link {
    font-size: $font-size-small;
    font-weight: 600;
    color: $mediumgrey;

    &:before {
      @extend .icon-font;
      display: inline-block;
      content: '\e936';
      font-size: 1.125rem;
      line-height: 1;
      margin-top: -0.2rem;
    }
  }

  p {
    color: $mediumgrey;
    &.curated {
      font-size: $font-size-small;
      color: $black;
      &:before {
        @extend .icon-font;
        display: inline-block;
        font-size: 1.5rem;
        color: $blue;
        content: '\e923';
        margin-right: 0.325rem;
      }
    }
  }

  .description {
    p:last-child {
      margin-bottom: 0;
    }
  }

  @media (max-width: $bp-large) {
    .description {
      width: 100% !important;
    }
  }
</style>
