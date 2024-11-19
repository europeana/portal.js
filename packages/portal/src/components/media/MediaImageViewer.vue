<template>
  <div
    id="media-image-viewer"
    class="h-100 w-100"
  >
    <MediaImageViewerKeyboardToggle
      id="media-image-viewer-keyboard-toggle"
      @renderFullImage="renderFullImage"
    />
    <slot />
  </div>
</template>

<script>
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
  import ImageLayer from 'ol/layer/Image.js';
  import Projection from 'ol/proj/Projection.js';
  import ImageStatic from 'ol/source/ImageStatic.js';
  import { getCenter } from 'ol/extent.js';
  import View from 'ol/View.js';
  import { easeOut } from 'ol/easing.js';
  import { defaults } from 'ol/interaction/defaults';

  import useItemMediaPresentation from '@/composables/itemMediaPresentation.js';
  import useZoom from '@/composables/zoom.js';
  import EuropeanaMediaAnnotation from '@/utils/europeana/media/Annotation.js';
  import EuropeanaMediaService from '@/utils/europeana/media/Service.js';

  import MediaImageViewerKeyboardToggle from './MediaImageViewerKeyboardToggle.vue';

  export class MediaImageViewerError extends Error {
    constructor(message) {
      super(message);
      this.name = 'MediaImageViewerError';
    }
  }

  export default {
    name: 'MediaImageViewer',

    components: {
      MediaImageViewerKeyboardToggle
    },

    props: {
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
        type: EuropeanaMediaService,
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

    setup() {
      const {
        current: currentZoom,
        setCurrent: setCurrentZoom,
        setDefault: setDefaultZoom,
        setMax: setMaxZoom,
        setMin: setMinZoom
      } = useZoom();
      const {
        activeAnnotation,
        annotationAtCoordinate,
        fetchCanvasAnnotations,
        hasAnnotations,
        pageForAnnotationTarget
      } = useItemMediaPresentation();

      return { activeAnnotation, annotationAtCoordinate, fetchCanvasAnnotations, hasAnnotations, pageForAnnotationTarget, currentZoom, setCurrentZoom, setDefaultZoom, setMaxZoom, setMinZoom };
    },

    data() {
      return {
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
      try {
        if (this.service?.id) {
          const infoResponse = await this.service.fetchInfo();
          this.info = infoResponse.data;
          this.source = 'IIIF';
        }

        if (process.client) {
          // FIXME: this is called twice, also in mounted
          this.renderImage();
        }
      } catch (error) {
        this.$emit('error', error);
        throw error;
      }
    },

    watch: {
      activeAnnotation: {
        deep: true,
        handler: 'highlightAnnotation'
      },
      '$route.query.page'() {
        this.fetchCanvasAnnotations();
      },
      url: '$fetch',
      currentZoom: 'setZoom'
    },

    mounted() {
      if (!this.$fetchState.pending) {
        this.renderImage();
      }
    },

    methods: {
      initOlAnnotationLayer() {
        const layerCount = this.olMap.getLayers().getLength();
        if (layerCount === 0) {
          throw new MediaImageViewerError('No image layer to annotate');
        }
        if (layerCount === 1) {
          this.olMap.addLayer(new VectorLayer({ source: new VectorSource() }));
        }
      },

      constructAnnotationFeature() {
        let annotation = this.activeAnnotation;
        if (!annotation) {
          return null;
        } else if (!(annotation instanceof EuropeanaMediaAnnotation)) {
          annotation = new EuropeanaMediaAnnotation(annotation);
        }

        const extent = annotation.extent || this.olExtent;
        // FIXME: this.url will always be for the image, not the canvas, which works
        //        with europeana's incorrect annotation modelling, but not with
        //        others' correct modelling
        const target = annotation.targetFor(this.url)[0];
        const targetId = target?.id || target;
        if (!targetId) {
          return;
        }

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

      handleMapClick(coordinate) {
        const clickedAnnotation = this.annotationAtCoordinate(coordinate, this.olExtent);
        if (clickedAnnotation?.id !== this.activeAnnotation?.id || this.$route.hash !== '#annotations') {
          let options = {};
          if (this.$route.hash !== '#annotations') {
            options.hash = '#annotations';
          }

          // consider using 'replace' instead of 'push' to not include in history. Seems to cause errors somtimes.
          this.$router.push({
            ...this.$route,
            query: {
              ...this.$route.query,
              anno: clickedAnnotation?.id || undefined,
              page: this.pageForAnnotationTarget(clickedAnnotation?.target) || this.$route.query.page
            },
            ...options
          });
        }
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

      handleOlError(olError, message) {
        const error = new MediaImageViewerError(message);
        error.type = olError.type;
        if (olError.target?.['url_']) {
          error.url = olError.target['url_'];
        }
        this.$emit('error', error);
      },

      initOlMap({ extent, layer, source } = {}) {
        const projection = new Projection({ units: 'pixels', extent });

        const view = new View({
          center: getCenter(extent),
          constrainOnlyCenter: true,
          maxZoom: 8,
          projection,
          resolutions: source.getTileGrid?.()?.getResolutions()
        });
        view.on('error', (olError) => this.handleOlError(olError, 'OpenLayers View error'));

        if (!this.olMap) {
          this.olMap = new Map({
            controls: [],
            interactions: defaults({ mouseWheelZoom: false }),
            target: 'media-image-viewer',
            keyboardEventTarget: 'media-image-viewer-keyboard-toggle'
          });
          this.olMap.on('error', (olError) => this.handleOlError(olError, 'OpenLayers Map error'));
        }
        this.olExtent = extent;

        this.olMap.setLayers([layer]);
        this.olMap.setView(view);

        const mapSize = this.olMap.getSize();
        const imageSize = extent.slice(2);
        const imageSmallerThanMap = imageSize[1] < mapSize?.[1] && imageSize[0] < mapSize?.[0];
        const imageMaxFitSize =  imageSmallerThanMap ? imageSize : undefined;

        this.olMap.getView().fit(extent, { size: imageMaxFitSize });
        this.configureZoomLevels();
        if (this.hasAnnotations) {
          this.olMap.on('click', (evt) => {
            this.handleMapClick(evt.coordinate);
          });
        }
      },

      async renderThumbnail() {
        if (!this.thumbnail) {
          this.renderFullImage();
          return;
        }

        let mapOptions;

        const thumbWidth = 400;
        const thumbHeight = (this.height / this.width) * thumbWidth;

        mapOptions = await this.initOlImageLayerStatic(this.thumbnail, thumbWidth, thumbHeight);

        this.initOlMap(mapOptions);
        this.olMap.getInteractions().forEach((interaction) => interaction.setActive(false));
        // TODO: add other interactions: anno click, full-text search
        this.olMap.on('click', this.renderFullImage);
        this.olMap.getView().on('change:resolution', this.renderFullImageOnFirstZoomIn);
      },

      renderFullImageOnFirstZoomIn(event) {
        // check if zoom in, not out
        if (event.oldValue < 1) {
          this.renderFullImage();
        }
      },

      async renderFullImage() {
        if (this.olMap) {
          this.olMap.un('click', this.renderFullImage);
          this.olMap.getView().un('change:resolution', this.renderFullImageOnFirstZoomIn);
          this.olMap.getInteractions().forEach((interaction) => interaction.setActive(true));
        }

        // TODO: should we always be using the media proxy for static images?
        const url = this.$apis.record.mediaProxyUrl(this.url, this.itemId, { disposition: 'inline' });
        const mapOptions = await this.initOlImageLayerStatic(url, this.width, this.height);
        this.initMapWithFullImage(mapOptions);
      },

      // IIIF Image API
      // https://openlayers.org/en/latest/examples/iiif.html
      initOlImageLayerIIIF() {
        const sourceOptions = new IIIFInfo(this.info).getTileSourceOptions();

        const extent = [0, 0, sourceOptions.size[0], sourceOptions.size[1]];

        sourceOptions.extent = extent;

        const source = new IIIFSource(sourceOptions);
        source.on('error', (olError) => this.handleOlError(olError, 'OpenLayers IIIF Source error'));
        source.on('imageloaderror', (olError) => this.handleOlError(olError, 'OpenLayers IIIF Source imageloaderror'));
        source.on('tileloaderror', (olError) => this.handleOlError(olError, 'OpenLayers IIIF Source tileloaderror'));
        const layer = new TileLayer({ source });
        layer.on('error', (olError) => this.handleOlError(olError, 'OpenLayers Tile Layer error'));

        return { extent, layer, source };
      },

      // Static image
      // https://openlayers.org/en/latest/examples/static-image.html
      async initOlImageLayerStatic(url, width, height) {
        const extent = [0, 0, width, height];

        const source = new ImageStatic({
          url,
          imageExtent: extent
        });
        source.on('error', (olError) => this.handleOlError(olError, 'OpenLayers Static Source error'));
        source.on('imageloaderror', (olError) => this.handleOlError(olError, 'OpenLayers Static Source imageloaderror'));
        const layer = new ImageLayer({ source });
        layer.on('error', (olError) => this.handleOlError(olError, 'OpenLayers Image Layer error'));

        return { extent, layer, source };
      },

      async renderImage() {
        await (this.$nextTick()); // without this static images won't render, some race condition

        if (this.source === 'IIIF') {
          const mapOptions = this.initOlImageLayerIIIF();
          this.initMapWithFullImage(mapOptions);
        } else {
          this.renderThumbnail();
        }
      },

      initMapWithFullImage(mapOptions) {
        this.initOlMap(mapOptions);
        this.highlightAnnotation();
      },

      setZoom() {
        const view = this.olMap.getView();

        if (!view) {
          // the map does not have a view, so we can't act
          // upon it
          return;
        }
        const viewZoom = view.getZoom();
        if (viewZoom !== undefined) {
          const newZoom = this.currentZoom;

          if (view.getAnimating()) {
            view.cancelAnimations();
          }
          view.animate({
            zoom: newZoom,
            duration: 250, // Hardcoded to default ol annimation duration
            easing: easeOut
          });
        }
      },

      configureZoomLevels() {
        const view = this.olMap.getView();

        this.setDefaultZoom(view.getZoom());
        this.setMaxZoom(view.getMaxZoom());
        this.setMinZoom(view.getMinZoom());

        // This uses "moveend" instead of "change:resolution" on the view as that can fire many times during an animation
        // TODO: Move out of configureZoomLevels?
        this.olMap.on('moveend', () => {
          // "moveend" can be called by non zoom interactions, we only want to emit when it was triggered after a zoom.
          if (view.getZoom() !== this.currentZoom) {
            this.setCurrentZoom(view.getZoom());
          }
        });
      }
    }
  };
</script>
