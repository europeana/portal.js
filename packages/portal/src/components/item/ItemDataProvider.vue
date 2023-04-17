<template>
  <section
    class="data-provider"
  >
    <i18n
      data-qa="data provider name"
      path='provider.providedBy'
      tag="div"
    >
      <template #provider>
        <LinkBadge
          v-if="isEuropeanaEntity && providerEntityResponse"
          :id="aboutURL"
          badgeVariant="secondary"
          :link-to="collectionLinkGen(providerEntityResponse)"
          :title="providerEntityResponse.prefLabel"
          :img="$apis.entity.imageUrl(providerEntityResponse)"
          type="Organization"
        />
        <span
          v-else
        >
          {{ edmDataProviderNativeName }}
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
        providerEntityResponse: null
      };
    },

    async fetch() {
      if (this.isEuropeanaEntity) {
        const entitiesResponse = await this.$apis.entity.find([this.aboutURL], {
          fl: 'skos_prefLabel.*,foaf_logo'
        });

        if (entitiesResponse)  {
          this.providerEntityResponse = entitiesResponse[0];
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
      edmDataProviderNativeName() {
        const prefLanguage = this.getPrefLanguage('edmDataProvider', this.dataProvider);

        return langMapValueForLocale(this.dataProvider, prefLanguage).values[0];
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
