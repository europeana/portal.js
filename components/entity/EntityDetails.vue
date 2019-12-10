<template>
  <b-row>
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
        <b-img
          :src="depictionThumbnail"
          fluid
          :alt="$t('depiction', { title: title })"
          data-qa="entity depiction"
          @error="depictionNotFound"
        />
      </SmartLink>
    </b-col>
    <b-col>
      <h1 data-qa="entity title">
        {{ title }}
      </h1>
      <p
        v-if="description"
        data-qa="entity description"
      >
        {{ showAll ? description : truncatedDescription }}
        <br>
        <b-link
          v-if="description.length > limitCharacters"
          data-qa="entity show link"
          class="mt-3 btn-link"
          @click="toggleMoreDescription"
        >
          {{ showAll ? $t('showLess') : $t('showMore') }}
        </b-link>
      </p>
      <SmartLink
        v-if="description"
        destination="/rights/europeana-data-sources"
        class="d-flex mt-5"
      >
        <small class="font-weight-bold">
          {{ $t('learnMore') }}
        </small>
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
        type: String,
        default: ''
      },
      depiction: {
        type: String,
        default: ''
      },
      attribution: {
        type: String,
        default: ''
      },
      description: {
        type: String,
        default: ''
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
        limitCharacters: 200,
        showAll: false
      };
    },
    computed: {
      truncatedDescription() {
        return this.$options.filters.truncate(this.description, 255, this.$t('formatting.ellipsis'));
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

  .attribution {
    font-size: $font-size-extrasmall;
  }

  .btn-link {
    color: $black;
    display: inline-block;
    font-size: $font-size-small;
    text-decoration: underline;
    text-transform: uppercase;

    &:hover {
      text-decoration: none;
    }
  }
</style>
