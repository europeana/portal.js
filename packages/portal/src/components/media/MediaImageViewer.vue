<template>
  <div
    id="media-image-viewer"
    class="h-100 w-100"
  />
</template>

<script>
  import axios from 'axios';
  // NOTE: each of the imported OpenLayers modules needs to be added to
  //       build.transpile in nuxt.config.js
  import IIIFSource from 'ol/source/IIIF.js';
  import IIIFInfo from 'ol/format/IIIFInfo.js';
  import { fromExtent } from 'ol/geom/Polygon.js';
  import Feature from 'ol/Feature.js';
  import VectorLayer from 'ol/layer/Vector.js';
  import VectorSource from 'ol/source/Vector.js';
  import TileLayer from 'ol/layer/Tile.js';
  import Map from 'ol/Map.js';
  import Collection from 'ol/Collection.js';
  import ImageLayer from 'ol/layer/Image.js';
  import Projection from 'ol/proj/Projection.js';
  import ImageStatic from 'ol/source/ImageStatic.js';
  import { getCenter } from 'ol/extent.js';
  import View from 'ol/View.js';
  import FullScreenControl from 'ol/control/FullScreen.js';
  import ZoomControl from 'ol/control/Zoom.js';

  import EuropeanaMediaAnnotation from '@/utils/europeana/media/Annotation.js';

  export default {
    name: 'MediaImageViewer',

    props: {
      // TODO: all we need is the target, not the full object
      annotation: {
        type: Object,
        default: null
      },
      format: {
        type: String,
        default: null
      },
      height: {
        type: Number,
        default: null
      },
      itemId: {
        type: String,
        default: null
      },
      service: {
        type: Object,
        default: null
      },
      thumbnail: {
        type: String,
        default: null
      },
      url: {
        type: String,
        required: true
      },
      width: {
        type: Number,
        default: null
      }
    },

    data() {
      return {
        // TODO: is the fullsize needed? unused.
        fullsize: false,
        info: null,
        olExtent: null,
        olMap: null,
        /**
         * @values IIIF,ImageStatic
         */
        source: 'ImageStatic'
      };
    },

    async fetch() {
      if (this.service?.id) {
        const infoUri = `${this.service.id}/info.json`;
        const infoResponse = await axios.get(infoUri);
        this.info = infoResponse.data;
        this.source = 'IIIF';
      }

      if (process.client) {
        this.renderThumbnail();
      }
    },

    watch: {
      annotation: {
        deep: true,
        handler: 'highlightAnnotation'
      },
      url: '$fetch'
    },

    mounted() {
      if (!this.$fetchState.pending) {
        this.renderThumbnail();
      }
    },

    methods: {
      initOlAnnotationLayer() {
        const layerCount = this.olMap.getLayers().getLength();
        if (layerCount === 0) {
          throw new Error('No image layer to annotate.');
        }
        if (layerCount === 1) {
          this.olMap.addLayer(new VectorLayer({ source: new VectorSource() }));
        }
      },

      constructAnnotationFeature() {
        let annotation = this.annotation;
        if (!annotation) {
          return null;
        } else if (!(annotation instanceof EuropeanaMediaAnnotation)) {
          annotation = new EuropeanaMediaAnnotation(annotation);
        }

        // TODO: move to computed property `annotationXywh`? or onto EuropeanaMediaAnnotation class?
        let [x, y, w, h] = this.olExtent;
        // FIXME: this.url will always be for the image, not the canvas, which works
        //        with europeana's incorrect annotation modelling, but not with
        //        others' correct modelling
        const target = annotation.targetFor(this.url)[0];
        const targetId = target?.id || target;
        const targetHash = new URL(targetId).hash;
        const xywhSelector = annotation.getHashParam(targetHash, 'xywh');
        if (xywhSelector) {
          [x, y, w, h] = xywhSelector
            .split(',')
            .map((xywh) => xywh.length === 0 ? undefined : Number(xywh));
        }

        const extent = [x, y, x + w, y + h];
        const poly = fromExtent(extent);

        // Vector Layer co-ordinates start bottom left, not top left, so transform
        // Y co-ordinates accordingly.
        // TODO: this seems like it should be handled by ol's projections...
        for (let i = 0; i < poly.flatCoordinates.length; i = i + 1) {
          if ((i % 2) === 1) { // even indices only
            poly.flatCoordinates[i] = this.olExtent[3] - poly.flatCoordinates[i];
          }
        }

        // uncomment to have the view follow the highlighted annotation
        // this.olMap.getView().fit(poly);

        return new Feature(poly);
      },

      highlightAnnotation() {
        this.initOlAnnotationLayer();

        const layer = this.olMap.getLayers().item(1);

        // remove any existing features, i.e. previously highlighted annotations
        layer.getSource().clear();

        const feature = this.constructAnnotationFeature();

        if (feature) {
          layer.getSource().addFeature(feature);
        }
      },

      initOlMap({ extent, layer, source } = {}) {
        const controls = new Collection([
          new FullScreenControl({ tipLabel: this.$t('media.controls.fullscreen') }),
          new ZoomControl({
            zoomInTipLabel: this.$t('media.controls.zoomIn'),
            zoomOutTipLabel: this.$t('media.controls.zoomOut')
          })
        ]);

        const projection = new Projection({ units: 'pixels', extent });

        const view = new View({
          center: getCenter(extent),
          constrainOnlyCenter: true,
          maxZoom: 8,
          projection,
          resolutions: source.getTileGrid?.().getResolutions()
        });

        if (!this.olMap) {
          this.olMap = new Map({
            controls,
            target: 'media-image-viewer'
          });
        }
        this.olExtent = extent;

        this.olMap.setLayers([layer]);
        this.olMap.setView(view);

        const mapSize = this.olMap.getSize();
        const imageSize = extent.slice(2);
        const imageSmallerThanMap = imageSize[1] < mapSize[1] && imageSize[0] < mapSize[0];
        const imageMaxFitSize =  imageSmallerThanMap ? imageSize : undefined;

        this.olMap.getView().fit(extent, { size: imageMaxFitSize });
      },

      async renderThumbnail() {
        await (this.$nextTick()); // without this static images won't render, some race condition

        let mapOptions;

        if (this.thumbnail) {
          const thumbWidth = 400;
          const thumbHeight = (this.height / this.width) * thumbWidth;
          mapOptions = this.initOlImageLayerStatic(this.thumbnail, thumbWidth, thumbHeight);
        }

        this.initOlMap(mapOptions);
        this.olMap.getInteractions().forEach((interaction) => interaction.setActive(false));
        // TODO: add other interactions + toolbar button clicks, anno click
        this.olMap.on('singleclick', this.onSingleClickThumbnail);
      },

      onSingleClickThumbnail() {
        this.olMap.on('singleclick', this.onSingleClickThumbnail);
        this.olMap.getInteractions().forEach((interaction) => interaction.setActive(true));
        this.fullsize = true;
        this.renderImage();
      },

      // IIIF Image API
      // https://openlayers.org/en/latest/examples/iiif.html
      initOlImageLayerIIIF() {
        const sourceOptions = new IIIFInfo(this.info).getTileSourceOptions();

        const extent = [0, 0, sourceOptions.size[0], sourceOptions.size[1]];

        sourceOptions.extent = extent;

        const source = new IIIFSource(sourceOptions);
        const layer = new TileLayer({ source });

        return { extent, layer, source };
      },

      // Static image
      // https://openlayers.org/en/latest/examples/static-image.html
      initOlImageLayerStatic(url, width, height) {
        const extent = [0, 0, width, height];
        const source = new ImageStatic({
          url,
          imageExtent: extent
        });
        const layer = new ImageLayer({ source });

        return { extent, layer, source };
      },

      async renderImage() {
        await (this.$nextTick()); // without this static images won't render, some race condition

        let mapOptions = {};

        if (this.source === 'IIIF') {
          mapOptions = this.initOlImageLayerIIIF();
        } else {
          // TODO: should we always be using the media proxy for static images?
          const url = this.$apis.record.mediaProxyUrl(this.url, this.itemId, { disposition: 'inline' });
          mapOptions = this.initOlImageLayerStatic(url, this.width, this.height);
        }

        this.initOlMap(mapOptions);
        this.highlightAnnotation();
      }
    }
  };
</script>
