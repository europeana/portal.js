<template>
  <div
    id="media-image-viewer"
    class="h-100 w-100"
    data-qa="media image viewer"
  >
    <MediaImageViewerKeyboardToggle
      id="media-image-viewer-keyboard-toggle"
    />
    <b-container
      v-if="imageLoading"
      class="h-100 d-flex align-items-center justify-content-center"
      data-qa="loading spinner container"
    >
      <LoadingSpinner
        class="text-white"
        size="lg"
        :delay="500"
      />
    </b-container>
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
  import Style from 'ol/style/Style.js';
  import Stroke from 'ol/style/Stroke.js';

  import useItemMediaPresentation from '@/composables/itemMediaPresentation.js';
  import useRotation from '@/composables/rotation.js';
  import useZoom from '@/composables/zoom.js';
  import EuropeanaMediaAnnotation from '@/utils/europeana/media/Annotation.js';
  import EuropeanaMediaService from '@/utils/europeana/media/Service.js';

  import LoadingSpinner from '../generic/LoadingSpinner.vue';
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
      LoadingSpinner,
      MediaImageViewerKeyboardToggle
    },

    props: {
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
        reset: resetRotation,
        rotation
      } = useRotation();
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
        annotationSearchResults,
        hasAnnotations,
        hoveredAnnotation,
        setHoveredAnnotation,
        pageForAnnotationTarget
      } = useItemMediaPresentation();

      return {
        activeAnnotation,
        annotationAtCoordinate,
        annotationSearchResults,
        currentZoom,
        hasAnnotations,
        hoveredAnnotation,
        pageForAnnotationTarget,
        resetRotation,
        rotation,
        setCurrentZoom,
        setDefaultZoom,
        setHoveredAnnotation,
        setMaxZoom,
        setMinZoom
      };
    },

    data() {
      return {
        imageLoading: null,
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
      this.imageLoading = true;
      try {
        // clear any old OL layers e.g. from previous page, so tiles and anno
        // highlight vectors don't hang around while the new one loads
        this.olMap?.setLayers([]);

        if (this.service?.id) {
          const infoResponse = await this.service.fetchInfo();
          this.info = infoResponse.data;
          this.source = 'IIIF';
        }

        if (process.client) {
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
        handler() {
          this.highlightAnnotations();
        }
      },
      annotationSearchResults: {
        deep: true,
        handler() {
          this.highlightAnnotations(this.annotationSearchResults, 'search');
        }
      },
      currentZoom: 'setZoom',
      rotation: 'setRotation',
      url: '$fetch'
    },

    methods: {
      constructAnnotationFeature(anno) {
        let annotation = anno;
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
        if ((clickedAnnotation?.id !== this.activeAnnotation?.id) || (this.$route.hash !== '#annotations')) {
          this.$router.replace({
            ...this.$route,
            hash: '#annotations',
            query: {
              ...this.$route.query,
              anno: clickedAnnotation?.id,
              page: this.pageForAnnotationTarget(clickedAnnotation?.target) || this.$route.query.page
            }
          });
        }
      },

      handlePointerMove(event) {
        this.olMap.un('pointermove', this.handlePointerMove);

        const anno = this.annotationAtCoordinate(this.olMap.getCoordinateFromPixel(event.pixel), this.olExtent);
        if (!this.hoveredAnnotation || (anno?.id !== this.hoveredAnnotation?.id)) {
          this.highlightAnnotations(anno, 'hover');
          this.setHoveredAnnotation(anno);
        }

        setTimeout(() => {
          this.olMap.on('pointermove', this.handlePointerMove);
        }, 50);
      },

      highlightAnnotations(annos = this.activeAnnotation, layerId = 'active') {
        const layer = this.olMap?.getLayers()?.getArray()?.find((layer) => layer.get('id') === layerId);
        if (!layer) {
          return;
        }

        // remove any existing features, i.e. previously highlighted annotations
        // TODO: be more selective here, i.e. don't remove then re-highlight the
        //       same anno e.g.
        layer.getSource().clear();

        for (const anno of [].concat(annos)) {
          const feature = this.constructAnnotationFeature(anno);

          if (feature) {
            layer.getSource().addFeature(feature);
          }
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

      initOlAnnotationLayers() {
        const layerCount = this.olMap.getLayers().getLength();

        if (layerCount === 0) {
          throw new MediaImageViewerError('No image layer to annotate');
        }

        if (layerCount === 1) {
          // layer for annotations from search
          this.olMap.addLayer(new VectorLayer({
            properties: { id: 'search' },
            source: new VectorSource(),
            style: new Style({
              stroke: new Stroke({
                color: '#c697fc',
                width: 2
              })
            })
          }));

          // layer for hovered annotation
          this.olMap.addLayer(new VectorLayer({
            properties: { id: 'hover' },
            source: new VectorSource(),
            style: new Style({
              stroke: new Stroke({
                color: '#4d4d4d'
              })
            })
          }));

          // layer for active annotation
          this.olMap.addLayer(new VectorLayer({
            properties: { id: 'active' },
            source: new VectorSource()
          }));

          this.$nextTick(() => {
            this.highlightAnnotations();
            this.highlightAnnotations(this.annotationSearchResults, 'search');
          });
        }
      },

      initOl({ extent, layer, source } = {}) {
        this.olExtent = extent;
        this.initOlMap();
        this.initOlView({ extent, layer, source });
        if (this.hasAnnotations) {
          this.initOlAnnotationLayers();
        }
      },

      initOlMap() {
        if (this.olMap) {
          return;
        }

        this.olMap = new Map({
          controls: [],
          interactions: defaults({ mouseWheelZoom: false }),
          target: 'media-image-viewer',
          keyboardEventTarget: 'media-image-viewer-keyboard-toggle'
        });
        this.olMap.on('error', (olError) => this.handleOlError(olError, 'OpenLayers Map error'));
        if (this.hasAnnotations) {
          this.olMap.on('click', (event) => {
            this.handleMapClick(event.coordinate);
          });
          this.olMap.on('pointermove', this.handlePointerMove);
        }
      },

      initOlView({ extent, layer, source } = {}) {
        const projection = new Projection({ units: 'pixels', extent });

        this.resetRotation();
        const view = new View({
          center: getCenter(extent),
          constrainOnlyCenter: true,
          maxZoom: 8,
          projection,
          resolutions: source.getTileGrid?.()?.getResolutions(),
          rotation: this.rotation
        });
        view.on('error', (olError) => this.handleOlError(olError, 'OpenLayers View error'));

        this.olMap.setLayers([layer]);
        this.olMap.setView(view);

        const mapSize = this.olMap.getSize();
        const imageSize = extent.slice(2);
        const imageSmallerThanMap = imageSize[1] < mapSize?.[1] && imageSize[0] < mapSize?.[0];
        const imageMaxFitSize =  imageSmallerThanMap ? imageSize : undefined;

        this.olMap.getView().fit(extent, { size: imageMaxFitSize });
        this.configureZoomLevels();
      },

      // IIIF Image API
      // https://openlayers.org/en/latest/examples/iiif.html
      initOlImageLayerIIIF() {
        const sourceOptions = new IIIFInfo(this.info).getTileSourceOptions();

        const extent = [0, 0, sourceOptions.size[0], sourceOptions.size[1]];

        sourceOptions.extent = extent;
        sourceOptions.crossOrigin = 'anonymous';

        const source = new IIIFSource(sourceOptions);
        source.on('error', (olError) => this.handleOlError(olError, 'OpenLayers IIIF Source error'));
        source.on('imageloaderror', (olError) => this.handleOlError(olError, 'OpenLayers IIIF Source imageloaderror'));
        source.on('imageloadend', () => this.imageLoading = false);
        source.on('tileloaderror', (olError) => this.handleOlError(olError, 'OpenLayers IIIF Source tileloaderror'));
        source.on('tileloadend', () => this.imageLoading = false);
        const layer = new TileLayer({ properties: { id: 'image' }, source });
        layer.on('error', (olError) => this.handleOlError(olError, 'OpenLayers Tile Layer error'));

        return { extent, layer, source };
      },

      // Static image
      // https://openlayers.org/en/latest/examples/static-image.html
      initOlImageLayerStatic(url, width, height) {
        const extent = [0, 0, width, height];

        // Workaround OL bug for browsers that do not support ImageBitmap
        window.ImageBitmap = window.ImageBitmap || class {};

        const source = new ImageStatic({
          url,
          imageExtent: extent
        });
        source.on('error', (olError) => this.handleOlError(olError, 'OpenLayers Static Source error'));
        source.on('imageloaderror', (olError) => this.handleOlError(olError, 'OpenLayers Static Source imageloaderror'));
        source.on('imageloadend', () => this.imageLoading = false);
        const layer = new ImageLayer({ properties: { id: 'image' }, source });
        layer.on('error', (olError) => this.handleOlError(olError, 'OpenLayers Image Layer error'));

        return { extent, layer, source };
      },

      async renderImage() {
        await (this.$nextTick()); // without this static images won't render, some race condition

        if (this.source === 'IIIF') {
          const mapOptions = this.initOlImageLayerIIIF();
          this.initOl(mapOptions);
        } else {
          // TODO: should we always be using the media proxy for static images?
          const url = this.$apis.record.mediaProxyUrl(this.url, this.itemId, { disposition: 'inline' });
          const mapOptions = this.initOlImageLayerStatic(url, this.width, this.height);
          this.initOl(mapOptions);
        }
      },

      setRotation() {
        this.olMap.getView()?.setRotation(this.rotation);
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
