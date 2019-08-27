import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import WebResources from '../../../../components/record/WebResources.vue';
import cssesc from 'cssesc';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = () => shallowMount(WebResources, {
  localVue
});

describe('components/record/WebResources', () => {
  it('outputs each web resource in `media`', () => {
    const wrapper = factory();
    const props = {
      media: [
        { about: 'http://www.example.org/image.jpg', dcDescription: ['Art'] },
        { about: 'http://www.example.org/video.mp4', edmRights: { 'def': [ 'http://creativecommons.org/licenses/by-nc-sa/3.0/' ] } }
      ]
    };

    wrapper.setProps(props);
    for (let webResource of props.media) {
      const webResourceBlock = wrapper.find('#' + cssesc(webResource.about, { 'isIdentifier': true }));
      webResourceBlock.isVisible().should.equal(true);
    }
  });
});
