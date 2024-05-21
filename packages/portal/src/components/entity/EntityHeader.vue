<template>
  <b-card
    :v-masonry-tile="$store.state.search.view !== 'list'"
    class="masonry-tile text-left header-card mb-4"
  >
    <div
      v-if="resizedLogo"
      class="organisation-logo mb-2"
      data-qa="entity logo"
      :style="`background-image: url(${resizedLogo})`"
    />
    <b-card-title
      title-tag="h2"
      :lang="langAttribute(title.code)"
      data-qa="entity title"
    >
      {{ title.values[0] }}
    </b-card-title>
    <b-card-sub-title
      v-if="subTitle"
      :lang="langAttribute(subTitle.code)"
    >
      {{ subTitle.values[0] }}
    </b-card-sub-title>
    <b-card-text
      v-if="hasDescription"
      text-tag="div"
      class="mb-2 description"
    >
      <p
        data-qa="entity description"
        :lang="langAttribute(description.code)"
      >
        {{ showAll ? fullDescription : truncatedDescription }}
      </p>
      <b-button
        v-if="fullDescription.length > limitCharacters"
        data-qa="entity show link"
        class="btn-link p-0 mt-0 mb-1"
        variant="link"
        @click="toggleMoreDescription"
      >
        {{ showAll ? $t('actions.showLess') : $t('actions.showMore') }}
      </b-button>
    </b-card-text>
    <template
      v-if="moreInfo"
    >
      <b-button
        class="d-inline-flex align-items-center"
        data-qa="entity details button"
        @click="$bvModal.show('entityInformationModal')"
      >
        <span class="icon-info pr-1" />
        {{ $t('actions.learnMore') }}
      </b-button>
      <EntityInformationModal
        :title="title"
        :entity-info="moreInfo"
      />
    </template>
    <b-button
      v-if="externalLink"
      class="d-inline-flex align-items-center"
      :href="externalLink"
      target="_blank"
    >
      <span class="icon-link pr-1" />
      {{ $t('website') }}
    </b-button>
    <ShareButton />
    <ShareSocialModal :media-url="image ? image : logo" />
    <client-only>
      <template
        v-if="editable"
      >
        <b-button
          class="d-inline-flex align-items-center"
          data-qa="entity edit button"
          @click="$bvModal.show('entityUpdateModal')"
        >
          <span class="icon-edit pr-1" />
          {{ $t('actions.edit') }}
        </b-button>
        <EntityUpdateModal
          :id="id"
          :description="description && description.values[0] || null"
          @updated="$emit('updated')"
        />
      </template>
    </client-only>
  </b-card>
</template>

<script>
  import ClientOnly from 'vue-client-only';
  import langAttributeMixin from '@/mixins/langAttribute';
  import { truncate } from '@europeana/utils';
  import { getWikimediaThumbnailUrl } from '@/utils/wikimedia.js';
  import ShareButton from '@/components/share/ShareButton';
  import ShareSocialModal from '@/components/share/ShareSocialModal';

  export default {
    name: 'EntityHeader',

    components: {
      ClientOnly,
      ShareButton,
      ShareSocialModal,
      EntityUpdateModal: () => import('@/components/entity/EntityUpdateModal'),
      EntityInformationModal: () => import('@/components/entity/EntityInformationModal')
    },

    mixins: [
      langAttributeMixin
    ],

    props: {
      /**
       * Title of the entity
       */
      title: {
        type: Object,
        required: true
      },
      /**
       * URI of the entity
       */
      id: {
        type: String,
        required: true
      },
      /**
       * Sub-title of the entity
       */
      subTitle: {
        type: Object,
        default: null
      },
      /**
       * Description of the entity as object with 'values' (array of strings) and 'code' two letter language code
       */
      description: {
        type: Object,
        default: null
      },
      /**
       * Logo image file path (currently only used for organisation entity)
       */
      logo: {
        type: String,
        default: null
      },
      /**
       * Image file path for social media sharing
       */
      image: {
        type: String,
        default: null
      },
      /**
       * If 'true' enables the edit button and modal
       */
      editable: {
        type: Boolean,
        default: false
      },
      /**
       * Website link (currently only used for organisation entity)
       */
      externalLink: {
        type: String,
        default: null
      },
      /**
       * Proxy needed to update editable description
       */
      proxy: {
        type: Object,
        default: () => ({})
      },
      /**
       * More entity data to show in modal (currently only used for organisation entity)
       */
      moreInfo: {
        type: Array,
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
        return truncate(this.fullDescription, this.limitCharacters);
      },
      hasDescription() {
        return (this.description?.values?.length || 0) >= 1;
      },
      fullDescription() {
        return this.hasDescription ? this.description.values[0] : '';
      },
      resizedLogo() {
        return getWikimediaThumbnailUrl(this.logo, 72);
      }
    },
    methods: {
      toggleMoreDescription() {
        this.showAll = !this.showAll;
        this.$nextTick(() => {
          this.$redrawVueMasonry();
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .header-card {
    border: 0;
    box-shadow: $boxshadow-small;

    h2 {
      font-family: $font-family-ubuntu;
      font-size: $font-size-medium;
      margin-bottom: 0.25rem;
      font-weight: 500;
      line-height: normal;

      @media (min-width: $bp-small) {
        font-size: $font-size-large;
        line-height: 1.5;
        margin-bottom: 0;
      }

      @at-root .xxl-page & {
        @media (min-width: $bp-4k) {
          font-size: $font-size-large-4k;
        }
      }
    }

    .card-text {
      font-size: $font-size-small;
      color: $mediumgrey;

      @at-root .xxl-page & {
        @media (min-width: $bp-4k) {
          font-size: $font-size-small-4k;
        }
      }
    }

    .btn {
      margin-right: 0.5rem;
      margin-top: 0.5rem;

      @at-root .xxl-page & {
        @media (min-width: $bp-4k) {
          margin-right: 0.75rem;
          margin-top: 0.75rem;
        }
      }
    }
  }

  .card-subtitle {
    margin-top: 0.5rem;
    margin-bottom: 0.375rem;
    font-size: $font-size-extrasmall;
    color: $mediumgrey;
    text-transform: uppercase;

    @at-root .xxl-page & {
      @media (min-width: $bp-4k) {
        margin-top: 0.75rem;
        margin-bottom: calc(1.5 * 0.375rem);
        font-size: $font-size-extrasmall-4k;
      }
    }
  }
</style>

<docs lang="md">
  ```jsx
    <div style="background-color: #ededed; margin: -16px; padding: 16px;">
      <EntityHeader
        id="http://data.europeana.eu/concept/190"
        :description="{ values: [
          'Discover inspiring art, artists and stories in the digitised collections of European museums, galleries,\
           libraries and archives. Explore paintings, drawings, engravings and sculpture from cultural heritage institutions\
           across Europe. Discover inspiring art, artists and stories in the digitised collections of European museums, galleries,\
           libraries and archives. Explore paintings, drawings, engravings and sculpture from cultural heritage institutions\
           across Europe.'
        ] }"
        :title="{ values: ['Title'] }"
        logo="https://cdn.jsdelivr.net/npm/@europeana/portal@1.62.2/.nuxt/dist/client/img/logo.e9d9080.svg"
        :editable="true"
        externalLink="https://www.europeana.eu"
        :moreInfo="[{ label: 'website', value: 'https://www.europeana.eu' },
          { label: 'Country', value: 'The Netherlands' },
          { label: 'Acronym', value: 'EF' },
          { label: 'city', value: 'The Hague' }
        ]"
      />
    </div>
  ```
</docs>
