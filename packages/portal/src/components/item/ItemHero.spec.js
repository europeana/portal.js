import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';

import WebResource from '@/plugins/europeana/edm/WebResource.js';
import ItemHero from '@/components/item/ItemHero.vue';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const storeDispatch = sinon.spy();
const storeIsPinnedGetter = sinon.stub();

const factory = ({ propsData = {}, mocks = {}, provide = {} } = {}) => shallowMount(ItemHero, {
  localVue,
  propsData: {
    identifier: '/001/abc',
    ...propsData
  },
  provide: {
    itemIsDeleted: false,
    ...provide
  },
  mocks: {
    $t: (key) => key,
    $i18n: { locale: 'en' },
    $store: {
      getters: {
        'entity/isPinned': storeIsPinnedGetter,
        'entity/id': 'id123'
      },
      dispatch: storeDispatch
    },
    $nuxt: {
      context: {}
    },
    ...mocks
  },
  stubs: ['ItemMediaPresentation', 'NotificationBanner', 'UserButtons']
});

const media = [
  new WebResource({
    about: 'https://europeana1914-1918.s3.amazonaws.com/attachments/119112/10265.119112.original.jpg',
    edmRights: {
      def: ['http://creativecommons.org/licenses/by-sa/3.0/']
    }
  }),
  new WebResource({
    about: 'https://europeana1914-1918.s3.amazonaws.com/attachments/119200/10265.119200.original.jpg',
    edmRights: {
      def: ['http://rightsstatements.org/vocab/InC/1.0/']
    }
  }),
  new WebResource({
    about: 'https://europeana1914-1918.s3.amazonaws.com/attachments/119203/10265.119203.original.jpg',
    edmRights: {
      def: ['Atribution-NonCommercial-NoDerivatives 4.0 Internacional']
    }
  }),
  new WebResource({
    about: 'https://europeana1914-1918.s3.amazonaws.com/attachments/119639/10265.119639.original.jpg',
    edmRights: {
      def: ['http://creativecommons.org/licenses/by-sa/3.0/']
    }
  }),
  new WebResource({
    about: 'https://europeana1914-1918.s3.amazonaws.com/attachments/119640/10265.119640.original.jpg',
    edmRights: {
      def: ['http://creativecommons.org/licenses/by-sa/3.0/']
    }
  }),
  new WebResource({
    about: 'https://europeana1914-1918.s3.amazonaws.com/',
    forEdmIsShownAt: true,
    edmRights: {
      def: ['http://creativecommons.org/licenses/by-sa/3.0/']
    }
  })
];

describe('components/item/ItemHero', () => {
  describe('selectMedia', () => {
    describe('when a new item is selected', () => {
      it('updates the identifier', () => {
        const wrapper = factory({ propsData: { media } });
        wrapper.vm.selectMedia(media[1]);
        expect(wrapper.vm.selectedMedia.about).toBe(media[1].about);
      });

      it('updates the rights statement', () => {
        const wrapper = factory({ propsData: { media } });
        wrapper.vm.selectMedia(media[1]);
        expect(wrapper.vm.selectedMedia.edmRights.def[0]).toBe(media[1].edmRights.def[0]);
      });
    });
  });

  describe('when item is depublished', () => {
    it('shows a notification banner', () => {
      const wrapper = factory({ provide: { itemIsDeleted: true } });

      expect(wrapper.find('notificationbanner-stub').isVisible()).toBe(true);
    });
  });
});
