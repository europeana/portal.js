import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import sinon from 'sinon';
import BootstrapVue from 'bootstrap-vue';
import ErrorMessage from '@/components/generic/ErrorMessage.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (propsData = {}) => shallowMountNuxt(ErrorMessage, {
  localVue,
  propsData,
  mocks: {
    $store: {
      commit: sinon.spy()
    },
    $t: (key) => key
  },
  stubs: ['i18n']
});

describe('components/generic/ErrorMessage', () => {
  describe('template', () => {
    it('displays illustrated error with description when available', async() => {
      const propsData = {
        error: 'Item was not found',
        titlePath: 'errorMessage.itemNotFound.title',
        descriptionPath: 'errorMessage.itemNotFound.description',
        illustrationSrc: 'src/assets/img/illustrations/il-item-not-found.svg'
      };
      const wrapper = factory(propsData);

      const text = wrapper.text();

      expect(text).toEqual(propsData.descriptionPath);
    });
  });

  describe('fetch', () => {
    it('write pageMeta to the store', () => {
      const propsData = {
        titlePath: 'error.item.not-found.title',
        pageTitlePath: 'error.item.not-found.metaTitle'
      };
      const wrapper = factory(propsData);

      wrapper.vm.$fetch();

      expect(wrapper.vm.$store.commit.calledWith('pageMeta/set', {
        title: 'error.item.not-found.metaTitle',
        description: 'error.item.not-found.title'
      })).toBe(true);
    });

    it('falls back to generic page title if none provided', () => {
      const propsData = {
        titlePath: 'error.item.not-found.title'
      };
      const wrapper = factory(propsData);

      wrapper.vm.$fetch();

      expect(wrapper.vm.$store.commit.calledWith('pageMeta/set', {
        title: 'error',
        description: 'error.item.not-found.title'
      })).toBe(true);
    });
  });
});
