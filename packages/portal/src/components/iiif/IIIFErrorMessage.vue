<template>
  <div class="iiif-error-message d-flex">
    <span class="icon-info" />
    <div>
      <i18n
        path="errorMessage.IIIFManifestFailure.description"
        tag="p"
        class="mb-0"
      >
        <template
          v-if="providerUrl"
          #linkToProvider
        >
          {{ $t('or') }}
          <SmartLink
            :destination="providerUrl"
            class="text-decoration-none provider-link"
            @click.native="$matomo && $matomo.trackEvent('Item_external link', 'Click Provider Link', providerUrl);"
          >
            {{ $t('provider.linkText') }}
          </SmartLink>
        </template>
      </i18n>
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
  padding: 2.5rem 2rem 0;
  margin: 0 auto;
}

.icon-info {
  font-size: $font-size-medium;
  line-height: 1.5rem;
  margin-right: 1rem;

  &:before {
    display: inline-block;
    transform: rotateX(180deg);
  }
}

.provider-link {
  color: $white;
  font-weight: 600;
  text-transform: lowercase;
}
</style>
