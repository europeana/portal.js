<template>
  <div
    id="organisations-map"
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
</template>

<script>
  import Map from 'ol/Map.js';
  import View from 'ol/View.js';
  import TileLayer from 'ol/layer/Tile.js';
  import OSM from 'ol/source/OSM.js';
  import StadiaMaps from 'ol/source/StadiaMaps.js';

  export default {
    name: 'EntityOrganisationsMap',

    data() {
      return {
        olMap: null,
        baseLayer: null,
        selectedStyle: 'osm_standard'
      };
    },
    mounted() {
      this.initMap();
    },
    methods: {
      initMap() {
        this.baseLayer = new TileLayer({ source: new OSM() });

        this.olMap = new Map({
          target: 'organisations-map',
          layers: [this.baseLayer],
          view: new View({
            center: [0, 0],
            minZoom: 1,
            zoom: 2
          })
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

<style scoped>
.organisations-map {
  width: 100%;
  height: 90vh;
}
</style>
