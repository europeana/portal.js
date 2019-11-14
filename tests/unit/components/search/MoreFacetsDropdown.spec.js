import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import MoreFacetsDropdown from '../../../../components/search/MoreFacetsDropdown.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => mount(MoreFacetsDropdown, {
  localVue,
  mocks: {
    $t: (key) => key
  }
});

describe('components/search/MoreFacetsDropdown', () => {
  it('displays the correct number of saved options', () => {
    const wrapper = factory();

    wrapper.setData({
      saved: {
        LANGUAGE: ['de', 'sv'],
        PROVIDER: ['OpenUp!']
      }
    });

    wrapper.vm.savedOptions.length.should.eql(3);
  });

  it('displays the correct number of pre-saved options', () => {
    const wrapper = factory();

    wrapper.setData({
      preSaved: {
        LANGUAGE: ['de', 'sv'],
        PROVIDER: ['OpenUp!']
      }
    });

    wrapper.vm.preSavedOptions.length.should.eql(3);
  });

  it('disables the apply button when nothing has been selected', () => {
    const wrapper = factory();

    wrapper.setData({
      preSaved: {},
      saved: {}
    });

    wrapper.vm.disableAppliedButton.should.eql(true);
  });

  it('disables the apply button when nothing new has been selected', () => {
    const wrapper = factory();

    wrapper.setData({
      preSaved: {},
      saved: {
        LANGUAGE: ['de', 'sv'],
        PROVIDER: ['OpenUp!']
      }
    });

    wrapper.vm.disableAppliedButton.should.eql(true);
  });

  it('enables the apply button when an option has been selected', () => {
    const wrapper = factory();

    wrapper.setData({
      preSaved: {
        LANGUAGE: ['de', 'sv']
      }
    });

    wrapper.vm.disableAppliedButton.should.eql(false);
  });

  it('clones pre-saved data to saved data when user clicks applied button', () => {
    const wrapper = factory();
    const appliedButton = wrapper.find('[data-qa="apply button"]');

    wrapper.setData({
      preSaved: {
        LANGUAGE: ['de', 'sv']
      }
    });

    appliedButton.trigger('click');

    wrapper.vm.preSaved.should.eql({});
    wrapper.vm.saved.should.eql({ LANGUAGE: ['de', 'sv'] });
  });

  it('clears presaved data when user clicks Cancel button', () => {
    const wrapper = factory();
    const cancelButton = wrapper.find('[data-qa="cancel button"]');

    wrapper.setData({
      preSaved: {
        LANGUAGE: ['de', 'sv']
      }
    });

    cancelButton.trigger('click');

    wrapper.vm.preSaved.should.eql({});
  });

  it('clears presaved and saved data when user clicks Reset Filter button', () => {
    const wrapper = factory();
    const cancelButton = wrapper.find('[data-qa="reset filter button"]');

    wrapper.setData({
      preSaved: {
        LANGUAGE: ['de', 'sv']
      },
      saved: {
        LANGUAGE: ['en']
      }
    });

    cancelButton.trigger('click');

    wrapper.vm.preSaved.should.eql({});
    wrapper.vm.saved.should.eql({});
  });
});
