<template>
  <div
    id="media-image-viewer"
    class="h-100 w-100"
  >
    <MediaImageViewerKeyboardToggle id="media-image-viewer-keyboard-toggle" />
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

  import useActiveTab from '@/composables/activeTab.js';
  import useItemMediaPresentation from '@/composables/itemMediaPresentation.js';
  import useZoom from '@/composables/zoom.js';
  import EuropeanaMediaAnnotation from '@/utils/europeana/media/Annotation.js';
  import EuropeanaMediaService from '@/utils/europeana/media/Service.js';

  import MediaImageViewerKeyboardToggle from './MediaImageViewerKeyboardToggle.vue';

  export default {
    name: 'MediaImageViewer',

    components: {
      MediaImageViewerKeyboardToggle
    },

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
        current: currentZoom,
        setCurrent: setCurrentZoom,
        setDefault: setDefaultZoom,
        setMax: setMaxZoom,
        setMin: setMinZoom
      } = useZoom();
      const {
        annotationAtCoordinate,
        hasAnnotations,
        setActiveAnnotation
      } = useItemMediaPresentation();

      const tabHashes = ['#annotations', '#search', '#links'];
      const { activeTabIndex } = useActiveTab(tabHashes);

      return { activeTabIndex, annotationAtCoordinate, hasAnnotations, currentZoom, setActiveAnnotation, setCurrentZoom, setDefaultZoom, setMaxZoom, setMinZoom };
    },

    data() {
      return {
        // fullsize: true,
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
        // TODO: mv info retrieval into the itemMediaPresentation composable?
        //       e.g. for centralised error handling
        const infoResponse = await this.service.fetchInfo();
        this.info = infoResponse.data;
        this.source = 'IIIF';
        // this.fullsize = true;
      }

      if (process.client) {
        this.renderImage();
      }
    },

    watch: {
      annotation: {
        deep: true,
        handler: 'highlightAnnotation'
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
        this.activeTabIndex = 0;
        const clickedAnnotation = this.annotationAtCoordinate(coordinate, this.olExtent);
        this.setActiveAnnotation(clickedAnnotation);
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
            controls: [],
            interactions: defaults({ mouseWheelZoom: false }),
            target: 'media-image-viewer',
            keyboardEventTarget: 'media-image-viewer-keyboard-toggle'
          });
        }
        this.olExtent = extent;

        this.olMap.setLayers([layer]);
        this.olMap.setView(view);
        this.olMap.getView().fit(extent);
        this.configureZoomLevels();
        if (this.hasAnnotations) {
          this.olMap.on('click', (evt) => {
            this.handleMapClick(evt.coordinate);
          });
        }
      },

      // renderThumbnail() {
      //   this.olMap.getInteractions().forEach((interaction) => interaction.setActive(false));
      //   this.olMap.on('singleclick', this.onSingleClickThumbnail);
      //
      //   if ((this.source === 'ImageStatic') && this.thumbnail) {
      //     const thumbWidth = 400;
      //     const thumbHeight = (this?.height / this?.width) * thumbWidth;
      //     this.initOlImageLayerStatic(this.thumbnail.url, thumbWidth, thumbHeight);
      //   }
      // },
      //
      // onSingleClickThumbnail() {
      //   this.olMap.un('singleclick', this.onSingleClickThumbnail);
      //   this.olMap.getInteractions().forEach((interaction) => interaction.setActive(true));
      //   this.fullsize = true;
      //   this.renderImage();
      // },

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
      initOlImageLayerStatic() {
        const extent = [0, 0, this.width, this.height];
        const source = new ImageStatic({
          // TODO: should we always be using the media proxy for static images?
          url: this.$apis.record.mediaProxyUrl(this.url, this.itemId, { disposition: 'inline' }),
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
          mapOptions = this.initOlImageLayerStatic();
        }

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
