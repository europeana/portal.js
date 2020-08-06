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
    components: {
      AwesomeSwiper,
      DownloadButton,
      RightsStatementButton,
      SocialShareModal,
      ShareButton
    },
    props: {
      media: {
        type: Array,
        default: () => []
      },
      id: {
        type: String,
        default: ''
      },
      url: {
        type: String,
        default: null
      },
      useProxy: {
        type: Boolean,
        required: true
      },
    },
    data() {
      return {
        mediaUrl: '',
        selectedMediaItem: null
      };
    },
    computed: {
      downloadUrl() {
        return this.useProxy ? this.$proxyMedia(this.selectedMedia.about, this.id) : this.url;
      },
      rightsStatement() {
        return this.selectedMedia.rightsStatement;
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
      }
    },
    methods: {
      selectMedia(about) {
        this.selectedMedia = about;
      }
    }
  };
</script>
