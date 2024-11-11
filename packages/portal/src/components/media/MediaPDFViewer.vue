<template>
  <div id="pdfvuer">
    <div class="position-absolute">
      <a
        class="item"
        @click="page > 1 ? page-- : 1"
      >
        <span class="left chevron icon" />
        Back
      </a>
      <a class="ui active item">
        {{ page }} / {{ numPages ? numPages : '∞' }}
      </a>
      <a
        class="item"
        @click="page < numPages ? page++ : 1"
      >
        Forward
        <i class="right chevron icon" />
      </a>
    </div>
    <div class="position-absolute">
      <a
        class="item"
        @click="scale -= scale > 0.2 ? 0.1 : 0"
      >
        <i class="left chevron icon" />
        Zoom -
      </a>
      <a class="ui active item">
        {{ formattedZoom }} %
      </a>
      <a
        class="item"
        @click="scale += scale < 2 ? 0.1 : 0"
      >
        Zoom +
        <i class="right chevron icon" />
      </a>
    </div>
    <PDFViewer
      v-for="i in numPages"
      :id="i"
      :key="i"
      :src="src"
      :page="i"
      :scale.sync="scale"
      style="width:100%;margin:20px auto;"
      :annotation="true"
      :resize="true"
      @link-clicked="handlePDFLink"
    >
      <template slot="loading">
        loading content here...
      </template>
    </PDFViewer>
  </div>
</template>

<script>
  import PDFViewer from 'pdfvuer';

  export default {
    name: 'MediaPDFViewer',

    components: {
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
        page: 1,
        numPages: 0,
        pdfdata: undefined,
        errors: [],
        scale: 'page-width'
      };
    },

    fetch() {
      this.getPdf();
    },

    computed: {
      formattedZoom() {
        return Number.parseInt(this.scale * 100);
      },
      src() {
        return this.$apis.record.mediaProxyUrl(this.url, this.itemId, { disposition: 'inline' });
      }
    },

    watch: {
      page(p) {
        if (window.pageYOffset <= this.findPos(document.getElementById(p)) || (document.getElementById(p + 1) && window.pageYOffset >= this.findPos(document.getElementById(p + 1)))) {
          // window.scrollTo(0,this.findPos(document.getElementById(p)));
          document.getElementById(p).scrollIntoView();
        }
      }
    },

    methods: {
      handlePDFLink(params) {
        // Scroll to the appropriate place on our page - the Y component of
        // params.destArray * (div height / ???), from the bottom of the page div
        let page = document.getElementById(String(params.pageNumber));
        page.scrollIntoView();
      },
      getPdf() {
        let self = this;
        self.pdfdata = PDFViewer.createLoadingTask(this.src);
        self.pdfdata.then(pdf => {
          self.numPages = pdf.numPages;
          window.onscroll = function() {
            changePage();
            // stickyNav();
          };

          // // Get the offset position of the navbar
          // let sticky = $('#buttons')[0].offsetTop;

          // // Add the sticky class to the self.$refs.nav when you reach its scroll position. Remove "sticky" when you leave the scroll position
          // function stickyNav() {
          //   if (window.pageYOffset >= sticky) {
          //     $('#buttons')[0].classList.remove('hidden');
          //   } else {
          //     $('#buttons')[0].classList.add('hidden');
          //   }
          // }

          function changePage() {
            let i = 1, count = Number(pdf.numPages);
            do {
              if (window.pageYOffset >= self.findPos(document.getElementById(i)) &&
                window.pageYOffset <= self.findPos(document.getElementById(i + 1))) {
                self.page = i;
              }
              i = i + 1;
            } while (i < count);
            if (window.pageYOffset >= self.findPos(document.getElementById(i))) {
              self.page = i;
            }
          }
        });
      },
      findPos(obj) {
        return obj.offsetTop;
      }
    }
  };
</script>
