<template>
  <div class="item-hero">
    <AwesomeSwiper
      :europeana-identifier="identifier"
      :displayable-media="media"
      @select="selectMedia"
    />
    <b-container>
      <b-row>
        <b-col
          cols="12"
          class="col-lg-10 media-bar d-flex mx-auto"
          data-qa="action bar"
        >
          <div class="d-flex justify-content-md-center align-items-center rights-wrapper">
            <RightsStatementButton
              :disabled="!rightsStatementIsUrl"
              :rights-statement="rightsStatement"
              class="mr-auto"
              data-qa="provider name"
            />
          </div>
          <div
            v-if="media.length !== 1"
            class="d-flex justify-content-md-center align-items-center pagination-wrapper"
          >
            <div class="swiper-pagination" />
          </div>
          <div class="d-flex justify-content-md-center align-items-center button-wrapper">
            <div class="ml-lg-auto d-flex">
              <client-only>
                <UserButtons
                  v-model="identifier"
                />
              </client-only>
              <ShareButton />
              <DownloadButton
                v-if="downloadEnabled"
                :url="downloadUrl"
              />
            </div>
          </div>
        </b-col>
      </b-row>
      <SocialShareModal
        :media-url="selectedMedia.about"
      >
        <ItemEmbedCode
          :identifier="identifier"
        />
      </SocialShareModal>
      <DownloadModal
        v-if="downloadEnabled"
        :title="attributionFields.title"
        :creator="attributionFields.creator"
        :year="attributionFields.year"
        :provider="attributionFields.provider"
        :country="attributionFields.country"
        :rights="attributionFields.rights"
        :url="attributionFields.url"
      />
    </b-container>
  </div>
</template>

<script>
  import ClientOnly from 'vue-client-only';
  import AwesomeSwiper from './AwesomeSwiper';
  import DownloadButton from '../generic/DownloadButton';
  import DownloadModal from '../generic/DownloadModal.vue';
  import RightsStatementButton from '../generic/RightsStatementButton';
  import ItemEmbedCode from './ItemEmbedCode';
  import SocialShareModal from '../sharing/SocialShareModal';
  import ShareButton from '../sharing/ShareButton';

  import has from 'lodash/has';

  export default {
    components: {
      AwesomeSwiper,
      ClientOnly,
      DownloadButton,
      RightsStatementButton,
      ItemEmbedCode,
      SocialShareModal,
      DownloadModal,
      ShareButton,
      UserButtons: () => import('../account/UserButtons')
    },
    props: {
      allMediaUris: {
        type: Array,
        default: () => []
      },
      identifier: {
        type: String,
        required: true
      },
      edmRights: {
        type: String,
        default: ''
      },
      media: {
        type: Array,
        default: () => []
      },
      attributionFields: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      return {
        selectedMediaItem: null,
        selectedCanvas: null
      };
    },
    computed: {
      downloadUrl() {
        const url = (this.selectedCanvas || this.selectedMedia).about;
        return this.downloadViaProxy(url) ? this.$apis.record.mediaProxyUrl(url, this.identifier) : url;
      },
      rightsStatementIsUrl() {
        return RegExp('^https?://*').test(this.rightsStatement);
      },
      rightsStatement() {
        if (has(this.selectedMedia, 'webResourceEdmRights')) {
          return this.selectedMedia.webResourceEdmRights.def[0];
        } else if (this.edmRights !== '') {
          return this.edmRights;
        }
        return '';
      },
      selectedMedia: {
        get() {
          return this.selectedMediaItem || this.media[0] || {};
        },
        set(about) {
          this.selectedCanvas = null;
          this.selectedMediaItem = this.media.find((item) => item.about === about) || {};
        }
      },
      downloadEnabled() {
        return this.rightsStatement && !this.rightsStatement.includes('/InC/') && !this.selectedMedia.isShownAt;
      }
    },
    mounted() {
      window.addEventListener('message', msg => {
        if (msg.origin !== window.location.origin) {
          return;
        }
        if (msg.data.event === 'updateDownloadLink') {
          this.selectedCanvas = { about: msg.data.id };
        }
      });
    },
    methods: {
      // Ensure we only proxy web resource media, preventing proxying of
      // arbitrary other resources such as images linked from (non-Europeana-hosted)
      // IIIF manifests.
      downloadViaProxy(url) {
        return this.allMediaUris.some(uri => uri === url);
      },
      selectMedia(about) {
        this.selectedMedia = about;
      }
    }
  };
</script>
