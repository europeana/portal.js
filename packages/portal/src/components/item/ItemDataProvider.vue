<template>
  <section
    class="data-provider"
  >
    <p
      data-qa="data provider name"
    >
      {{ $t('provider.providedBy', { provider: edmDataProviderNativeName }) }}
    </p>
    <p class="secondary-text">
      {{ $t('provider.linkDescription') }}
    </p>
    <SmartLink
      v-if="edmDataProviderURL"
      :destination="edmDataProviderURL"
      class="text-decoration-none"
      @click.native="$matomo && $matomo.trackEvent('Item_external link', 'Click Provider Link', edmDataProviderURL);"
    >
      {{ $t('provider.linkText') }}
    </SmartLink>
  </section>
</template>

<script>
  import { langMapValueForLocale } from  '@/plugins/europeana/utils';
  import itemPrefLanguage from '@/mixins/europeana/item/itemPrefLanguage';

  export default {
    name: 'ItemDataProvider',

    components: {
      SmartLink: () => import('@/components/generic/SmartLink')

    },

    mixins: [itemPrefLanguage],

    props: {
      dataProvider: {
        type: Object,
        default: null
      },
      metadataLanguage: {
        type: String,
        default: null
      }
    },

    computed: {
      edmDataProviderNativeName() {
        const prefLanguage = this.getPrefLanguage('edmDataProvider', this.dataProvider);

        return langMapValueForLocale(this.dataProvider?.value, prefLanguage).values[0].values[0];
      },
      edmDataProviderURL() {
        return this.dataProvider?.url;
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
  }
</style>
