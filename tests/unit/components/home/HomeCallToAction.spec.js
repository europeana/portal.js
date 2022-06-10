import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';
import HomeCallToAction from '@/components/home/HomeCallToAction';
import sinon from 'sinon';

const localVue = createLocalVue();

const factory = ({ propsData = {} } = {}) => shallowMountNuxt(HomeCallToAction, {
  localVue,
  propsData
});

describe('components/home/HomeCallToAction', () => {
  describe('computed', () => {
    describe('html', () => {
      it('converts CTA text Markdown to HTML', () => {
        const wrapper = factory({ propsData: {
          name: 'CTA',
          text: '**Attention!**',
          link: {
            url: '/attention',
            text: 'Read more'
          }
        } });

        expect(wrapper.vm.html).toBe('<p><strong>Attention!</strong></p>\n');
      });
    });
  });
});
