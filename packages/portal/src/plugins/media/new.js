import Vue from 'vue';
import ItemMediaPresentation from '@/components/item/ItemMediaPresentation.vue';

const plugin = {
  install(vue) {
    vue.component('ItemMediaPresentation', ItemMediaPresentation);
  }
};

export default () => {
  Vue.use(plugin);
};
