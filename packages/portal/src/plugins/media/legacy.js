import Vue from 'vue';
import ItemMediaLegacy from '@/components/item/ItemMediaLegacy.vue';

const plugin = {
  install(vue) {
    vue.component('ItemMediaPresentation', ItemMediaLegacy);
  }
};

export default () => {
  Vue.use(plugin);
};
