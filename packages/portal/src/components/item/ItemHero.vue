<template>
  <div class="item-hero">
    <!--
      TODO: render the media presentation container here, both SSR and CSR,
            to reduce UI jumpiness
    -->
    <client-only>
      <ItemMediaPresentation
        :uri="iiifPresentationManifest"
        :search-query="fulltextSearchQuery"
        :item-id="identifier"
        :provider-url="providerUrl"
        :web-resources="media"
        :edm-type="edmType"
        @select="selectMedia"
      />
    </client-only>
    <b-container>
      <b-row>
        <b-col
          cols="12"
          class="col-lg-10 media-bar d-flex mx-auto justify-content-between"
          data-qa="action bar"
        >
          <div class="rights-wrapper d-inline-flex justify-content-md-center align-items-center mr-2">
            <RightsStatementButton
              :disabled="!rightsStatementIsUrl"
              :rights-statement="rightsStatement"
              class="mr-auto"
              data-qa="provider name"
            />
          </div>
          <div class="d-flex justify-content-md-center align-items-center button-wrapper">
            <div class="ml-lg-auto d-flex justify-content-center flex-wrap flex-md-nowrap">
              <ItemTranscribeButton
                v-if="showTranscribathonLink"
                :transcribe-url="linkForContributingAnnotation"
              />
              <client-only>
                <UserButtons
                  :identifier="identifier"
                  :show-pins="showPins"
                  :entities="entities"
                  button-variant="secondary"
                />
              </client-only>
              <ShareButton />
              <DownloadWidget
                v-if="downloadEnabled"
                :url="downloadUrl"
                :provider-url="providerUrl"
                :identifier="identifier"
                :rights-statement="rightsStatement"
                :attribution-fields="attributionFields"
              />
            </div>
          </div>
        </b-col>
      </b-row>
      <ShareSocialModal
        :media-url="selectedMedia.about"
      >
        <ItemEmbedCode
          :identifier="identifier"
        />
      </ShareSocialModal>
    </b-container>
  </div>
</template>

<script>
  import ClientOnly from 'vue-client-only';
  import DownloadWidget from '../download/DownloadWidget';
  import RightsStatementButton from '../generic/RightsStatementButton';
  import ItemEmbedCode from './ItemEmbedCode';
  import ShareSocialModal from '../share/ShareSocialModal';
  import ShareButton from '../share/ShareButton';
  import WebResource from '@/plugins/europeana/edm/WebResource';

  import advancedSearchMixin from '@/mixins/advancedSearch';
  import rightsStatementMixin from '@/mixins/rightsStatement';

  const TRANSCRIBATHON_URL_ROOT = /^https?:\/\/europeana\.transcribathon\.eu\//;

  export default {
    components: {
      ClientOnly,
      DownloadWidget,
      ItemEmbedCode,
      RightsStatementButton,
      ShareButton,
      ShareSocialModal,
      UserButtons: () => import('../user/UserButtons'),
      ItemTranscribeButton: () => import('./ItemTranscribeButton.vue')
    },

    mixins: [
      advancedSearchMixin,
      rightsStatementMixin
    ],

    props: {
      allMediaUris: {
        type: Array,
        default: () => []
      },
      identifier: {
        type: String,
        required: true
      },
      edmType: {
        type: String,
        default: null
      },
      edmRights: {
        type: String,
        default: ''
      },
      media: {
        type: Array,
        default: () => [],
        validator: (prop) => Array.isArray(prop) && prop.every((item) => item instanceof WebResource)
      },
      attributionFields: {
        type: Object,
        default: () => ({})
      },
      // Entities related to the item, used for pinning.
      entities: {
        type: Array,
        default: () => []
      },
      providerUrl: {
        type: String,
        default: null
      },
      linkForContributingAnnotation: {
        type: String,
        default: null
      },
      iiifPresentationManifest: {
        type: String,
        default: null
      }
    },
    data() {
      return {
        selectedMedia: this.media?.[0] || {}
      };
    },
    computed: {
      downloadEnabled() {
        return this.rightsStatement && !this.rightsStatement.includes('/InC/') && !this.selectedMedia.forEdmIsShownAt && !this.selectedMedia.isOEmbed && !!this.downloadUrl;
      },
      downloadUrl() {
        const url = this.selectedMedia.about;
        return this.downloadViaProxy(url) ? this.$apis.record.mediaProxyUrl(url, this.identifier) : url;
      },
      rightsStatementIsUrl() {
        return /^https?:\/\//.test(this.rightsStatement);
      },
      rightsStatement() {
        if (this.selectedMedia.webResourceEdmRights) {
          return this.selectedMedia.webResourceEdmRights.def[0];
        } else if (this.edmRights !== '') {
          return this.edmRights;
        }
        return '';
      },
      fulltextSearchQuery() {
        let query = [];

        if (this.$nuxt.context.from) {
          if (this.$nuxt.context.from.query.qa) {
            const advSearchRules = this.advancedSearchRulesFromRouteQuery(this.$nuxt.context.from.query.qa);
            query = advSearchRules
              .filter((rule) => (rule.field === 'fulltext') && (['contains', 'exact'].includes(rule.modifier)))
              .map((rule) => rule.term);
          }
        }

        return query.join(' ');
      },
      showPins() {
        return this.userIsEntitiesEditor && this.userIsSetsEditor && this.entities.length > 0;
      },
      userIsEntitiesEditor() {
        return this.$auth.userHasClientRole('entities', 'editor');
      },
      userIsSetsEditor() {
        return this.$auth.userHasClientRole('usersets', 'editor');
      },
      showTranscribathonLink() {
        return this.$features.transcribathonCta && this.linkForContributingAnnotation && TRANSCRIBATHON_URL_ROOT.test(this.linkForContributingAnnotation);
      }
    },
    methods: {
      // Ensure we only proxy web resource media, preventing proxying of
      // arbitrary other resources such as images linked from (non-Europeana-hosted)
      // IIIF manifests.
      downloadViaProxy(url) {
        return this.allMediaUris.some(uri => uri === url);
      },
      selectMedia(resource) {
        this.selectedMedia = resource;
      }
    }
  };
</script>

<style lang="scss">
  @import '@europeana/style/scss/variables';

  .item-hero {
    padding-bottom: 1.625rem;

    .media-bar {
      margin-top: 2.5rem;
    }

    .user-buttons {
      display: inline-flex;

      .container {
        padding: 0;
      }

      > div {
        display: inherit;
      }

      .btn {
        font-size: $font-size-large;
        height: 2.25rem;
        min-width: 2.25rem;
        line-height: 1;
        padding: 0.375rem;
        margin-right: 0.5rem;

        &:hover:not(.active) {
          color: $mediumgrey;
        }
      }
    }

    @media (max-width: ($bp-large - 1px)) {
      .media-bar {
        flex-direction: column;

        a,
        button {
          text-align: center;
          justify-content: center;
        }

        .rights-wrapper {
          order: 2;
          margin-bottom: 1rem;
        }

        .button-wrapper {
          order: 3;
          margin-left: 0;
          flex-direction: column;

          .user-buttons {
            justify-content: space-between;
            margin-bottom: 1rem;
          }

          .share-button {
            margin-bottom: 1rem;
            width: auto;
          }

          .download-widget {
            margin-bottom: 1rem;

            .download-button {
              width: auto;
            }
          }
        }
      }
    }
  }
</style>
