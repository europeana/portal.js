<template>
  <div
    v-if="downloadableMedia.length > 0"
    class="download-widget"
    data-qa="download widget"
  >
    <b-dropdown
      v-if="downloadableMedia.length > 1"
      data-qa="download button"
      class="ml-2 d-inline-flex align-items-center download-button h-100 matomo_ignore"
      menu-class="p-0"
      variant="primary"
    >
      <template #button-content>
        <span class="icon-ic-download d-inline-flex pr-1" />
        {{ $t('actions.download') }}
      </template>
      <li
        v-for="wr of downloadableMedia"
        :key="wr.about"
        role="presentation"
        class="p-1"
      >
        <DownloadButton
          :url="wr.about"
          :identifier="identifier"
          data-qa="download button"
          class="m-0"
          @download="handleDownload(wr.about)"
          @downloadError="$bvModal.show('download-failed-modal')"
        >
          {{ mediaTypeFileExtension(wr.ebucoreHasMimeType) }} ({{ filesize(wr.ebucoreFileByteSize) }})
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
        rightsStatement: this.media.edmRights.def[0]
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
      filesize,
      handleDownload(url) {
        this.rightsStatement = this.downloadableMedia.find((wr) => wr.about === url).edmRights.def[0];
        this.$bvModal.show('download-success-modal');
      },
      mediaTypeFileExtension
    }
  };
</script>
