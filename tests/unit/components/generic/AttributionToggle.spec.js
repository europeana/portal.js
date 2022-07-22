import { createLocalVue, shallowMount } from '@vue/test-utils';
import AttributionToggle from '@/components/generic/AttributionToggle.vue';
import BootstrapVue from 'bootstrap-vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = ({ propsData }) => shallowMount(AttributionToggle, {
  localVue,
  propsData
});

describe('components/generic/AttributionToggle', () => {
  it('toggles the rendering of the attribution', async() => {
    const wrapper = factory({ propsData: {
      attribution: {
        name: 'Something',
        creator: 'Someone',
        provider: 'Somewhere',
        license: 'http://creativecommons.org/licenses/by-nd/4.0/',
        url: 'http://www.example.org/'
      }
    } });

    wrapper.vm.toggleCite();
    await wrapper.vm.$nextTick();
    const attribution = wrapper.find('[data-qa="attribution"]');

    expect(attribution.exists()).toBe(true);
  });

  describe('computed', () => {
    describe('rightsStatement', () => {
      it('favours attribution.rightsStatement', () => {
        const wrapper = factory({ propsData: {
          attribution: {
            name: 'Something',
            creator: 'Someone',
            provider: 'Somewhere',
            rightsStatement: 'http://creativecommons.org/licenses/by-nd/4.0/',
            url: 'http://www.example.org/'
          }
        } });

        const rightsStatement = wrapper.vm.rightsStatement;

        expect(rightsStatement).toBe('http://creativecommons.org/licenses/by-nd/4.0/');
      });

      it('falls back to attribution.license', () => {
        const wrapper = factory({ propsData: {
          attribution: {
            name: 'Something',
            creator: 'Someone',
            provider: 'Somewhere',
            license: 'http://creativecommons.org/licenses/by-nd/4.0/',
            url: 'http://www.example.org/'
          }
        } });

        const rightsStatement = wrapper.vm.rightsStatement;

        expect(rightsStatement).toBe('http://creativecommons.org/licenses/by-nd/4.0/');
      });
    });
  });
});
