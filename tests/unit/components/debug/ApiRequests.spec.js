import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import ApiRequests from '@/components/debug/ApiRequests.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (propsData) => shallowMount(ApiRequests, {
  localVue,
  propsData,
  mocks: {
    $t: () => ''
  }
});

describe('components/debug/ApiRequests', () => {
  it('lists requests', () => {
    const requests = [
      { method: 'GET', url: 'https://api.example.org/request/1' },
      { method: 'POST', url: 'https://api.example.org/request/2' }
    ];

    const wrapper = factory({ requests });

    const apiRequests = wrapper.findAll('[data-qa="logged API request"]');

    expect(apiRequests.length).toBe(2);
  });

  it('displays the HTTP request method', () => {
    const requests = [
      { method: 'GET', url: 'https://api.example.org/request/1' },
      { method: 'POST', url: 'https://api.example.org/request/2' }
    ];
    const wrapper = factory({ requests });

    const apiRequests = wrapper.findAll('[data-qa="logged API request"]');

    expect(apiRequests.at(0).text()).toContain('GET');
    expect(apiRequests.at(1).text()).toContain('POST');
  });

  describe('when HTTP request method is GET', () => {
    it('links to the request URL', () => {
      const requests = [
        { method: 'GET', url: 'https://api.example.org/request/1' }
      ];

      const wrapper = factory({ requests });

      const apiRequestLink = wrapper.find('[data-qa="logged API request"] a');

      expect(apiRequestLink.text()).toBe('https://api.example.org/request/1');
      expect(apiRequestLink.attributes('href')).toBe('https://api.example.org/request/1');
    });
  });

  describe('when HTTP request method is not GET', () => {
    it('just displays the URL', () => {
      const requests = [
        { method: 'POST', url: 'https://api.example.org/request/1' }
      ];

      const wrapper = factory({ requests });

      const apiRequest = wrapper.find('[data-qa="logged API request"]');

      expect(apiRequest.text()).toContain('https://api.example.org/request/1');
      expect(apiRequest.find('a').exists()).toBeFalsy();
    });
  });
});
