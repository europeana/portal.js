import { init as initApm } from '@elastic/apm-rum';

export default {
  install(Vue, options) {
    Vue.mixin({
      created() {
        console.log('elastic-apm-rum plugin created mixin');
      }
    });
    console.log('\n\nelastic-apm-rum plugin', options, '\n\n');
    initApm(options);
  }
};
