import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt, fakeContentfulExtension } from '../../../utils';
import BootstrapVue from 'bootstrap-vue';

import page from '@/pages/contentful/entity-suggest/index';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMountNuxt(page, {
  localVue,
  mocks: {
    $t: key => key,
    $apis: {
      entity: {
        suggest: sinon.spy()
      }
    }
  }
});

describe('pages/contentful/entity-suggest/index', () => {
  beforeAll(() => {
    window.contentfulExtension = fakeContentfulExtension();
  });

  describe('head', () => {
    describe('title', () => {
      it('is "Entity suggest - Contentful app"', () => {
        const wrapper = factory();

        expect(wrapper.vm.head().title).toBe('Entity suggest - Contentful app');
      });
    });
  });

  describe('methods', () => {
    describe('inputSearchText', () => {
      it('queries the Entity API for suggestions', async() => {
        const wrapper = factory();
        const text = 'museum';

        await wrapper.vm.inputSearchText(text);

        expect(wrapper.vm.$apis.entity.suggest.calledWith(
          text, { type: 'agent,concept,timespan,organization,place' }
        )).toBe(true);
      });
    });
  });
});
