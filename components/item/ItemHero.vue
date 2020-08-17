<template>
  <div class="item-hero">
    <AwesomeSwiper
      :europeana-identifier="identifier"
      :media="media"
      @select="selectMedia"
    />
    <b-container class="d-flex justify-content-around media-bar">
      <RightsStatementButton
        v-if="rightsStatementIsUrl"
        :rights-statement="rightsStatement"
      />
      <span
        v-else
        data-qa="rights statement"
      >
        {{ rightsStatement }}
      </span>
      <DownloadButton
        v-if="downloadEnabled"
        :url="downloadUrl"
      />
      <ShareButton />
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

  export default {
    components: {
      AwesomeSwiper,
      DownloadButton,
      RightsStatementButton,
      SocialShareModal,
      ShareButton
    },
    props: {
      identifier: {
        type: String,
        required: true
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
      rightsStatement() {
        console.log(this.selectedMedia);
        return this.selectedMedia.webResourceEdmRights.def[0];
      },
      rightsStatementIsUrl() {
        return RegExp('^https?://*').test(this.rightsStatement);
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
        return this.selectedMedia.webResourceEdmRights.def[0] && !this.selectedMedia.webResourceEdmRights.def[0].includes('/InC/');
      }
    },
    methods: {
      selectMedia(about) {
        this.selectedMedia = about;
      }
    }
  };
</script>

