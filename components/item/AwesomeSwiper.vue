<template>
    <swiper ref="awesome" :options="swiperOptions">
        <swiper-slide>
            <img src="https://api.europeana.eu/api/v2/thumbnail-by-url.json?type=IMAGE&amp;uri=http%3A%2F%2Frepos.europeanafashion.eu%2Fpaulvanriel%2F54332959.jpg" alt="">
        </swiper-slide>
        <swiper-slide>
            <img src="https://api.europeana.eu/api/v2/thumbnail-by-url.json?type=IMAGE&amp;uri=http%3A%2F%2Fdata.jck.nl%2Fthumbnail%2Fjck%2Fjoods-historisch%2Fd616%2F616NM009292%2F500" alt="">
        </swiper-slide>
        <swiper-slide>
            <iframe allowfullscreen="allowfullscreen" src="https://www.europeana.eu/en/media?id=%2F2084002%2Fcontributions_fae903d0_9fa9_0136_7c80_6eee0af7f672&amp;mediaUrl=http%3A%2F%2Fcontribute.europeana.eu%2Fmedia%2Ffae63040-9fa9-0136-7c80-6eee0af7f672" class="media-player"></iframe>
        </swiper-slide>
        <swiper-slide>
          <MediaPresentation
            europeana-identifier="/"
            :media="media"
            :src="'https://www.europeana.eu/en/iiif?uri=https%3A%2F%2Fiiif.europeana.eu%2Fpresentation%2F9200301%2FBibliographicResource_3000126341271%2Fmanifest'" aria-label="View document"
          />
          <iframe data-qa="IIIF viewer" allowfullscreen="allowfullscreen" src=""></iframe>
        </swiper-slide>
        <swiper-slide>
          <img data-v-370eeff7="" src="https://api.europeana.eu/api/v2/thumbnail-by-url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Fwww.filmportal.de%2Fsites%2Fdefault%2Ffiles%2F4103B2B7BD864968B6F915EFF9F2410B_1-003838.jpg" alt="">
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
        <div class="swiper-button-prev" slot="button-prev"></div>
        <div class="swiper-button-next" slot="button-next"></div>
    </swiper>
</template>

<script>
  import { Swiper, SwiperSlide, directive } from 'vue-awesome-swiper'
  import 'swiper/swiper-bundle.css'
  import MediaPresentation from './MediaPresentation';

  export default {
    name: 'AwesomeSwiper',
    components: {
        Swiper,
        SwiperSlide,
        MediaPresentation
    },
    directives: {
        swiper: directive
    },
    data() {
      return {
        swiperOptions: {
          slidesPerView: 3,
          spaceBetween: 20,
          centeredSlides: true,
          pagination: {
            el: '.swiper-pagination',
            clickable: true
          }
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },

        // for IIIF test
        media: {
          about: "https://iiif.europeana.eu/image/OGWLG5JYNXQU7VQR7FP2EPVM577PB76OHSRCY7QWLTSP4ETJBU2Q/presentation_images/3e8a4380-021b-11e6-a696-fa163e2dd531/node-4/image/NLF/Uusi_Aura/1910/11/02/254B_1/19101102_254B_1-0001/full/full/0/default.jpg",
          dctermsIsReferencedBy: ["https://iiif.europeana.eu/presentation/9200301/BibliographicResource_3000126341259/manifest"],
          ebucoreHasMimeType: "image/jpeg",
          ebucoreHeight: 2541,
          ebucoreWidth: 1837,
          services: [
            {
              about: "https://iiif.europeana.eu/image/OGWLG5JYNXQU7VQR7FP2EPVM577PB76OHSRCY7QWLTSP4ETJBU2Q/presentation_images/3e8a4380-021b-11e6-a696-fa163e2dd531/node-4/image/NLF/Uusi_Aura/1910/11/02/254B_1/19101102_254B_1-0001",
              dctermsConformsTo: ["http://iiif.io/api/image"],
              doapImplements: ["http://iiif.io/api/image/2/level1.json"]
            }
          ]

        }
      }
    },
    computed: {
      swiper() {
        return this.$refs.awesome.$swiper
      }
    },
    mounted() {
      // console.log('Current Swiper instance object', this.swiper)
      // this.swiper.slideTo(3, 1000, false)
    }
  };
</script>

<style lang="scss" scoped>
  /* .swiper-slide {
    width: 60%;
  }
  .swiper-slide:nth-child(2n) {
    width: 40%;
  } */
  .swiper-button-prev, .swiper-button-next {
    color: #fff;
  }
</style>