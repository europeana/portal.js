<template>
  <b-card
    v-masonry-tile
    class="text-left header-card mb-4"
  >
    <div
      v-if="resizedLogo"
      class="organisation-logo mb-2"
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
        class="btn-link p-0 mt-0 mb-1"
        variant="link"
        @click="toggleMoreDescription"
      >
        {{ showAll ? $t('showLess') : $t('showMore') }}
      </b-button>
    </b-card-text>
    <b-button
      v-if="moreData"
      class="d-inline-flex align-items-center"
      @click="$bvModal.show('entityInformationModal')"
    >
      <span class="icon-info pr-1" />
      {{ $t('actions.learnMore') }}
    </b-button>
    <EntityInformationModal
      v-if="moreData"
      :title="title"
      :entity-info="moreData"
    />
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
        <EntityUpdateModal
          :body="proxy"
          :description="description.values[0] || null"
        />
      </template>
    </client-only>
  </b-card>
</template>

<script>
  import ClientOnly from 'vue-client-only';
  import { getWikimediaThumbnailUrl } from '@/plugins/europeana/entity';
  import ShareButton from '@/components/sharing/ShareButton';
  import SocialShareModal from '@/components/sharing/SocialShareModal';

  export default {
    name: 'EntityHeader',

    components: {
      ClientOnly,
      ShareButton,
      SocialShareModal,
      EntityUpdateModal: () => import('@/components/entity/EntityUpdateModal'),
      EntityInformationModal: () => import('@/components/entity/EntityInformationModal')
    },

    props: {
      /**
       * Title of the entity
       */
      title: {
        type: Object,
        required: true
      },
      /**
       * Description of the entity as object with 'values' (array of strings) and 'code' two letter language code
       */
      description: {
        type: Object,
        default: null
      },
      /**
       * Text taken from the description value
       */
      descriptionText: {
        type: String,
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
      moreData: {
        type: Object,
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
        this.$nextTick(() => {
          this.$redrawVueMasonry();
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .header-card .btn {
    margin-right: 0.5rem;
    margin-top: 0.5rem;
  }
</style>

<docs lang="md">
  ```jsx
    <div style="background-color: #ededed; margin: -16px; padding: 16px;">
      <EntityHeader
        :description="{ values: ['Discover inspiring art, artists and stories in the digitised collections of European museums, galleries, libraries and archives. Explore paintings, drawings, engravings and sculpture from cultural heritage institutions across Europe. Discover inspiring art, artists and stories in the digitised collections of European museums, galleries, libraries and archives. Explore paintings, drawings, engravings and sculpture from cultural heritage institutions across Europe.'] }"
        :title="{ values: ['Title'] }"
        logo="https://cdn.jsdelivr.net/npm/@europeana/portal@1.62.2/.nuxt/dist/client/img/logo.e9d9080.svg"
        :editable="true"
        externalLink="https://www.europeana.eu"
        :moreData="{
          website: { label: 'website', value: 'https://www.europeana.eu' },
          country: { label: 'Country', value: 'The Netherlands' },
          acronym: {label: 'Acronym', value: 'EF' },
          city: { label: 'city', value: 'The Hague' }
        }"
      />
    </div>
  ```
</docs>
