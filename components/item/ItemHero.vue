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
              <UserButtons
                v-model="identifier"
              />
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
    </b-container>
  </div>
</template>

<script>
  import AwesomeSwiper from './AwesomeSwiper';
  import DownloadButton from '../generic/DownloadButton.vue';
  import RightsStatementButton from '../generic/RightsStatementButton.vue';
  import ItemEmbedCode from './ItemEmbedCode.vue';
  import SocialShareModal from '../sharing/SocialShareModal.vue';
  import ShareButton from '../sharing/ShareButton.vue';
  import has from 'lodash/has';

  export default {
    components: {
      AwesomeSwiper,
      DownloadButton,
      RightsStatementButton,
      ItemEmbedCode,
      SocialShareModal,
      ShareButton,
      UserButtons: () => import('../account/UserButtons')
    },
    props: {
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
      }
    },
    data() {
      return {
        selectedMediaItem: null
      };
    },
    computed: {
      downloadUrl() {
        return this.$store.getters['apis/record'].mediaProxyUrl(this.selectedMedia.about, this.identifier);
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
          this.selectedMediaItem = this.media.find((item) => item.about === about) || {};
        }
      },
      downloadEnabled() {
        return this.rightsStatement && !this.rightsStatement.includes('/InC/');
      }
    },
    methods: {
      selectMedia(about) {
        this.selectedMedia = about;
      }
    }
  };
</script>
