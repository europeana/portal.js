<template>
  <canvas id="the-canvas" />
</template>

<script>
  import * as pdfjsLib from 'pdfjs-dist';
  // import { EventBus, PDFViewer } from 'pdfjs-dist/web/pdf_viewer';
  // import 'pdfjs-dist/web/pdf_viewer.css';

  import 'pdfjs-dist/build/pdf.worker.entry';

  export default {
    name: 'MediaPDFViewer',

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
        src: this.$apis.record.mediaProxyUrl(this.url, this.itemId, { disposition: 'inline' })
      };
    },

    mounted() {
      this.getPdf();
    },

    methods: {
      getPdf() {
        // let pdfViewer = new PDFViewer({
        //   container: this.$refs.container,
        //   viewer: this.$refs.viewer,
        //   eventBus: new EventBus
        // });
        // let pdf = await pdfjsLib.getDocument(this.src).promise;

        // pdfViewer.setDocument(pdf);

        // Asynchronous download of PDF
        let loadingTask = pdfjsLib.getDocument(this.src);
        loadingTask.promise.then((pdf) => {
          console.log('PDF loaded');

          // Fetch the first page
          let pageNumber = 1;
          pdf.getPage(pageNumber).then((page) => {
            console.log('Page loaded');

            let scale = 1.5;
            let viewport = page.getViewport({ scale });

            // Prepare canvas using PDF page dimensions
            let canvas = document.getElementById('the-canvas');
            let context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            // Render PDF page into canvas context
            let renderContext = {
              canvasContext: context,
              viewport
            };
            let renderTask = page.render(renderContext);
            renderTask.promise.then(() => {
              console.log('Page rendered');
            });
          });
        }, (reason) => {
          // PDF loading error
          console.error(reason);
        });
      }
    }
  };
</script>
