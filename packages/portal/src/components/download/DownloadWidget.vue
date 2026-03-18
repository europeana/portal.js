<template>
  <div
    class="download-widget"
    data-qa="download widget"
  >
    <DownloadButton
      :url="url"
      :identifier="identifier"
      data-qa="download button"
      @download="$bvModal.show('download-success-modal')"
      @downloadError="$bvModal.show('download-failed-modal')"
    />
    <DownloadSuccessModal
      :title="attributionFields.title"
      :creator="attributionFields.creator"
      :year="attributionFields.year"
      :provider="attributionFields.provider"
      :country="attributionFields.country"
      :rights="rightsNameAndIcon(rightsStatement).name"
      :url="attributionFields.url"
    />
    <DownloadFailedModal
      :provider-url="providerUrl"
    />
  </div>
</template>

<script>
  import DownloadButton from './DownloadButton';
  import DownloadFailedModal from './DownloadFailedModal';
  import DownloadSuccessModal from './DownloadSuccessModal';
  import { rightsNameAndIcon } from '@/utils/europeana/rightsStatement';

  export default {
    name: 'DownloadWidget',
    components: {
      DownloadButton,
      DownloadFailedModal,
      DownloadSuccessModal
    },
    props: {
      url: {
        type: String,
        required: true
      },
      identifier: {
        type: String,
        required: true
      },
      rightsStatement: {
        type: String,
        required: true
      },
      attributionFields: {
        type: Object,
        default: () => ({})
      },
      providerUrl: {
        type: String,
        default: null
      }
    },
    methods: {
      rightsNameAndIcon
    }
  };
</script>
