import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import SocialShareModal from '../../../../components/sharing/SocialShareModal.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (propsData) => shallowMount(SocialShareModal, {
  localVue,
  propsData,
  mocks: {
    $t: (key) => key
  }
});

describe('components/sharing/SocialShareModal', () => {
  context('when endpoint returns html', () => {
    it('form for embed code is shown', async() => {
      const wrapper = factory();
      wrapper.setData({ oEmbedDataHtml: '<iframe src="https://embed.europeana.eu/150/_REB01_000184623" width="1760" height="2656"></iframe>' });
      const embedForm = wrapper.find('[data-qa="share modal embed"]');
      embedForm.exists().should.be.true;
    });
  });
  context('when endpoint does not return html', () => {
    it('form for embed code is not shown', async() => {
      const wrapper = factory();
      const embedForm = wrapper.find('[data-qa="share modal embed"]');
      embedForm.exists().should.be.false;
    });
  });
});
