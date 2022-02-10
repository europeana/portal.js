<template>
  <b-card
    v-masonry-tile
    class="text-left header-card mb-4"
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
      class="mb-2 description"
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
    <b-button
      v-if="learnMore"
      class="d-inline-flex align-items-center"
      @click="$bvModal.show('entityInformationModal')"
    >
      <span class="icon-info pr-1" />
      {{ $t('actions.learnMore') }}
    </b-button>
    <b-button
      v-if="externalLink"
      class="d-inline-flex align-items-center"
      :href="externalLink"
    >
      <span class="icon-link pr-1" />
      {{ $t('website') }}
    </b-button>
    <ShareButton />
    <SocialShareModal :media-url="image ? image : logo" />
    <client-only>
      <template
        v-if="editable"
      >
        <b-button
          class="d-inline-flex align-items-center"
          @click="$bvModal.show('entityUpdateModal')"
        >
          <span class="icon-edit pr-1" />
          {{ $t('actions.edit') }}
        </b-button>
      </template>
    </client-only>
    <slot />
  </b-card>
</template>

<script>
  import { getWikimediaThumbnailUrl } from '@/plugins/europeana/entity';
  import ShareButton from '@/components/sharing/ShareButton';
  import SocialShareModal from '@/components/sharing/SocialShareModal';

  export default {
    name: 'EntityHeader',

    components: {
      ShareButton,
      SocialShareModal
    },

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
      },
      image: {
        type: String,
        default: null
      },
      editable: {
        type: Boolean,
        default: false
      },
      externalLink: {
        type: String,
        default: null
      },
      learnMore: {
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

<style lang="scss" scoped>
  .header-card .btn {
    text-transform: uppercase;
    font-weight: 600;
    margin-right: 0.5rem;
    margin-top: 0.5rem;
  }
</style>
