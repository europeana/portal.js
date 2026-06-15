<template>
  <div class="my-5">
    <div
      id="organisations-map"
      ref="map"
      class="organisations-map"
      :class="{ 'greyscale-on': greyscale }"
      width="100vh"
      height="80vh"
    >
      <div>
        <button @click="toggleGreyscale">
          Toggle greyscale
        </button>
      </div>
    </div>

    <b-card
      ref="popover"
      class="ol-popup"
    >
      <div
        ref="popoverContent"
      />
    </b-card>
  </div>
</template>

<script>
  import Map from 'ol/Map.js';
  import View from 'ol/View.js';
  import TileLayer from 'ol/layer/Tile.js';
  import OSM from 'ol/source/OSM.js';
  import Feature from 'ol/Feature.js';
  import Point from 'ol/geom/Point.js';
  import VectorSource from 'ol/source/Vector.js';
  import Cluster from 'ol/source/Cluster.js';
  import VectorLayer from 'ol/layer/Vector.js';
  import CircleStyle from 'ol/style/Circle.js';
  import Icon from 'ol/style/Icon.js';
  import Fill from 'ol/style/Fill.js';
  import Stroke from 'ol/style/Stroke.js';
  import Style from 'ol/style/Style.js';
  import Text from 'ol/style/Text.js';
  import Overlay from 'ol/Overlay.js';
  import { useGeographic } from 'ol/proj.js';
  import { boundingExtent } from 'ol/extent.js';
  import 'ol/ol.css';

  import { backendFetch } from '@/utils/backendFetch.js';

  export default {
    name: 'EntityOrganisationsMap',

    data() {
      return {
        olMap: null,
        baseLayer: null,
        selectedStyle: 'osm_standard',
        organisations: [],
        clusters: null,
        overlay: null,
        greyscale: true
      };
    },
    async fetch() {
      const response = await this.fetchData();
      this.organisations = response.items;
    },

    watch: {
      organisations() {
        this.initClustersLayer();
        this.olMap.addLayer(this.clusters);
      }
    },

    mounted() {
      this.initMap();
    },

    methods: {
      fetchData() {
        return backendFetch('collections', ['organisations/map', {}], this.$nuxt.context);
      },
      initMap() {
        // use Geographic projection for correct position of geo coordinates
        useGeographic();

        // set default baseLayer to use OSM map style
        this.baseLayer = new TileLayer({ source: new OSM(), className: 'osm-layer' });

        const layers = [this.baseLayer];

        if (this.organisations.length) {
          this.initClustersLayer();
          layers.push(this.clusters);
        }

        // Create an overlay to anchor the popover to the map.
        this.overlay = new Overlay({
          element: this.$refs.popover,
          autoPan: {
            animation: {
              duration: 250
            }
          }
        });

        // init map
        this.olMap = new Map({
          target: this.$refs.map,
          layers,
          overlays: [this.overlay],
          view: new View({
            center: [0, 0],
            minZoom: 1,
            zoom: 2
          })
        });

        this.olMap.on('click', this.handleClick);
      },
      initClustersLayer() {
        const features = this.organisations.map((org) => (new Feature({
          geometry: new Point(org.geo),
          name: org.id
        })));

        const source = new VectorSource({
          features
        });

        const clusterSource = new Cluster({
          distance: parseInt(40, 10),
          minDistance: parseInt(20, 10),
          source
        });

        const styleCache = {};

        // set clusters layer
        this.clusters = new VectorLayer({
          source: clusterSource,
          style(feature) {
            const size = feature.get('features').length;
            let style = styleCache[size];
            if (!style) {
              if (size === 1) {
                style = new Style({
                  image: new Icon({
                    src: require('@europeana/style/img/icons/ic_location.svg'),
                    width: 32,
                    height: 32
                  })
                });
              } else {
                style = new Style({
                  image: new CircleStyle({
                    radius: 14,
                    stroke: new Stroke({
                      color: '#000'
                    }),
                    fill: new Fill({
                      color: size === 1 ? '#f00' : '#000'
                    })
                  }),
                  text: new Text({
                    text: size.toString(),
                    fill: new Fill({
                      color: '#fff'
                    }),
                    font: '700 0.875rem "Open Sans", "Arial", sans-serif'
                  })
                });
              }
              styleCache[size] = style;
            }
            return style;
          }
        });
      },
      handleClick(e) {
        this.clusters.getFeatures(e.pixel).then((clickedFeatures) => {
          if (clickedFeatures.length) {
            // Get clustered Coordinates
            const features = clickedFeatures[0].get('features');
            if (features.length > 1) {
              const extent = boundingExtent(
                features.map((r) => r.getGeometry().getCoordinates())
              );
              this.olMap.getView().fit(extent, { duration: 1000, padding: [50, 50, 50, 50] });
            }
            if (features.length === 1) {
              const id = features[0].get('name');
              const coordinates = features[0].getGeometry().flatCoordinates;

              this.$refs.popoverContent.innerHTML = `<a href="${id}" target="_blank">Go to org ${id.split('/').pop()}</a>`;
              this.overlay.setPosition(coordinates);
            }
          }
        });
      },
      toggleGreyscale() {
        this.greyscale = !this.greyscale;
      }

    }
  };
</script>

<style lang="scss" scoped>
.organisations-map {
  width: 100%;
  height: 80vh;
  position: relative;

  &.greyscale-on ::v-deep .osm-layer {
    filter: grayscale(100%)
  }

  .ol-popup {
    position: absolute;
    min-width: 10rem;
  }

}
</style>
