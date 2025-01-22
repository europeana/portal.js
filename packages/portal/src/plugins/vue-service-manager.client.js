import Vue from 'vue';
import VueServiceManagerPlugin from '@europeana/vue-service-manager';
import services from '@/utils/services/definitions.js';

export default (ctx) => {
  if (ctx.$features?.embeddedMediaNotification) {
    // TODO: supply callbacks...?
    Vue.use(VueServiceManagerPlugin, { services });
  }
};
