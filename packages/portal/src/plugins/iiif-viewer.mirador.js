import Vue from 'vue';
import IIIFMiradorViewer from '@/components/iiif/IIIFMiradorViewer.vue';

const plugin = {
  install(vue) {
    vue.component('IIIFViewer', IIIFMiradorViewer);
  }
};

export default () => {
  Vue.use(plugin);
};
