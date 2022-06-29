import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt, fakeContentfulExtension } from '../../../utils';
import BootstrapVue from 'bootstrap-vue';

import page from '@/pages/contentful/entity-suggest/index';
import sinon from 'sinon';
import { apiError } from '@/plugins/europeana/utils';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMountNuxt(page, {
  localVue,
  mocks: {
    $t: key => key,
    $pageHeadTitle: key => key,
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

  describe('head', () => {
    it('sets the title to: Entity suggest - Contentful app', () => {
      const wrapper = factory();

      expect(wrapper.vm.head().title).toBe('Entity suggest - Contentful app');
    });
  });
});
