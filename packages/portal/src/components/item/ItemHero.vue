<template>
  <div class="item-hero position-relative">
    <NotificationBanner
      v-if="itemIsDeleted"
      class="position-absolute border-bottom-0"
      icon-class="icon-info"
      :text="$t('record.itemDepublished')"
      :ignorable="false"
    />
    <ItemMediaPresentation
      :uri="iiifPresentationManifest"
      :item-id="identifier"
      :provider-url="providerUrl"
      :web-resources="media"
      :edm-type="edmType"
      @select="selectMedia"
    />
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
          <div
            v-if="!itemIsDeleted"
            class="d-flex justify-content-md-center align-items-center button-wrapper"
          >
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
        :media-url="selectedMedia?.about"
        @show="fetchEmbedCode"
      >
        <ShareSnippet
          tag="code"
          :text="embedCode"
          :button-text="$t('record.actions.copyEmbedCode')"
          :help-text="$t('record.clickToCopyEmbedCode')"
        />
      </ShareSocialModal>
    </b-container>
  </div>
</template>

<script>
  import ClientOnly from 'vue-client-only';
  import DownloadWidget from '../download/DownloadWidget';
  import RightsStatementButton from '../generic/RightsStatementButton';
  import ShareSnippet from '@/components/share/ShareSnippet';
  import ShareSocialModal from '../share/ShareSocialModal';
  import ShareButton from '../share/ShareButton';
  import WebResource from '@/plugins/europeana/edm/WebResource';
  import rightsStatementMixin from '@/mixins/rightsStatement';
  import { oEmbedForEndpoint } from '@/utils/services/oembed.js';
  import { BASE_URL as EUROPEANA_DATA_URL } from '@/plugins/europeana/data';

  const TRANSCRIBATHON_URL_ROOT = /^https?:\/\/europeana\.transcribathon\.eu\//;

  export default {
    components: {
      ClientOnly,
      DownloadWidget,
      ShareSnippet,
      RightsStatementButton,
      ShareButton,
      ShareSocialModal,
      UserButtons: () => import('../user/UserButtons'),
      ItemMediaPresentation: () => import('./ItemMediaPresentation.vue'),
      ItemTranscribeButton: () => import('./ItemTranscribeButton.vue'),
      NotificationBanner: () => import('@/components/generic/NotificationBanner')
    },

    mixins: [
      rightsStatementMixin
    ],

    inject: ['itemIsDeleted'],

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
        selectedMedia: {},
        embedCode: null
      };
    },
    computed: {
      downloadEnabled() {
        return this.rightsStatement && !this.rightsStatement.includes('/InC/') && !this.selectedMedia?.forEdmIsShownAt && !this.selectedMedia?.isOEmbed && !!this.downloadUrl;
      },
      downloadUrl() {
        const url = this.selectedMedia?.about;
        return this.downloadViaProxy(url) ? this.$apis.record.mediaProxyUrl(url, this.identifier) : url;
      },
      rightsStatementIsUrl() {
        return /^https?:\/\//.test(this.rightsStatement);
      },
      rightsStatement() {
        if (this.selectedMedia?.webResourceEdmRights) {
          return this.selectedMedia?.webResourceEdmRights.def[0];
        } else if (this.edmRights !== '') {
          return this.edmRights;
        }
        return '';
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
    created() {
      this.selectMedia(this.media?.[0]);
    },
    methods: {
      // Ensure we only proxy web resource media, preventing proxying of
      // arbitrary other resources such as images linked from (non-Europeana-hosted)
      // IIIF manifests.
      downloadViaProxy(url) {
        return this.allMediaUris.some(uri => uri === url);
      },
      selectMedia(resource) {
        this.selectedMedia = {
          // media prop may contain some metadata not available from iiif-derived
          // resource emitted from ItemMediaPresentation, e.g. rights statement
          ...this.media.find((wr) => wr.about === resource.about),
          ...resource
        };
      },
      async fetchEmbedCode() {
        if (this.embedCode) {
          return;
        }
        // TODO: this should be read from Nuxt runtime config
        const response = await oEmbedForEndpoint(process.env.EUROPEANA_OEMBED_PROVIDER_URL || 'https://oembed.europeana.eu',
                                                 `${EUROPEANA_DATA_URL}/item${this.identifier}`);

        if (response.data.html) {
          this.embedCode = response.data.html;
        }
      }
    }
  };
</script>

<style lang="scss">
  @import '@europeana/style/scss/variables';

  .item-hero {
    padding-bottom: 1.625rem;

    .notification-banner {
      background-color: rgba(0, 0, 0, 0.70);
      color: $white;

      .col-12 {
        @media (min-width: $bp-large) {
          flex: 0 0 83.333333%;
          max-width: 83.333333%;
          margin-right: auto;
          margin-left: auto;
        }
      }

      p {
        flex-wrap: nowrap !important;
      }
    }

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
          color: $darkgrey;
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
