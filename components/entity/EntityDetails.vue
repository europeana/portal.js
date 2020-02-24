<template>
  <b-row class="mb-3">
    <b-col
      v-if="depictionThumbnail && depictionAttribution"
      cols="12"
      sm="3"
    >
      <SmartLink
        :destination="depictionAttribution"
        :title="depictionLinkTitle"
        link-class="depiction mb-3 d-block overflow-hidden rounded-circle position-relative"
        data-qa="entity attribution"
      >
        <b-img-lazy
          :src="depictionThumbnail"
          fluid
          :alt="$t('depiction', { title: title.values[0] })"
          data-qa="entity depiction"
          @error.native="depictionNotFound"
        />
      </SmartLink>
    </b-col>
    <b-col>
      <h1
        :lang="title.code"
        data-qa="entity title"
      >
        {{ title.values[0] }}
      </h1>
      <div
        v-if="hasDescription"
        class="mb-3"
      >
        <p
          data-qa="entity description"
          :lang="description.code"
        >
          {{ showAll ? fullDescription : truncatedDescription }}
        </p>
        <b-link
          v-if="fullDescription.length > limitCharacters"
          data-qa="entity show link"
          class="btn-link is-size-4"
          @click="toggleMoreDescription"
        >
          {{ showAll ? $t('showLess') : $t('showMore') }}
        </b-link>
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
      depiction: {
        type: String,
        default: ''
      },
      attribution: {
        type: String,
        default: ''
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
      depictionLinkTitle: {
        type: String,
        default: null
      }
    },
    data() {
      return {
        depictionAttribution: this.attribution,
        depictionThumbnail: this.depiction,
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
      depictionNotFound() {
        // clear depictionThumbnail and attribution to prevent showing a broken image and
        // contextless link
        this.depictionThumbnail = '';
        this.depictionAttribution = '';
      },
      toggleMoreDescription() {
        this.showAll = !this.showAll;
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "./assets/scss/variables.scss";

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
</style>
