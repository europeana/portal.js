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
      menu-class="p-0 overflow-hidden"
      variant="primary"
      :text="$t('actions.download')"
      toggle-class="d-flex align-items-center"
    >
      <!-- TODO: use b-dropdown-item component instead. Currently the keyboard nav with up and down keys is not working -->
      <li
        v-for="wr of downloadableMedia"
        :key="wr.about"
        role="presentation"
      >
        <DownloadButton
          :url="wr.about"
          :identifier="identifier"
          data-qa="download button"
          variant="link"
          role="menuitem"
          @download="handleDownload(wr.about)"
          @downloadError="$bvModal.show('download-failed-modal')"
        >
          <span class="icon-ic-download d-inline-flex pr-1" />
          {{ downloadButtonText(wr) }}
        </DownloadButton>
      </li>
    </b-dropdown>
    <DownloadButton
      v-else
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
  import { filesize } from 'filesize';
  import { extension as mediaTypeFileExtension } from 'mime-types';
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
      downloadButtonText(wr) {
        let text = mediaTypeFileExtension(wr.ebucoreHasMimeType);
        if (wr.ebucoreFileByteSize) {
          text = `${text} (${filesize(wr.ebucoreFileByteSize)})`;
        }
        return text;
      },
      handleDownload(url) {
        this.rightsStatement = this.downloadableMedia.find((wr) => wr.about === url).edmRights?.def?.[0];
        this.$bvModal.show('download-success-modal');
      }
    }
  };
</script>

<style lang="scss">
  @import '@europeana/style/scss/variables';

  .dropdown-toggle:after {
    margin-left: 0.25rem;
  }

  .show > .btn-primary.dropdown-toggle {
    background-color: rgba($blue, 0.7);
    border-color: transparent;
  }

  .dropdown .dropdown-item {
    &:hover,
    &:focus {
      background-color: $lightblue-light;
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
