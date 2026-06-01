import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

import EntityHeader from '@/components/entity/EntityHeader.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.directive('masonry-tile', {});

const factory = (propsData = {}) => shallowMount(EntityHeader, {
  localVue,
  propsData,
  mocks: {
    $apis: {
      entity: {
        imageUrl: sinon.spy()
      }
    },
    $i18n: {
      locale: 'en'
    },
    $store: {
      state: {
        search: {
          view: 'grid'
        }
      }
    },
    $t: (val) => val,
    $redrawVueMasonry: () => true
  },
  stubs: ['EntityInformationModal', 'EntityUpdateModal']
});

const entityProps = {
  title: { values: ['Book'], code: 'en' },
  description: { values: ['Architecture is both the process and the product of planning, designing, and constructing buildings and other physical structures.'], code: 'en' },
  editable: false,
  entity: {
    id: 'http://data.europeana.eu/concept/6',
    prefLabel: { en: 'Book' }
  }
};

const organisationEntityProps = {
  title: { values: ['Bibliotheek'], code: 'nl' },
  description: { values: ['Architecture is both the process and the product of planning, designing, and constructing buildings and other physical structures.'], code: 'en' },
  editable: false,
  entity: {
    id: 'http://data.europeana.eu/organization/1',
    logo: { id: 'https://www.example.eu/logo.svg' },
    homepage: 'https://www.example.eu/',
    mbox: 'email@example.org',
    prefLabel: { en: 'Library',  nl: 'Bibliotheek' },
    type: 'Organization'
  }
};

describe('components/entity/EntityHeaders', () => {
  describe('template', () => {
    it('shows a title and description', () => {
      const wrapper = factory(entityProps);

      expect(wrapper.find('[data-qa="entity title"]').text()).toBe('Book');
      expect(wrapper.find('[data-qa="entity description"]').text()).toBe(entityProps.description.values[0]);
    });

    it('does not show a show more button', () => {
      const wrapper = factory(entityProps);
      expect(wrapper.findAll('b-button-stub[data-qa="entity show link"]').length).toBe(0);
    });

    it('shows a show more button', () => {
      const longDescription = entityProps.description.values[0] + entityProps.description.values[0] + entityProps.description.values[0];
      const wrapper = factory({ ...entityProps, description: { values: [longDescription], code: 'en' } });

      expect(wrapper.findAll('b-button-stub[data-qa="entity show link"]').length).toBe(1);
    });

    it('shows the whole description when it is toggled on', () => {
      const longDescription = entityProps.description.values[0] + entityProps.description.values[0] + entityProps.description.values[0];
      const wrapper = factory({ ...entityProps, description: { values: [longDescription], code: 'en' } });
      const button = wrapper.find('[data-qa="entity show link"]');
      button.trigger('click');
      wrapper.vm.$nextTick(() => {
        expect(wrapper.find('[data-qa="entity description"]').text()).toBe(longDescription);
      });
    });

    describe('editing when it is enabled', () => {
      it('shows an edit button', () => {
        // This test doesn't confirm that the button opens the modal.
        const wrapper = factory({ ...entityProps, editable: true });

        const editButton = wrapper.find('[data-qa="entity edit button"]');

        expect(editButton.exists()).toBe(true);
      });

      it('has an edit modal', () => {
        // This test doesn't confirm that the modal works, just that it exists.
        const wrapper = factory({ ...entityProps, editable: true });

        const editModal = wrapper.find('entityupdatemodal-stub');

        expect(editModal.exists()).toBe(true);
      });
    });

    describe('when type is organisation', () => {
      it('shows a logo', () => {
        const wrapper = factory(organisationEntityProps);

        const logo = wrapper.find('[data-qa="entity logo"]');
        const resizedLogo = wrapper.vm.resizedLogo;

        expect(logo.exists()).toBe(true);
        expect(logo.attributes('style')).toBe(`background-image: url(${resizedLogo});`);
      });

      it('shows a contact button', () => {
        const wrapper = factory(organisationEntityProps);

        const contactButton = wrapper.find('[data-qa="entity contact button"]');

        expect(contactButton.exists()).toBe(true);
        expect(contactButton.attributes('href')).toBe('mailto:email@example.org');
      });

      it('shows a learn more button', () => {
      // This test doesn't confirm that the button opens the modal.
        const wrapper = factory(organisationEntityProps);

        const learnMoreButton = wrapper.find('[data-qa="entity details button"]');

        expect(learnMoreButton.exists()).toBe(true);
      });

      it('has a more info modal', () => {
      // This test doesn't confirm that the modal works, just that it exists.
        const wrapper = factory(organisationEntityProps);

        const moreInfoModal = wrapper.find('entityinformationmodal-stub');

        expect(moreInfoModal.exists()).toBe(true);
      });
    });
  });

  describe('computed', () => {
    describe('thumbnail', () => {
      it('returns a thumbnail when available', () => {
        const wrapper = factory(entityProps);

        wrapper.vm.thumbnail;
        expect(wrapper.vm.$apis.entity.imageUrl.called).toBe(true);
      });
    });
    describe('when type is organisation', () => {
      describe('email', () => {
        it('returns the email on organisation pages', () => {
          const wrapper = factory(organisationEntityProps);

          const email = wrapper.vm.email;
          expect(email).toBe(organisationEntityProps.entity.mbox);
        });
      });
      describe('subTitle', () => {
        it('uses the English prefLabel for an organisation, if non-native', () => {
          const wrapper = factory(organisationEntityProps);

          const subTitle = wrapper.vm.subTitle.values[0];

          expect(subTitle).toBe(organisationEntityProps.entity.prefLabel.en);
        });
      });
      describe('homepage', () => {
        it('returns a homepage on organisation pages', () => {
          const wrapper = factory(organisationEntityProps);

          const homepage = wrapper.vm.homepage;
          expect(homepage).toBe(organisationEntityProps.entity.homepage);
        });
      });
      describe('logo', () => {
        it('returns a logo', () => {
          const wrapper = factory(organisationEntityProps);

          const logo = wrapper.vm.logo;
          expect(logo).toBe(organisationEntityProps.entity.logo.id);
        });
      });
    });
  });
});
