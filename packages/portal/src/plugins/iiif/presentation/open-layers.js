import Vue from 'vue';
import IIIFOpenLayers from '@/components/iiif/IIIFOpenLayers.vue';

const plugin = {
  install(vue) {
    vue.component('IIIFPresentation', IIIFOpenLayers);
  }
};

export default () => {
  Vue.use(plugin);
};
