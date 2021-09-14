<template>
  <div
    v-if="item.media && item.identifier"
    class="item-preview-slide"
    :class="variant"
  >
    <div
      class="slide-wrapper-link"
      :style="background ? `background-image: url(${imageLink})` : null"
      @mouseenter="show = true"
      @mouseleave="show = false"
    >
      <OptimisedImage
        v-if="!background"
        :src="imageLink"
        :width="width"
        :height="height"
        alt
        :aria-hidden="show ? 'true' : null"
      />

      <div
        class="slide-overlay"
        :class="{ show }"
      >
        <SmartLink
          :destination="url"
          link-class="slide-link"
        >
          Discover this item
        </SmartLink>
        <UserButtons
          v-model="identifier"
          @like="$emit('like', identifier)"
          @unlike="$emit('unlike', identifier)"
        />
        <SmartLink
          :destination="'/discover'"
          link-class="slide-link"
        >
          Go on a trip through Europeana
        </SmartLink>
      </div>
    </div>
  </div>
</template>

<script>
  import OptimisedImage from '../generic/OptimisedImage';
  import SmartLink from '../generic/SmartLink';

  const testItems = ['/11650/_Botany_L_2532818',
                     '/11643/_Remaining_insects_ZMA_INS_917801',
                     '/2058621/LoCloud_census_1891_2193fb70_0fa3_4cf5_9dbc_f5c56c484419',
                     '/176/BRXBR0000010420737',
                     '/11656/Mollusca_RMNH_MOL_183091',
                     '/265/BRXBR0000019285399',
                     '/2020702/raa_fmi_10052802880001',
                     '/9200338/BibliographicResource_3000127232914',
                     '/916118/S_TEK_object_TEKS0002983',
                     '/2058621/locloud_folk_1865_3c24150d_4129_4294_aab7_76acc29d3b09',
                     '/266/BRXBR0000018993516',
                     '/9200338/BibliographicResource_3000117698294',
                     '/2058621/LoCloud_census_1891_20b96c86_1350_4388_aba3_db25e7876bd2',
                     '/916109/smm_sm_photo_Fo175699',
                     '/264/BRXBR0000011104100',
                     '/263/BRXBR0000015543691',
                     '/90402/RP_T_1887_A_778',
                     '/2021641/publiek_detail_aspx_xmldescid_119085603',
                     '/9200359/BibliographicResource_3000115397022',
                     '/266/BRXBR0000010215272',
                     '/265/BRXBR0000010041055',
                     '/2058626/LoCloud_census_1891_11d35a26_b6fb_4a29_988d_26eecc66c954',
                     '/9200359/BibliographicResource_3000100592111',
                     '/264/BRXBR0000018428766'];

  export default {
    name: 'ItemPreviewSlide',
    components: {
      OptimisedImage,
      SmartLink,
      UserButtons: () => import('../account/UserButtons')
    },
    props: {
      background: {
        type: Boolean,
        default: false
      },
      variant: {
        type: String,
        default: 'default'
      }
    },

    async fetch() {
      let randomItem;
      let randomIndex = Math.floor(Math.random() * testItems.length);
      randomItem = testItems[randomIndex];
      // await this.$apis.record.search({
      //   qf: 'contentTier:4',
      //   rows: 1,
      //   facet: {
      //     'TYPE': 'IMAGE',
      //     'MIME_TYPE': 'image/jpeg',
      //     'IMAGE_SIZE': ['MEDIUM', 'LARGE', 'EXTRA_LARGE']
      //   },
      //   sort: 'random'
      // })
      //   .then(response => {
      //     randomItem = response.items[0].id;
      //   })
      //   .catch(error => {
      //     return { error: error.message };
      //   });

      return this.$apis.record
        .getRecord(randomItem)
        .then(result => {
          return this.item = result.record;
        })
        .catch(error => {
          return { error: error.message };
        });
    },

    data() {
      return {
        item: {},
        show: false
      };
    },

    computed: {
      identifier() {
        return this.item.identifier;
      },
      image() {
        return this.item.media.filter(m => m.ebucoreHasMimeType === 'image/jpeg');
      },
      height() {
        return this.image[0]?.ebucoreHeight || 0;
      },
      width() {
        return this.image[0]?.ebucoreWidth || 0;
      },

      url() {
        return { name: 'item-all', params: { pathMatch: this.identifier.slice(1) } };
      },
      imageLink() {
        return this.$apis.record.mediaProxyUrl(this.image[0]?.about, this.identifier, { disposition: 'inline' });
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/variables.scss';
  .item-preview-slide {
    height: 50vh;
    position: relative;
    margin: 2rem 0 4rem;
    .slide-wrapper-link {
      overflow-y: hidden;
      height: 50vh;
      position: absolute;
      width: 100vw;
      left: calc(50% - 50vw);
      display: flex;
      align-items: center;
      justify-content: center;
      //background version styles
      background-attachment: fixed;
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
    }
    .slide-overlay {
      background-color: rgba(0, 0, 0, 0.8);
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      visibility: hidden;
      opacity: 0;
      transition: all 300ms ease-out;
      &.show {
        visibility: visible;
        opacity: 1;
        transition: all 300ms ease-in;
      }
      .slide-link {
        color: $offwhite;
        font-size: $font-size-large;
        margin: 1rem 0;
      }
    }
  }
  .zoom-out .slide-wrapper-link {
    img {
      max-height: 3000px;
      transition: all 1s ease;
    }
    &:hover img {
      max-height: 100%;
      transition: all 1s ease;
    }
  }
  .scroll .slide-wrapper-link {
    align-items: flex-start;
    overflow-y: scroll;
    -ms-overflow-style: none;  /* Internet Explorer 10+ */
    scrollbar-width: none;  /* Firefox */
    &:-webkit-scrollbar {
      display: none;  /* Safari and Chrome */
    }
  }
</style>
