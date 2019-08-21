import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import RightsStatement from '../../../../components/generic/RightsStatement.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMount(RightsStatement, {
  localVue
});

describe('components/generic/RightsStatement', () => {
  it('has a name', () => {
    const wrapper = factory();
    wrapper.setProps({ rightsStatementUrl: 'https://creativecommons.org/publicdomain/mark/1.0/' });

    const rights = wrapper.find('[data-qa="rights statement"]');
    rights.text().should.contain('Public Domain');
  });

  it('has an icon', () => {
    const wrapper = factory();
    wrapper.setProps({ rightsStatementUrl: 'https://creativecommons.org/publicdomain/mark/1.0/' });

    const rights = wrapper.find('[data-qa="rights statement"] .license');
    rights.attributes().class.should.contain('icon-license-pd');
  });
});
