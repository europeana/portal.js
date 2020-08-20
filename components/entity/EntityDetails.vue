<template>
  <b-row class="mb-3">
    <b-col>
      <h1
        :lang="title.code"
        data-qa="entity title"
        class="pt-3"
      >
        {{ searchInTitle }}
      </h1>
      <div
        v-if="hasDescription"
        class="mb-3 w-75 description"
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
        <!-- <p class="curated d-flex align-items-center">
          <span class="ic-verified" />
          {{ $t('curatedAutomatically') }}
        </p> -->
      </div>
      <SmartLink
        v-if="hasDescription && !isEditorialDescription"
        destination="/rights/europeana-data-sources"
        class="d-flex font-weight-bold is-size-4"
      >
        {{ $t('learnMore') }}
      </SmartLink>
    </b-col>
  </b-row>
</template>

<script>
  import SmartLink from '../../components/generic/SmartLink';

  export default {
    components: {
      SmartLink
    },

    props: {
      title: {
        type: Object,
        required: true
      },
      query: {
        type: String,
        default: null
      },
      // Description as object with 'values' (array of strings) and 'code' two letter language code
      description: {
        type: Object,
        default: null
      },
      isEditorialDescription: {
        type: Boolean,
        default: false
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
      },
      searchInTitle() {
        let search = '';

        if (this.query) {
          search = `"${this.query}" ${this.$t('header.in')}`;
        }
        return `${search} ${this.title.values[0]}`;
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
  @import './assets/scss/variables.scss';
  @import './assets/scss/icons.scss';

  .depiction {
    box-shadow: $boxshadow-small;
    padding-top: 100%;
    width: 100%;

    img {
      bottom: 0;
      height: 100%;
      left: 0;
      object-fit: cover;
      position: absolute;
      right: 0;
      top: 0;
      width: 100%;
    }
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

  @media (max-width: $bp-large) {
    .description {
      width: 100% !important;
    }
  }
</style>
