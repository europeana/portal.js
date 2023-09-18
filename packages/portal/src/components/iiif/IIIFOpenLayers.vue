<template>
  <div
    id="iiif-open-layers"
    class="iiif-viewer-inner-wrapper h-100 d-flex flex-column"
  ></div>
</template>

<script>
  import axios from 'axios';

  export default {
    name: 'IIIFOpenLayers',

    props: {
      uri: {
        type: String,
        required: true
      },

      itemId: {
        type: String,
        default: null
      },

      searchQuery: {
        type: String,
        default: null
      },

      providerUrl: {
        type: String,
        default: null
      }
    },

    data() {
      return {
        imageInfo: null,
        manifest: null,
        map: null,
        resource: null
      }
    },

    async fetch() {
      const manifestResponse = await axios.get(this.uri);
      this.manifest = manifestResponse.data;

      this.resource = this.manifest.sequences?.[0]?.canvases?.[0]?.images?.[0]?.resource;

      const serviceId = this.resource?.service?.['@id'];
      if (serviceId) {
        const imageInfoUrl = `${serviceId}/info.json`;
        const imageInfoResponse = await axios.get(imageInfoUrl);
        this.imageInfo = imageInfoResponse.data;
      }
    },

    watch: {
      resource: {
        deep: true,
        handler: 'renderImage'
      }
    },

    mounted() {
      this.renderImage();
    },

    methods: {
      async renderImage() {
        const { default: Map } = await import('ol/Map.js');
        const { default: View } = await import('ol/View.js');

        if (!this.map) {
          this.map = new Map({
            layers: [],
            target: 'iiif-open-layers',
          });
        }

        if (this.imageInfo) {
          // IIIF Image API
          // https://openlayers.org/en/latest/examples/iiif.html
          const { default: IIIF } = await import('ol/source/IIIF.js')
          const { default: IIIFInfo } = await import('ol/format/IIIFInfo.js');
          const { default: TileLayer } = await import('ol/layer/Tile.js');

          const layer = new TileLayer();
          this.map.setLayers([layer]);

          const options = new IIIFInfo(this.imageInfo).getTileSourceOptions();
          options.zDirection = -1;
          const iiifTileSource = new IIIF(options);
          layer.setSource(iiifTileSource);
          this.map.setView(
            new View({
              resolutions: iiifTileSource.getTileGrid().getResolutions(),
              extent: iiifTileSource.getTileGrid().getExtent(),
              constrainOnlyCenter: true,
            })
          );
          this.map.getView().fit(iiifTileSource.getTileGrid().getExtent());
        } else if (this.resource?.['@id']) {
          // Static image
          // https://openlayers.org/en/latest/examples/static-image.html
          const { default: ImageLayer } = await import('ol/layer/Image.js');
          const { default: Projection } = await import('ol/proj/Projection.js');
          const { default: Static } = await import('ol/source/ImageStatic.js');
          const { getCenter } = await import('ol/extent.js');

          const extent = [0, 0, this.resource.width, this.resource.height];
          const projection = new Projection({
            code: 'static', // necessary?
            units: 'pixels',
            extent: extent
          });
          const layer = new ImageLayer({
            source: new Static({
              url: this.resource['@id'],
              projection: projection,
              imageExtent: extent
            }),
          });
          this.map.setLayers([layer]);
          this.map.setView(new View({
            projection: projection,
            center: getCenter(extent),
            zoom: 2,
            maxZoom: 8
          }));
        }
      }
    }
  };
</script>
