<template>
  <div
    v-if="downloadableMedia.length > 0"
    class="download-widget"
    data-qa="download widget"
  >
    <!-- TODO: move into DownloadDropdown component? -->
    <b-dropdown
      v-if="downloadableMedia.length > 1"
      data-qa="download dropdown"
      class="ml-2 d-inline-flex align-items-center download-button h-100 matomo_ignore"
      boundary="window"
      menu-class="p-0 overflow-hidden"
      :text="$t('actions.download')"
      toggle-class="d-flex align-items-center"
      variant="primary"
    >
      <!-- Use b-dropdown-text as other b-dropdown sub components add a or button element which cannot have DownloadButton child (nested interactive element) -->
      <b-dropdown-text
        v-for="wr of downloadableMedia"
        :key="wr.about"
        tag="span"
        text-class="p-0"
      >
        <DownloadButton
          :url="wr.about"
          :identifier="identifier"
          data-qa="download button"
          variant="link"
          role="menuitem"
          class="dropdown-item py-2 px-3"
          @download="handleDownload(wr.about)"
          @downloadError="$bvModal.show('download-failed-modal')"
        >
          <span class="icon-ic-download d-inline-flex pr-1" />
          {{ mediaDownloadLabel(wr) }}
        </DownloadButton>
      </b-dropdown-text>
    </b-dropdown>
    <DownloadButton
      v-else
      v-b-tooltip.bottom="mediaDownloadLabel(downloadableMedia[0])"
      :url="downloadableMedia[0].about"
      :identifier="identifier"
      data-qa="download button"
      class="ml-2"
      @download="handleDownload(downloadableMedia[0].about)"
      @downloadError="$bvModal.show('download-failed-modal')"
    />
    <DownloadSuccessModal
      :title="attributionFields.title"
      :creator="attributionFields.creator"
      :year="attributionFields.year"
      :provider="attributionFields.provider"
      :country="attributionFields.country"
      :rights-statement="rightsStatement"
      :url="attributionFields.url"
    />
    <DownloadFailedModal
      :provider-url="providerUrl"
    />
  </div>
</template>

<script>
  import { mediaDownloadLabel } from '@/utils/media/mediaDownloadLabel.js';
  import DownloadButton from './DownloadButton';
  import DownloadFailedModal from './DownloadFailedModal';
  import DownloadSuccessModal from './DownloadSuccessModal';
  import WebResource from '@/plugins/europeana/edm/WebResource';

  export default {
    name: 'DownloadWidget',
    components: {
      DownloadButton,
      DownloadFailedModal,
      DownloadSuccessModal
    },
    props: {
      media: {
        type: Object,
        required: true,
        validator: (prop) => prop instanceof WebResource
      },
      identifier: {
        type: String,
        required: true
      },
      // TODO: does this need to be isFormatOf-aware?
      attributionFields: {
        type: Object,
        default: () => ({})
      },
      providerUrl: {
        type: String,
        default: null
      }
    },
    data() {
      return {
        rightsStatement: this.media.edmRights?.def?.[0]
      };
    },
    computed: {
      downloadableMedia() {
        return [this.media]
          .concat(this.media.dctermsIsFormatOf?.def || [])
          .filter((wr) => wr.isDownloadable);
      }
    },
    methods: {
      mediaDownloadLabel,
      handleDownload(url) {
        this.rightsStatement = this.downloadableMedia.find((wr) => wr.about === url).edmRights?.def?.[0];
        this.$bvModal.show('download-success-modal');
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  ::v-deep .dropdown-toggle:after {
    margin-left: 0.25rem;
  }

  .show > .btn-primary.dropdown-toggle {
    background-color: rgba($blue, 0.7);
    border-color: transparent;
  }

  .dropdown {
    ::v-deep .dropdown-menu {
      box-shadow: $boxshadow-large;
    }

    .dropdown-item {
      &:hover,
      &:focus {
        background-color: $lightblue-light;
      }
    }
  }

  .btn-link {
    color: $black;
    font-size: $font-size-extrasmall;
    text-transform: uppercase;

    &:hover,
    &:focus {
      text-decoration: none;
      color: $black;
    }
  }
</style>
