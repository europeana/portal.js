<template>
  <section
    class="data-provider"
  >
    <i18n
      data-qa="data provider attribution"
      path="provider.providedBy"
      tag="div"
    >
      <template #provider>
        <LinkBadge
          v-if="isEuropeanaEntity && providerEntity"
          :id="aboutURL"
          data-qa="data provider badge"
          badge-variant="secondary"
          :link-to="collectionLinkGen(providerEntity)"
          :title="providerEntity.prefLabel"
          :img="$apis.entity.imageUrl(providerEntity)"
          type="Organization"
        />
        <span
          v-else
          data-qa="data provider name"
          :lang="namePrefLanguage"
        >
          {{ nativeName }}
        </span>
      </template>
    </i18n>
    <SmartLink
      v-if="isShownAt"
      :destination="isShownAt"
      class="text-decoration-none provider-link"
      @click.native="$matomo && $matomo.trackEvent('Item_external link', 'Click Provider Link', isShownAt);"
    >
      {{ $t('provider.linkText') }}
    </SmartLink>
  </section>
</template>

<script>
  import { langMapValueForLocale } from  '@/plugins/europeana/utils';
  import { isEntityUri } from '@/plugins/europeana/entity';
  import itemPrefLanguage from '@/mixins/europeana/item/itemPrefLanguage';
  import collectionLinkGenMixin from '@/mixins/collectionLinkGen';

  import LinkBadge from '../generic/LinkBadge';

  export default {
    name: 'ItemDataProvider',

    components: {
      SmartLink: () => import('@/components/generic/SmartLink'),
      LinkBadge
    },
    mixins: [
      itemPrefLanguage,
      collectionLinkGenMixin
    ],
    props: {
      dataProvider: {
        type: Object,
        default: null
      },
      metadataLanguage: {
        type: String,
        default: null
      },
      isShownAt: {
        type: String,
        default: null
      }
    },

    data() {
      return {
        providerEntity: null
      };
    },

    async fetch() {
      if (this.isEuropeanaEntity) {
        try {
          const entitiesResponse = await this.$apis.entity.find([this.aboutURL], {
            fl: 'skos_prefLabel.*,foaf_logo'
          });
          if (entitiesResponse)  {
            this.providerEntity = entitiesResponse[0];
          }
        } catch (error) {
          // Fallback to be at least able to link to the entity page
          this.providerEntity = { id: this.aboutURL, prefLabel: this.dataProvider.def[0].prefLabel };
        }
      }
    },

    computed: {
      isEuropeanaEntity() {
        return isEntityUri(this.aboutURL);
      },
      aboutURL() {
        return this.dataProvider?.['def']?.[0].about;
      },
      namePrefLanguage() {
        return this.isEuropeanaEntity ? null : this.getPrefLanguage('edmDataProvider', { def: [{ prefLabel: this.dataProvider }] });
      },
      nativeName() {
        if (!this.isEuropeanaEntity) {
          return langMapValueForLocale(this.dataProvider, this.nameFallbackPrefLanguage).values[0];
        }
        return null;
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables';

  .data-provider {
    color: $black;

    p {
      margin-bottom: 0.25rem;
    }

    .provider-link {
      font-weight: 600;
    }
  }
</style>
