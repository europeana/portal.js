<template>
  <div>
    <AwesomeSwiper
      :europeana-identifier="id"
      :media="media"
      @select="selectMedia"
    />
    <b-container class="d-flex justify-content-around mt-5">
      <RightsStatementButton
        v-if="rightsStatementIsUrl"
        :rights-statement="rightsStatement"
      />
      <DownloadButton
        :url="downloadUrl"
        :disabled="disabled"
        :target="target"
      />
      <ShareButton />
      <SocialShareModal :media-url="mediaUrl" />
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
    props: {
      media: {
        type: Array,
        default: []
      }
    },
    components: {
      AwesomeSwiper,
      DownloadButton,
      RightsStatementButton,
      SocialShareModal,
      ShareButton
    },
    data() {
      return {
        mediaUrl: 'https://www.example.org/media',
        id: '/2020601/https___1914_1918_europeana_eu_contributions_10265',
        rightsStatementIsUrl: true,
        disabled: false,
        selectedMediaItem: null,
        target: '_blank'
      };
    },
    computed: {
      selectedMedia: {
        get() {
          return this.selectedMediaItem || this.media[0] || {};
        },
        set(about) {
          this.selectedMediaItem = this.media.find((item) => item.about === about) || {};
        }
      },
      rightsStatement() {
        return this.selectedMedia.rightsStatement;
      },
      downloadUrl() {
        return this.selectedMedia.downloadUrl;
      }
    },
    methods: {
      selectMedia(about) {
        this.selectedMedia = about;
      }
    }
  };
</script>