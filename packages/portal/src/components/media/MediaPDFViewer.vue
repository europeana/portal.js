<template>
  <div id="pdfvuer">
    <PaginationNavInput
      :per-page="1"
      :total-results="numPages"
      :button-text="false"
      :button-icon-class="'icon-arrow-outline'"
      class="pagination"
    />
    <PDFViewer
      v-for="i in numPages"
      :id="i"
      :key="i"
      :src="src"
      :page="i"
    >
      <template slot="loading">
        loading content here...
      </template>
    </PDFViewer>
  </div>
</template>

<script>
  import PDFViewer from 'pdfvuer';
  import PaginationNavInput from '@/components/generic/PaginationNavInput';

  export default {
    name: 'MediaPDFViewer',

    components: {
      PaginationNavInput,
      PDFViewer
    },
    props: {
      url: {
        type: String,
        required: true
      },

      itemId: {
        type: String,
        default: null
      }
    },

    data() {
      return {
        page: this.$route.query.page,
        numPages: 0,
        pdfdata: undefined,
        errors: [],
        scale: 'page-width',
        src: this.$apis.record.mediaProxyUrl(this.url, this.itemId, { disposition: 'inline' })
      };
    },

    mounted() {
      this.getPdf();
    },

    methods: {
      getPdf() {
        let self = this;
        self.pdfdata = PDFViewer.createLoadingTask(this.src);
        self.pdfdata.then(pdf => {
          self.numPages = pdf.numPages;
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .pagination {
    background-color: rgba($white, 0.95);

    ::v-deep ul {
      margin: 0 auto;
    }
  }
</style>
