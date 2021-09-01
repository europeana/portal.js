import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import AddItemToSetButton from '@/components/set/AddItemToSetButton';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const collection =
  {
    id: '001',
    items: [{ id: '/000/aaa' }],
    title: 'Test collection',
    total: 1,
    visibility: 'public'
  };

const factory = (propsData = {}) => shallowMount(AddItemToSetButton, {
  localVue,
  propsData: {
    ...propsData
  },
  mocks: {
    $tc: () => {},
    $i18n: {}
  }
});

describe('components/set/AddItemToSetButton', () => {
  it('emits the toggle event', async() => {
    const wrapper = factory({ set: collection });

    await wrapper.find('[data-qa="toggle item button"]').trigger('click');

    wrapper.emitted('toggle').length.should.equal(1);
  });

  context('when an item is not yet added it', () => {
    it('contains a background image of the first item in the set', () => {
      const wrapper = factory({ set: collection, img: 'https://www.example.org/image' });

      wrapper.find('[data-qa="toggle item button"]').attributes('style').should.equal('background-image: url(https://www.example.org/image);');
    });
  });
});
