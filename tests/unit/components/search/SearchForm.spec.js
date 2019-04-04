import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import SearchForm from '../../../../components/search/SearchForm.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => mount(SearchForm, {
  localVue
});

describe('components/search/SearchForm', () => {
  it('uses `value` prop for input field value', () => {
    const wrapper = factory();

    wrapper.setProps({ value: 'painting' });
    const searchBox =  wrapper.find('[data-qa="search box"]');

    searchBox.element.value.should.eq('painting');
  });

  it('hides the loading spinner by default', () => {
    const wrapper = factory();
    const loadingSpinner =  wrapper.find('[data-qa="loading spinner"]');

    loadingSpinner.isVisible().should.eq(false);
  });

  it('shows the loading spinner if `isLoading` is `true`', () => {
    const wrapper = factory();

    wrapper.setProps({ isLoading: true });
    const loadingSpinner =  wrapper.find('[data-qa="loading spinner"]');

    loadingSpinner.isVisible().should.eq(true);
  });

  it('emits submit:searchForm when submitted', () => {
    const wrapper = factory();
    const form =  wrapper.find('form');

    form.trigger('submit.prevent');

    wrapper.emitted()['submit:searchForm'].length.should.equal(1);
  });
});
