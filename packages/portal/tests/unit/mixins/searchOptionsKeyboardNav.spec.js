import { createLocalVue } from '@vue/test-utils';
import { mountNuxt } from '../utils';
import sinon from 'sinon';

import mixin from '@/mixins/searchOptionsKeyboardNav';

const component = {
  template: `<div>
      <div ref="searchdropdown">
        <input ref="searchinput"/>
        <button id="show-search-button">show search button</button>
        <ChildComponent ref="searchoptions"></ChildComponent>
      </div>
    </div>`,
  components: { ChildComponent: { name: 'ChildComponent',
    template: '<div><div v-for="option in [1, 2, 3]" ref="options" /></div>' } },
  mixins: [mixin]
};

const localVue = createLocalVue();

const factory = () => mountNuxt(component, {
  localVue,
  data() {
    return { hidableForm: true, showSearchOptions: false };
  }
});

describe('mixins/searchOptionsKeyboardNav', () => {
  describe('methods', () => {
    describe('handleFocusOut', () => {
      describe('when user clicks outside the search form dropdown', () => {
        it('hides the search options', async() => {
          const handleFocusOutEvent = new Event('click');
          const wrapper = factory();
          await wrapper.setData({ showSearchOptions: true });

          wrapper.vm.handleFocusOut(handleFocusOutEvent);

          expect(wrapper.vm.showSearchOptions).toBe(false);
        });
      });

      describe('when user tabs outside the search form dropdown', () => {
        it('hides the search options', async() => {
          const tabOutsideEvent = new KeyboardEvent('keydown', { key: 'Tab' });
          const wrapper = factory();
          await wrapper.setData({ showSearchOptions: true });

          wrapper.vm.handleFocusOut(tabOutsideEvent);

          expect(wrapper.vm.showSearchOptions).toBe(false);
        });
      });
    });

    describe('handleKeyDown', () => {
      describe('when using the down arrow key', () => {
        it('navigates through the options', () => {
          const handleKeyDownEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
          const wrapper = factory();
          const navigateWithArrowKeys = sinon.spy(wrapper.vm, 'navigateWithArrowKeys');

          wrapper.vm.handleKeyDown(handleKeyDownEvent);

          expect(navigateWithArrowKeys.calledWith(handleKeyDownEvent)).toBe(true);
        });
      });

      describe('when using the Escape key', () => {
        it('hides the search options', () => {
          const handleKeyDownEvent = new KeyboardEvent('keydown', { key: 'Escape' });
          const wrapper = factory();
          const handleHide = sinon.spy(wrapper.vm, 'handleHide');

          wrapper.vm.handleKeyDown(handleKeyDownEvent);

          expect(handleHide.called).toBe(true);
        });
      });
    });
  });
});
