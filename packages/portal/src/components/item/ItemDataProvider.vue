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

  export default {
    name: 'ItemDataProvider',

    components: {
      SmartLink: () => import('@/components/generic/SmartLink')

    },

    props: {
      dataProvider: {
        type: Object,
        default: null
      }
    },

    computed: {
      edmDataProviderNativeName() {
        const provider = this.dataProvider.value.def?.[0];
        const providerPrefLabel = provider.prefLabel;
        const nativeLocale = providerPrefLabel &&
          Object.keys(providerPrefLabel).length <= 2 &&
          Object.keys(providerPrefLabel).find(key => key !== 'en');
        const prefLanguage = nativeLocale || this.metadataLanguage || this.$i18n.locale;

        return langMapValueForLocale(providerPrefLabel || provider, prefLanguage).values[0];
      },
      edmDataProviderURL() {
        return this.dataProvider.url;
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
