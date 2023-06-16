<template>
  <div class="iiif-error-message d-flex">
    <span class="icon-info-outline" />
    <div>
      <i18n
        path="errorMessage.IIIFManifestFailure.brokenConnection"
        tag="p"
      >
        <template #linkToProvider>
          <SmartLink
            v-if="providerUrl"
            :destination="providerUrl"
            class="text-decoration-none provider-link"
            @click.native="$matomo && $matomo.trackEvent('Item_external link', 'Click Provider Link', providerUrl);"
          >
            {{ $t('provider.linkText') }}
          </SmartLink>
        </template>
      </i18n>
      <p>{{ $t('errorMessage.IIIFManifestFailure.multiPageDownload') }}</p>
      <p>{{ $t('errorMessage.IIIFManifestFailure.reportForDeletion') }}</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'IIIFErrorMessage',

    components: {
      SmartLink: () => import('@/components/generic/SmartLink')
    },

    props: {
      providerUrl: {
        type: String,
        default: null
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

.iiif-error-message {

  color: $white;
  max-width: $max-text-column-width;
  padding-top: 2.5rem;
  margin: 0 auto;
}
</style>
