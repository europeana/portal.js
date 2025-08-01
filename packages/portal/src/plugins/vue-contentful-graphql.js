import Vue from 'vue';
import VueContentfulGraphql from '@europeana/vue-contentful-graphql';

let queryWrapped;

export default (ctx) => {
  // initialise VueContentfulGraphql Vue plugin
  Vue.use(VueContentfulGraphql, ctx.$config?.contentful);

  // wrap query method to log errors to APM
  if (ctx.$apm && !queryWrapped) {
    const query = Vue.prototype.$contentful.query;

    Vue.prototype.$contentful.query = async function(ast, variables = {}) {
      try {
        return query(ast, variables);
      } catch (error) {
        ctx.$apm.captureError(error, {
          custom: {
            code: error.code
          }
        });
        throw error;
      }
    };

    queryWrapped = true;
  }
};
