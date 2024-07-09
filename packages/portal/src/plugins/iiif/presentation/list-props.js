import Vue from 'vue';
import IIIFListProps from '@/components/iiif/IIIFListProps.vue';

const plugin = {
  install(vue) {
    vue.component('IIIFPresentation', IIIFListProps);
  }
};

export default () => {
  Vue.use(plugin);
};
