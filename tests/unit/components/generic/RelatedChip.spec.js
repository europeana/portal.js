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
    expect(wrapper.findAll('[data-qa="Art related chip"]').length).toBe(1);
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
    expect(chip.text()).toBe('Art');
    expect(chip.attributes().to).toContain('190-art');
    expect(chip.attributes().href === undefined);
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
    expect(chip.text()).toBe('Costume');
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
    expect(wrapper.vm.$matomo.trackEvent.calledWith('Related_collections', 'Click related collection', '/collections/topic/33-costume')).toBe(true);
  });

  describe('when linkTo is a URL with scheme', () => {
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
      expect(chip.attributes().href).toBe('https://www.example.org/collections/topic/190-art');
      expect(chip.attributes().to === undefined);
    });
  });
});
