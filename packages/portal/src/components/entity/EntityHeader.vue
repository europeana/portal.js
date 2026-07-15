<template>
  <b-card
    :v-masonry-tile="$store.state.search.view !== 'list'"
    class="masonry-tile text-left header-card mb-4"
  >
    <div
      v-if="resizedLogo"
      class="organisation-logo mb-2"
      data-qa="entity logo"
      :style="`background-image: url('${resizedLogo}')`"
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
      v-if="isOrganisationType"
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
        :sub-title="subTitle"
        :entity="entity"
        :english-name="organisationNonNativeEnglishName"
      />
    </template>
    <b-button
      v-if="email"
      class="d-inline-flex align-items-center"
      data-qa="entity contact button"
      :href="`mailto:${email}`"
    >
      <span class="icon-email pr-1" />
      {{ $t('actions.contact') }}
    </b-button>
    <b-button
      v-if="homepage"
      class="d-inline-flex align-items-center"
      :href="homepage"
      target="_blank"
    >
      <span class="icon-link pr-1" />
      {{ $t('website') }}
    </b-button>
    <ShareButton />
    <ShareSocialModal :media-url="thumbnail ? thumbnail : logo" />
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
          :id="entity.id"
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
  import truncate from '@/utils/text/truncate.js';
  import { getWikimediaThumbnailUrl } from '@/plugins/europeana/entity';
  import ShareButton from '@/components/share/ShareButton';
  import ShareSocialModal from '@/components/share/ShareSocialModal';
  import { langMapValueForLocale, uriRegex } from  '@europeana/i18n';
  import { organizationEntityNonNativeEnglishName } from '@/utils/europeana/entities/organizations.js';

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
       * Entity
       */
      entity: {
        type: Object,
        required: true
      },
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
       * If 'true' enables the edit button and modal
       */
      editable: {
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
      organisationNonNativeEnglishName() {
        return this.organizationEntityNonNativeEnglishName(this.entity);
      },
      subTitle() {
        return this.organisationNonNativeEnglishName ?
          langMapValueForLocale(this.organisationNonNativeEnglishName, this.$i18n.locale) :
          null;
      },
      truncatedDescription() {
        return truncate(this.fullDescription, this.limitCharacters);
      },
      hasDescription() {
        return (this.description?.values?.length || 0) >= 1;
      },
      fullDescription() {
        return this.hasDescription ? this.description.values[0] : '';
      },
      isOrganisationType() {
        return ['Organization', 'Aggregator'].includes(this.entity.type);
      },
      logo() {
        if (this.isOrganisationType && this.entity?.logo) {
          return this.entity.logo.id;
        }
        return null;
      },
      resizedLogo() {
        return getWikimediaThumbnailUrl(this.logo, 120);
      },
      email() {
        if (this.isOrganisationType) {
          return this.entity?.mbox;
        }
        return null;
      },
      thumbnail() {
        return this.$apis.entity.imageUrl(this.entity);
      },
      homepage() {
        if (this.isOrganisationType &&
          this.entity?.homepage &&
          uriRegex.test(this.entity.homepage)) {
          return this.entity.homepage;
        }
        return null;
      }
    },
    methods: {
      organizationEntityNonNativeEnglishName,
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
      color: $darkgrey;

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
    color: $darkgrey;
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
        :description="{ values: [
          'Discover inspiring art, artists and stories in the digitised collections of European museums, galleries,\
           libraries and archives. Explore paintings, drawings, engravings and sculpture from cultural heritage institutions\
           across Europe. Discover inspiring art, artists and stories in the digitised collections of European museums, galleries,\
           libraries and archives. Explore paintings, drawings, engravings and sculpture from cultural heritage institutions\
           across Europe.'
        ] }"
        :title="{ values: ['Title'] }"
        :entity="{
          id: 'http://data.europeana.eu/concept/190',
          logo: { id: 'https://cdn.jsdelivr.net/npm/@europeana/portal@1.62.2/.nuxt/dist/client/img/logo.e9d9080.svg' },
          homepage: 'https://www.europeana.eu'
        }"
      />
    </div>
  ```
  Aggregator entity header
  ```jsx
    <div style="background-color: #ededed; margin: -16px; padding: 16px;">
      <EntityHeader
        :description="{ values: [
          'Discover inspiring art, artists and stories in the digitised collections of European museums, galleries,\
           libraries and archives. Explore paintings, drawings, engravings and sculpture from cultural heritage institutions\
           across Europe. Discover inspiring art, artists and stories in the digitised collections of European museums, galleries,\
           libraries and archives. Explore paintings, drawings, engravings and sculpture from cultural heritage institutions\
           across Europe.'
        ] }"
        :title="{ values: ['Aggregator titel oorspronkelijke taal'] }"
        :entity="{
          id: 'http://data.europeana.eu/organization/190',
          logo: { id: 'https://cdn.jsdelivr.net/npm/@europeana/portal@1.62.2/.nuxt/dist/client/img/logo.e9d9080.svg' },
          homepage: 'https://www.europeana.eu',
          mbox: 'info@aggregator.eu',
          prefLabel: { en: 'Aggregator title in English', nl: 'Aggregator titel oorspronkelijke taal' },
          type: 'Organization',
          acronym: ['ABC'],
          hasAddress: { countryName: 'The Netherlands', locality: 'The Hague' },
          homepage: 'https://www.example.eu',
          heritageDomain: 'Scientific heritage',
          providesSupportForMediaType: ['Image', 'Video'],
          geographicScope: 'International',
          providesSupportForDataActivity: ['Copyright support','Content storage'],
          providesCapacityBuildingActivity: ['One-to-one support', 'Webinars / workshops'],
          providesAudienceEngagementActivity: ['Social media engagement', 'Digital curation'],
          isAggregatedBy: { recordCount: 20000 },
          aggregatesFrom: ['http://data.europeana.eu/organization/100', 'http://data.europeana.eu/organization/101',]
        }"
        :editable="true"
      />
    </div>
  ```
</docs>
