import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import RelatedChip from '@/components/generic/RelatedChip.vue';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const factory = (mocks = {}) => shallowMount(RelatedChip, {
  localVue,
  mocks,
  propsData: {
    id: '/collections/topic/190-art',
    title: 'Art'
  }
});

describe('components/generic/RelatedChip', () => {
  it('renders a related collection chip', () => {
    const wrapper = factory({
      $link: {
        to: route => route,
        href: () => null
      }
    });
    wrapper.findAll('[data-qa="Art related chip"]').length.should.eq(1);
  });

  it('has a collection title, lang and link', async() => {
    const wrapper = factory({
      $link: {
        to: route => route,
        href: () => null
      }
    });
    await wrapper.setProps({
      linkTo: '/collections/topic/190-art',
      title: 'Art'
    });

    const chip = wrapper.find('[data-qa="Art related chip"]');
    chip.text().should.eq('Art');
    chip.attributes().to.should.contain('190-art');
    (chip.attributes().href === undefined).should.be.true;
  });

  it('translates lang maps for title', async() => {
    const wrapper = factory({
      $link: {
        to: route => route,
        href: () => null
      },
      $i18n: { locale: 'de' }
    });

    await wrapper.setProps({
      linkTo: '/collections/topic/33-costume',
      title: {
        en: 'Costume'
      }
    });

    const chip = wrapper.find('[data-qa="Costume related chip"]');
    chip.text().should.eq('Costume');
  });

  it('tracks the event in Matomo', async() => {
    const wrapper = factory({
      $link: {
        to: route => route,
        href: () => null
      },
      $i18n: { locale: 'en' },
      $matomo: {
        trackEvent: sinon.spy()
      }
    });

    await wrapper.setProps({
      linkTo: '/collections/topic/33-costume',
      title: {
        en: 'Costume'
      }
    });

    wrapper.vm.trackClickEvent();
    wrapper.vm.$matomo.trackEvent.should.have.been.calledWith('Related_collections', 'Click related collection', '/collections/topic/33-costume');
  });

  context('when linkTo is a URL with scheme', () => {
    it('is linked to, not routed to', async() => {
      const wrapper = factory({
        $link: {
          href: route => route,
          to: () => null
        }
      });
      await wrapper.setProps({
        linkTo: 'https://www.example.org/collections/topic/190-art',
        title: 'Art'
      });

      const chip = wrapper.find('[data-qa="Art related chip"]');
      chip.attributes().href.should.eq('https://www.example.org/collections/topic/190-art');
      (chip.attributes().to === undefined).should.be.true;
    });
  });
});
