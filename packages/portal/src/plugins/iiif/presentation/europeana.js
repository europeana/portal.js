import Vue from 'vue';
import IIIFPresentation from '@/components/iiif/IIIFPresentation.vue';

const plugin = {
  install(vue) {
    vue.component('IIIFPresentation', IIIFPresentation);
  }
};

export default () => {
  Vue.use(plugin);
};
