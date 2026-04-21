<template>
  <div
    class="download-widget"
    data-qa="download widget"
  >
    <b-dropdown
      v-if="isFormatOf"
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
        v-for="wr of isFormatOf"
        :key="wr.about"
        role="presentation"
        class="p-1"
      >
        <DownloadButton
          :url="wr.about"
          :identifier="identifier"
          data-qa="download button"
          class="m-0"
          @download="$bvModal.show('download-success-modal')"
          @downloadError="$bvModal.show('download-failed-modal')"
        >
          {{ wr.ebucoreHasMimeType }} ({{ filesize(wr.ebucoreFileByteSize) }})
        </DownloadButton>
      </li>
    </b-dropdown>
    <DownloadButton
      v-else
      :url="media.about"
      :identifier="identifier"
      data-qa="download button"
      class="ml-2"
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
  import { filesize } from 'filesize';
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
      media: {
        // TODO: validate typeof WebResource?
        type: Object,
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
    computed: {
      isFormatOf() {
        return this.media.dctermsIsFormatOf?.def || null;
      }
    },
    methods: {
      filesize,
      rightsNameAndIcon
    }
  };
</script>
