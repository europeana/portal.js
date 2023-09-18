<template>
  <div
    id="iiif-open-layers"
    class="iiif-viewer-inner-wrapper h-100 d-flex flex-column"
  />
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
        resource: null,
        thumbnail: null
      };
    },

    async fetch() {
      const manifestResponse = await axios.get(this.uri);
      this.manifest = manifestResponse.data;

      const canvas = this.manifest.sequences?.[0]?.canvases?.[0];
      this.resource = canvas?.images?.[0]?.resource;
      this.thumbnail = canvas?.thumbnail;

      const serviceId = this.resource?.service?.['@id'];
      if (serviceId) {
        const imageInfoUrl = `${serviceId}/info.json`;
        const imageInfoResponse = await axios.get(imageInfoUrl);
        this.imageInfo = imageInfoResponse.data;
      }
    },

    watch: {
      thumbnail: {
        deep: true,
        handler: 'renderThumbnail'
      }
    },

    mounted() {
      this.renderThumbnail();
    },

    methods: {
      async drawMap() {
        const { default: Map } = await import('ol/Map.js');
        if (!this.map) {
          this.map = new Map({
            controls: [],
            layers: [],
            target: 'iiif-open-layers'
          });

          this.map.getInteractions().forEach((interaction) => interaction.setActive(false));
        }
      },

      async renderThumbnail() {
        if (!this.thumbnail) {
          return;
        }
        await this.renderStaticImage(this.thumbnail['@id'], 400, 400);
        this.map.on('singleclick', this.renderImage);
      },

      async renderIIIFImage() {
        // IIIF Image API
        // https://openlayers.org/en/latest/examples/iiif.html
        const { default: View } = await import('ol/View.js');
        const { default: IIIF } = await import('ol/source/IIIF.js');
        const { default: IIIFInfo } = await import('ol/format/IIIFInfo.js');
        const { default: TileLayer } = await import('ol/layer/Tile.js');

        await this.drawMap();

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
            constrainOnlyCenter: true
          })
        );
        this.map.getView().fit(iiifTileSource.getTileGrid().getExtent());
      },

      async renderStaticImage(url, width, height) {
        // Static image
        // https://openlayers.org/en/latest/examples/static-image.html
        const { default: View } = await import('ol/View.js');
        const { default: ImageLayer } = await import('ol/layer/Image.js');
        const { default: Projection } = await import('ol/proj/Projection.js');
        const { default: Static } = await import('ol/source/ImageStatic.js');
        const { getCenter } = await import('ol/extent.js');

        await this.drawMap();

        const extent = [0, 0, width, height];
        const projection = new Projection({
          code: 'static', // necessary?
          units: 'pixels',
          extent
        });
        const layer = new ImageLayer({
          source: new Static({
            url: this.resource['@id'],
            projection,
            imageExtent: extent
          })
        });
        this.map.setLayers([layer]);
        this.map.setView(new View({
          projection,
          center: getCenter(extent),
          zoom: 1,
          maxZoom: 8
        }));
      },

      async renderImage() {
        await this.drawMap();

        if (this.imageInfo) {
          this.renderIIIFImage();
        } else if (this.resource?.['@id']) {
          this.renderStaticImage(this.resource['@id'], this.resource.width, this.resource.height);
        }

        this.map.getInteractions().forEach((interaction) => interaction.setActive(true));
      }
    }
  };
</script>
