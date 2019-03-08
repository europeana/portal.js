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
  describe('each web resource in `media`', () => {
    it('outputs each property in a code block', () => {
      const wrapper = factory();
      const props = {
        media: [
          { rdfAbout: 'http://www.example.org/image.jpg', dcDescription: ['Art'] },
          { rdfAbout: 'http://www.example.org/video.mp4', edmRights: { 'def': [ 'http://creativecommons.org/licenses/by-nc-sa/3.0/' ] } }
        ]
      };

      wrapper.setProps(props);

      for (let webResource of props.media) {
        console.log(cssesc(webResource.rdfAbout, {
          'isIdentifier': true
        }));
        const webResourceBlock = wrapper.find('#' + cssesc(webResource.rdfAbout, { 'isIdentifier': true }));
        for (let fieldKey of Object.keys(webResource)) {
          console.log('checking field key');
          const fieldBlock = webResourceBlock.find(`[data-field-name="${fieldKey}"]`);
          let expectedPreCode;
          if (typeof webResource[fieldKey] === 'string') {
            expectedPreCode = webResource[fieldKey];
          } else {
            expectedPreCode = JSON.stringify(webResource[fieldKey], null, 2);
          }
          fieldBlock.find('div strong').text().should.eq(fieldKey);
          fieldBlock.find('pre code').text().should.eq(expectedPreCode);
        }
      }
    });
  });
});
