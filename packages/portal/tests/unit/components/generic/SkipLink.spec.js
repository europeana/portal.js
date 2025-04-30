import { createLocalVue, shallowMount } from '@vue/test-utils';
import sinon from 'sinon';

import SkipLink from '@/components/generic/SkipLink.vue';

const localVue = createLocalVue();

const factory = () => {
  return shallowMount(SkipLink, {
    localVue,
    attachTo: document.body,
    mocks: {
      $t: (key) => key
    },
    stubs: ['b-button']
  });
};

describe('components/generic/SkipLink', () => {
  it('is rendered', async() => {
    const wrapper = factory();

    expect(wrapper.find('b-button-stub').exists()).toBe(true);
  });

  describe('when clicked', () => {
    describe('and selected element does not exist', () => {
      it('does not focus to the selected element', async() => {
        const wrapper = factory();
        const selectedElement = document.querySelector(wrapper.vm.selector);

        wrapper.vm.handleClick();

        expect(selectedElement).toBeFalsy();
      });
    });
    describe('and selected element exists', () => {
      it('sets focus to the selected element', async() => {
        const wrapper = factory();
        const mainElement = document.createElement('div');
        mainElement.id = 'main';
        document.body.appendChild(mainElement);
        const selectedElement = document.querySelector(wrapper.vm.selector);
        selectedElement.focus = sinon.spy();

        wrapper.vm.handleClick();

        expect(selectedElement.focus.called).toBe(true);
      });
    });
  });
});
