import Vue from 'vue';
import ItemMediaSwitch from '@/components/item/ItemMediaSwitch.vue';

const plugin = {
  install(vue) {
    vue.component('ItemMediaPresentation', ItemMediaSwitch);
  }
};

export default () => {
  Vue.use(plugin);
};
