import sinon from 'sinon';
import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '@test/utils.js';

import mixin from '@/mixins/elasticApmReporter';

const component = {
  template: '<div></div>',
  mixins: [mixin]
};

const localVue = createLocalVue();

const stubbedTransaction = {
  addLabels: sinon.spy(),
  end: sinon.spy()
};

const factory = () => shallowMountNuxt(component, {
  localVue,
  mocks: {
    $apm: {
      startTransaction: sinon.stub().returns(stubbedTransaction)
    },
    $session: {
      id: 'session ID'
    }
  }
});

const transaction = {
  name: 'Search',
  labels: {
    'search_query': 'DCLXVI'
  }
};

describe('mixins/elasticApmReporter', () => {
  afterEach(sinon.reset);

  describe('mounted', () => {
    beforeAll(() => {
      sinon.spy(mixin.methods, 'logApmTransaction');
    });
    it('calls logApmTransaction', () => {
      factory();

      expect(mixin.methods.logApmTransaction.called).toBe(true);
    });
  });

  describe('methods', () => {
    describe('logApmTransaction', () => {
      describe('when server-side', () => {
        beforeAll(() => {
          process.server = true;
        });
        afterAll(() => {
          delete process.server;
        });

        it('stores the argument in the component data', () => {
          const wrapper = factory();

          wrapper.vm.logApmTransaction(transaction);

          expect(wrapper.vm.apmTransaction).toEqual(transaction);
        });

        it('does not log to APM', () => {
          const wrapper = factory();

          wrapper.vm.logApmTransaction(transaction);

          expect(wrapper.vm.$apm.startTransaction.called).toBe(false);
        });
      });

      describe('when client-side', () => {
        beforeAll(() => {
          process.client = true;
        });
        afterAll(() => {
          delete process.client;
        });

        it('starts an APM transaction', () => {
          const wrapper = factory();

          wrapper.vm.logApmTransaction(transaction);

          expect(wrapper.vm.$apm.startTransaction.calledWith(
            transaction.name, 'user-interaction'
          )).toBe(true);
        });

        it('adds labels including session ID', () => {
          const wrapper = factory();

          wrapper.vm.logApmTransaction(transaction);

          expect(stubbedTransaction.addLabels.calledWith({
            ...transaction.labels,
            'session_id': 'session ID'
          })).toBe(true);
        });

        it('ends the transaction', async() => {
          const wrapper = factory();

          await wrapper.vm.logApmTransaction(transaction);

          expect(stubbedTransaction.end.called).toBe(true);
        });
      });
    });
  });
});
