import Vue from 'vue';
import VueServiceManager from '@europeana/vue-service-manager';
import services from '@/utils/services/definitions.js';

export default (ctx) => {
  if (ctx.$features?.embeddedMediaNotification) {
    console.log('installing VueServiceManager plugin');
    // TODO: supply callbacks...?
    Vue.use(VueServiceManager, { services });
  }
};
