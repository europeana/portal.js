import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../../utils';
import BootstrapVue from 'bootstrap-vue';

import page from '@/pages/contentful/entity-suggest/index';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMountNuxt(page, {
  localVue,
  mocks: {
    $t: (key) => key,
    $apis: {
      entity: {
        find: sinon.spy(),
        suggest: sinon.spy()
      }
    }
  }
});

describe('pages/contentful/entity-suggest/index', () => {
  afterEach(sinon.resetHistory);

  describe('head', () => {
    describe('title', () => {
      it('is "Entity suggest - Contentful app"', () => {
        const wrapper = factory();

        expect(wrapper.vm.head().title).toBe('Entity suggest - Contentful app');
      });
    });
  });

  describe('methods', () => {
    describe('findEntities', () => {
      const value = [
        'http://data.europeana.eu/concept/1',
        'http://data.europeana.eu/concept/2'
      ];

      it('queries the Entity API for current entities', async() => {
        const wrapper = factory();

        await wrapper.vm.findEntities(value);

        expect(wrapper.vm.$apis.entity.find.calledWith(value)).toBe(true);
      });
    });

    describe('suggestEntities', () => {
      it('queries the Entity API for suggestions', async() => {
        const wrapper = factory();
        const text = 'museum';

        await wrapper.vm.suggestEntities(text);

        expect(wrapper.vm.$apis.entity.suggest.calledWith(
          text, { type: 'agent,concept,timespan,organization,place' }
        )).toBe(true);
      });
    });
  });
});
