import Vue from 'vue';
import ItemMediaSwiper from '@/components/item/ItemMediaSwiper.vue';

const plugin = {
  install(vue) {
    vue.component('IIIFViewer', ItemMediaSwiper);
  }
};

export default () => {
  Vue.use(plugin);
};
