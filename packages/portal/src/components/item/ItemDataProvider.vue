<template>
  <section
    class="data-provider"
  >
    <i18n
      data-qa="data provider attribution"
      :path="providedByStringPath"
      tag="div"
    >
      <template #provider>
        <LinkBadge
          v-if="isEntityUri(dataProvider.about)"
          :id="dataProvider.about"
          data-qa="data provider badge"
          badge-variant="secondary"
          :link-to="collectionLinkGen(dataProvider)"
          :title="collectionTitle(dataProvider)"
          type="Organization"
          :click-event-handler="badgeClickEventHandler"
        />
        <span
          v-else
          data-qa="data provider name"
          :lang="langAttribute(namePrefLanguage)"
        >
          {{ dataProvider }}
        </span>
      </template>
    </i18n>
    <SmartLink
      v-if="isShownAt"
      :destination="isShownAt"
      class="text-decoration-none provider-link"
      @click.native="$matomo && $matomo.trackEvent('Item_external link', 'Click Provider Link', isShownAt)"
    >
      {{ $t('provider.linkText') }}
    </SmartLink>
  </section>
</template>

<script>
  import { isEntityUri } from '@/plugins/europeana/entity';
  import collectionLinkGenMixin from '@/mixins/collectionLinkGen';
  import europeanaEntityLinks from '@/mixins/europeana/entities/entityLinks';
  import itemPrefLanguage from '@/mixins/europeana/item/itemPrefLanguage';
  import langAttributeMixin from '@/mixins/langAttribute';

  import LinkBadge from '../generic/LinkBadge';

  export default {
    name: 'ItemDataProvider',

    components: {
      SmartLink: () => import('@/components/generic/SmartLink'),
      LinkBadge
    },
    mixins: [
      itemPrefLanguage,
      langAttributeMixin,
      collectionLinkGenMixin,
      europeanaEntityLinks
    ],
    props: {
      dataProvider: {
        type: [Object, String],
        default: null
      },
      metadataLanguage: {
        type: String,
        default: null
      },
      isShownAt: {
        type: String,
        default: null
      },
      userGeneratedContent: {
        type: Boolean,
        default: false
      }
    },

    computed: {
      providedByStringPath() {
        return this.userGeneratedContent ? 'provider.providedByUgc' : 'provider.providedBy';
      },
      namePrefLanguage() {
        return this.getPrefLanguage('edmDataProvider', this.dataProvider);
      }
    },

    methods: {
      isEntityUri(uri) {
        return isEntityUri(uri);
      },
      badgeClickEventHandler() {
        this.$store.commit('search/setLoggableInteraction', true);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/transitions';

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
