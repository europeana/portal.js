import nock from 'nock';
import sinon from 'sinon';
import Vue from 'vue';
import VueContentfulGraphql from '@europeana/vue-contentful-graphql';

import VueContentfulGraphqlNuxtPlugin from '@/plugins/vue-contentful-graphql.js';

const contentfulQueryStub = sinon.stub();
const apmCaptureErrorStub = sinon.stub();

describe('VueContentfulGraphql Nuxt plugin', () => {
  beforeAll(() => {
    nock.disableNetConnect();
    sinon.stub(Vue, 'use').withArgs(sinon.match.same(VueContentfulGraphql, sinon.match.object)).callsFake(() => {
      Vue.prototype.$contentful = {
        query: contentfulQueryStub
      };
    });
  });
  afterEach(() => {
    delete Vue.prototype.$contentful;
    sinon.resetHistory();
  });
  afterAll(() => {
    nock.enableNetConnect();
    sinon.restore();
  });

  describe('query function wrapper', () => {
    it('calls the original query function', () => {
      const ctx = {};
      VueContentfulGraphqlNuxtPlugin(ctx);

      Vue.prototype.$contentful.query();

      expect(contentfulQueryStub.called).toBe(true);
    });

    it('captures query errors to APM and re-throws', () => {
      const ctx = { $apm: { captureError: apmCaptureErrorStub } };
      VueContentfulGraphqlNuxtPlugin(ctx);
      const upstreamErr = new Error('oh no');
      contentfulQueryStub.throws(upstreamErr);

      let thrownErr;
      try {
        Vue.prototype.$contentful.query();
      } catch (e) {
        thrownErr = e;
      }

      expect(ctx.$apm.captureError.called).toBe(true);
      expect(thrownErr).toBe(upstreamErr);
    });
  });
});
