import Vue from 'vue';
import MediaPresentation from '@/components/media/MediaPresentation.vue';

const plugin = {
  install(vue) {
    vue.component('IIIFPresentation', MediaPresentation);
  }
};

export default () => {
  Vue.use(plugin);
};
