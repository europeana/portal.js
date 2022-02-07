<template>
  <b-card
    v-masonry-tile
    class="text-left header-card"
  >
    <div
      v-if="resizedLogo"
      class="organisation-logo"
      data-qa="entity logo"
      :style="`background-image: url(${resizedLogo})`"
    />
    <b-card-title
      title-tag="h1"
      :lang="title.code"
      data-qa="entity title"
    >
      {{ title.values[0] }}
    </b-card-title>
    <b-card-text
      v-if="hasDescription"
      text-tag="div"
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
    </b-card-text>
  </b-card>
</template>

<script>
  import { getWikimediaThumbnailUrl } from '@/plugins/europeana/entity';

  export default {
    name: 'EntityHeader',

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
      logo: {
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
        return (this.description?.values?.length || 0) >= 1;
      },
      fullDescription() {
        return this.hasDescription ? this.description.values[0] : '';
      },
      resizedLogo() {
        return getWikimediaThumbnailUrl(this.logo, 60);
      }
    },
    methods: {
      toggleMoreDescription() {
        this.showAll = !this.showAll;
      }
    }
  };
</script>
