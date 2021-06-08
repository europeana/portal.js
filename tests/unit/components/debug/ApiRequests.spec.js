import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import ApiRequests from '../../../../src/components/debug/ApiRequests.vue';

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

    apiRequests.length.should.eq(2);
  });

  it('displays the HTTP request method', () => {
    const requests = [
      { method: 'GET', url: 'https://api.example.org/request/1' },
      { method: 'POST', url: 'https://api.example.org/request/2' }
    ];
    const wrapper = factory({ requests });

    const apiRequests = wrapper.findAll('[data-qa="logged API request"]');

    apiRequests.at(0).text().should.include('GET');
    apiRequests.at(1).text().should.include('POST');
  });

  context('when HTTP request method is GET', () => {
    it('links to the request URL', () => {
      const requests = [
        { method: 'GET', url: 'https://api.example.org/request/1' }
      ];

      const wrapper = factory({ requests });

      const apiRequestLink = wrapper.find('[data-qa="logged API request"] a');

      apiRequestLink.text().should.eq('https://api.example.org/request/1');
      apiRequestLink.attributes('href').should.eq('https://api.example.org/request/1');
    });
  });

  context('when HTTP request method is not GET', () => {
    it('just displays the URL', () => {
      const requests = [
        { method: 'POST', url: 'https://api.example.org/request/1' }
      ];

      const wrapper = factory({ requests });

      const apiRequest = wrapper.find('[data-qa="logged API request"]');

      apiRequest.text().should.include('https://api.example.org/request/1');
      apiRequest.find('a').exists().should.be.false;
    });
  });
});
