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
        >
          <div class="d-flex justify-content-md-center align-items-center rights-wrapper">
            <RightsStatementButton
              :disabled="!rightsStatementIsUrl"
              :rights-statement="rightsStatement"
              class="mr-auto"
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
                v-if="showUserButtons"
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
      <SocialShareModal :media-url="selectedMedia.about" />
    </b-container>
  </div>
</template>

<script>
  import AwesomeSwiper from './AwesomeSwiper';
  import DownloadButton from '../generic/DownloadButton.vue';
  import RightsStatementButton from '../generic/RightsStatementButton.vue';
  import SocialShareModal from '../sharing/SocialShareModal.vue';
  import ShareButton from '../sharing/ShareButton.vue';
  import has from 'lodash/has';

  export default {
    components: {
      AwesomeSwiper,
      DownloadButton,
      RightsStatementButton,
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
        return this.$proxyMedia(this.selectedMedia.about, this.identifier);
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
      },
      showUserButtons() {
        return ((Boolean(Number(process.env.ENABLE_XX_USER_AUTH)) && Boolean(Number(process.env.ENABLE_UNAUTHENTICATED_USER_BUTTONS))) || (this.$store.state.auth && this.$store.state.auth.loggedIn));
      }
    },
    methods: {
      selectMedia(about) {
        this.selectedMedia = about;
      }
    }
  };
</script>
