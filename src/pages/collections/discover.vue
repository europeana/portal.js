<template>
  <div>
    <h1>Discover Europeana's Collections</h1>
    <h2>1. 100 viewport width, no effect (link and user buttons)</h2>
    <ItemPreviewSlide
      :item="item"
    />
    <h2>2. Zoom out to 100% height (link and user buttons)</h2>
    <ItemPreviewSlide
      :item="item"
      variant="zoom-out"
    />
    <h2>3. Parallax with overlay (link and user buttons)</h2>
    <ItemPreviewSlide
      :item="item"
      variant="parallax"
    />
  </div>
</template>

<script>
  import ItemPreviewSlide from '@/components/item/ItemPreviewSlide';

  export default {
    components: {
      ItemPreviewSlide
    },

    async fetch() {
      let randomItem;
      // let randomIndex = Math.floor(Math.random() * testItems.length);
      // randomItem = testItems[randomIndex];
      await this.$apis.record.search({
        qf: 'contentTier:4',
        rows: 1,
        facet: {
          'TYPE': 'IMAGE',
          'MIME_TYPE': 'image/jpeg',
          'IMAGE_SIZE': ['MEDIUM', 'LARGE', 'EXTRA_LARGE']
        },
        sort: 'random'
      })
        .then(response => {
          randomItem = response.items[0].id;
        })
        .catch(error => {
          return { error: error.message };
        });

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
        item: null
      };
    }

  };

  // const testItems = ['/11650/_Botany_L_2532818',
  //                    '/11643/_Remaining_insects_ZMA_INS_917801',
  //                    '/2058621/LoCloud_census_1891_2193fb70_0fa3_4cf5_9dbc_f5c56c484419',
  //                    '/176/BRXBR0000010420737',
  //                    '/11656/Mollusca_RMNH_MOL_183091',
  //                    '/265/BRXBR0000019285399',
  //                    '/2020702/raa_fmi_10052802880001',
  //                    '/9200338/BibliographicResource_3000127232914',
  //                    '/916118/S_TEK_object_TEKS0002983',
  //                    '/2058621/locloud_folk_1865_3c24150d_4129_4294_aab7_76acc29d3b09',
  //                    '/266/BRXBR0000018993516',
  //                    '/9200338/BibliographicResource_3000117698294',
  //                    '/2058621/LoCloud_census_1891_20b96c86_1350_4388_aba3_db25e7876bd2',
  //                    '/916109/smm_sm_photo_Fo175699',
  //                    '/264/BRXBR0000011104100',
  //                    '/263/BRXBR0000015543691',
  //                    '/90402/RP_T_1887_A_778',
  //                    '/2021641/publiek_detail_aspx_xmldescid_119085603',
  //                    '/9200359/BibliographicResource_3000115397022',
  //                    '/266/BRXBR0000010215272',
  //                    '/265/BRXBR0000010041055',
  //                    '/2058626/LoCloud_census_1891_11d35a26_b6fb_4a29_988d_26eecc66c954',
  //                    '/9200359/BibliographicResource_3000100592111',
  //                    '/264/BRXBR0000018428766'];

</script>
