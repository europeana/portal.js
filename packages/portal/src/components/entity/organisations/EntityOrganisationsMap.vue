<template>
  <div class="my-5">
    <div
      id="organisations-map"
      ref="map"
      class="organisations-map"
      width="100vh"
      height="80vh"
    >
      <div>
        <label for="basemap-select">Select Style:</label>
        <select
          id="basemap-select"
          v-model="selectedStyle"
          @change="updateBasemap"
        >
          <optgroup label="OpenStreetMap">
            <option value="osm_standard">
              OSM Standard
            </option>
          </optgroup>

          <optgroup label="Stadia Maps">
            <option value="stamen_terrain">
              stamen_terrain
            </option>
            <option value="stamen_toner">
              stamen_toner
            </option>
            <option value="stamen_toner_lite">
              stamen_toner_lite
            </option>
            <option value="stamen_watercolor">
              stamen_watercolor
            </option>
            <option value="alidade_smooth">
              alidade_smooth
            </option>
            <option value="alidade_smooth_dark">
              alidade_smooth_dark
            </option>
            <option value="alidade_satellite">
              alidade_satellite
            </option>
            <option value="outdoors">
              outdoors
            </option>
            <option value="osm_bright">
              osm_bright
            </option>
          </optgroup>
        </select>
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
  import StadiaMaps from 'ol/source/StadiaMaps.js';
  import Feature from 'ol/Feature.js';
  import Point from 'ol/geom/Point.js';
  import VectorSource from 'ol/source/Vector.js';
  import Cluster from 'ol/source/Cluster.js';
  import VectorLayer from 'ol/layer/Vector.js';
  import CircleStyle from 'ol/style/Circle.js';
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
        overlay: null
      };
    },
    async fetch() {
      const response = await this.fetchData();
      this.organisations = response.items;

      // CSR
      if (process.client) {
        this.initMap();
      }
    },

    // SSR
    mounted() {
      if (this.organisations.length && !this.olMap) {
        this.initMap();
      }
    },

    methods: {
      fetchData() {
        return backendFetch('collections', ['organisations/map', {}], this.$nuxt.context);
      },
      initMap() {
        // use Geographic projection for correct position of geo coordinates
        useGeographic();

        // set default baseLayer to use OSM map style
        this.baseLayer = new TileLayer({ source: new OSM() });
        const layers = [this.baseLayer];
        // TODO: is this check still needed?
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
        // TODO: store coordinates as needed here in the cacher, i.e. [Number, Number]
        const features = this.organisations.map((org) => (new Feature({
          geometry: new Point([Number(org.long), Number(org.lat)]),
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
              style = new Style({
                image: new CircleStyle({
                  radius: 10,
                  stroke: new Stroke({
                    color: '#fff'
                  }),
                  fill: new Fill({
                    color: '#0a72cc'
                  })
                }),
                text: new Text({
                  text: size.toString(),
                  fill: new Fill({
                    color: '#fff'
                  })
                })
              });
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
      updateBasemap() {
        if (!this.olMap) {
          return;
        }

        let newSource = null;

        if (this.selectedStyle === 'osm_standard') {
          newSource = new OSM();
        }

        if (['stamen_terrain',
             'stamen_toner',
             'stamen_toner_lite',
             'stamen_watercolor',
             'alidade_smooth',
             'alidade_smooth_dark',
             'alidade_satellite',
             'outdoors',
             'osm_bright'].includes(this.selectedStyle)) {
               newSource = new StadiaMaps({
                 layer: this.selectedStyle,
                 retina: true
               });
             }

        if (newSource) {
          this.olMap.removeLayer(this.baseLayer);

          this.baseLayer = new TileLayer({ source: newSource });

          this.olMap.getLayers().insertAt(0, this.baseLayer);
        }
      }

    }
  };
</script>

<style lang="scss" scoped>
.organisations-map {
  width: 100%;
  height: 80vh;
  position: relative;

  .ol-popup {
    position: absolute;
    min-width: 10rem;
  }
}
</style>
