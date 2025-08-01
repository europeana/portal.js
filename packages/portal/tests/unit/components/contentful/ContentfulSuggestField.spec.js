import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt, fakeContentfulExtension } from '../../utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

import ContentfulSuggestField from '@/components/contentful/ContentfulSuggestField';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = ({ propsData = {} } = {}) => shallowMountNuxt(ContentfulSuggestField, {
  localVue,
  propsData: {
    resolver: () => [],
    suggester: () => [],
    ...propsData
  }
});

const fixtures = {
  fieldValue: ['/item1', '/item2'],
  resolvedValue: [{ id: '/item1', name: 'Item 1' }, { id: '/item2', name: 'Item 2' }]
};

describe('components/embed/ContentfulSuggestField', () => {
  beforeEach(() => {
    window.contentfulExtension = fakeContentfulExtension({ location: 'field', fieldReturnValue: fixtures.fieldValue });
  });

  describe('template', () => {
    describe('selected values', () => {
      const selector = '[data-qa="selected values"] [type="button"]';

      it('displays a button for each', async() => {
        const wrapper = await factory();
        await wrapper.setData({ value: fixtures.resolvedValue });

        const buttons = wrapper.findAll(selector);

        expect(buttons.length).toBe(2);
      });

      it('calls the labeller to get the text to display', async() => {
        const labeller = (val) => val.name;
        const wrapper = await factory({ propsData: { labeller } });
        await wrapper.setData({ value: fixtures.resolvedValue });

        const buttons = wrapper.findAll(selector);

        expect(buttons.at(0).text()).toBe(fixtures.resolvedValue[0].name);
        expect(buttons.at(1).text()).toBe(fixtures.resolvedValue[1].name);
      });

      describe('when clicked', () => {
        it('removes that value from the selection', async() => {
          const wrapper = await factory();
          await wrapper.setData({ value: fixtures.resolvedValue });

          const button = wrapper.find(selector);
          await button.trigger('click');

          expect(wrapper.vm.value.length).toBe(1);
          const buttons = wrapper.findAll(selector);
          expect(buttons.length).toBe(1);
        });
      });
    });

    describe('search input', () => {
      it('has customisable placeholder', () => {
        const placeholder = 'Find what you are looking for';
        const wrapper = factory({ propsData: { placeholder } });

        const searchInput = wrapper.find('[data-qa="search input"]');

        expect(searchInput.attributes('placeholder')).toBe(placeholder);
      });

      it('calls the suggester on input event', async() => {
        const inputText = 'item';
        const suggester = sinon.stub().withArgs(inputText).resolves(fixtures.resolvedValue);

        const wrapper = factory({ propsData: { suggester } });
        const searchInput = wrapper.find('[data-qa="search input"]');
        await searchInput.vm.$emit('input', inputText);

        expect(suggester.calledWith(inputText)).toBe(true);
        expect(wrapper.vm.suggestions).toEqual(fixtures.resolvedValue);
      });
    });

    describe('suggestions', () => {
      const selector = '[data-qa="suggestions"] [type="button"]';

      it('displays a button for each', async() => {
        const wrapper = await factory();
        await wrapper.setData({ suggestions: fixtures.resolvedValue });

        const buttons = wrapper.findAll(selector);

        expect(buttons.length).toBe(2);
      });

      it('calls the labeller to get the text to display', async() => {
        const labeller = (val) => val.name;
        const wrapper = await factory({ propsData: { labeller } });
        await wrapper.setData({ suggestions: fixtures.resolvedValue });

        const buttons = wrapper.findAll(selector);

        expect(buttons.at(0).text()).toBe(fixtures.resolvedValue[0].name);
        expect(buttons.at(1).text()).toBe(fixtures.resolvedValue[1].name);
      });

      describe('when clicked', () => {
        it('adds that value to the selection', async() => {
          const wrapper = await factory();
          await wrapper.setData({ suggestions: fixtures.resolvedValue });

          expect(wrapper.vm.value.length).toBe(0);
          const button = wrapper.find(selector);
          await button.trigger('click');

          expect(wrapper.vm.value.length).toBe(1);
        });
      });
    });
  });

  describe('mounted', () => {
    it('triggers the window auto resizer', () => {
      const wrapper = factory();

      expect(wrapper.vm.contentfulExtensionSdk.window.startAutoResizer.called).toBe(true);
    });

    it('calls the resolver to get the initial field values', async() => {
      const resolver = sinon.stub().withArgs(fixtures.fieldValue).resolves(fixtures.resolvedValue);

      const wrapper = factory({ propsData: { resolver } });
      await wrapper.vm.$nextTick();

      expect(resolver.calledWith(fixtures.fieldValue)).toBe(true);
      expect(wrapper.vm.value).toEqual(fixtures.resolvedValue);
    });
  });
});
