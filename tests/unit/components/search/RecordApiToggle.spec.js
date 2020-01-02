import { createLocalVue, mount } from '@vue/test-utils';

import BootstrapVue from 'bootstrap-vue';
import RecordApiToggle from '../../../../components/search/RecordApiToggle.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);


const factory = () => mount(RecordApiToggle, {
  localVue,
  mocks: {
    $t: (key) => key
  }
});

describe('components/search/RecordApiToggle', () => {
  it('defaults to fulltext', () => {
    const wrapper = factory();
    const fulltextRadio = wrapper.find('input[value="fulltext"]');

    fulltextRadio.element.checked.should.be.true;
  });

  it('emits `change` event with new value when user changes selection', async() => {
    const wrapper = factory();
    const metadataRadio = wrapper.find('input[value="metadata"]');

    metadataRadio.trigger('click');

    localVue.nextTick(() => {
      wrapper.emitted()['change'].should.eql([['metadata']]);
    });
  });
});
