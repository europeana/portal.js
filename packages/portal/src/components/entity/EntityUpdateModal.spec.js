import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import EntityUpdateModal from '@/components/entity/EntityUpdateModal';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const fixtures = {
  concept: {
    propsData: {
      id: 'http://data.europeana.eu/concept/190',
      description: 'English description'
    },
    profileInternalEntity: {
      id: 'http://data.europeana.eu/concept/190',
      type: 'Concept',
      exactMatch: ['http://www.wikidata.org/entity/Q735'],
      note: { en: ['English note'], fr: ['French note'] },
      prefLabel: { en: 'Art' },
      proxies: [
        {
          id: 'http://data.europeana.eu/concept/190#proxy_europeana',
          type: 'Concept',
          prefLabel: { en: 'Art' },
          note: { en: ['English note'], fr: ['French note'] },
          exactMatch: ['http://www.wikidata.org/entity/Q735']
        },
        {
          id: 'http://www.wikidata.org/entity/Q735',
          type: 'Concept'
        }
      ]
    }
  },
  organization: {
    propsData: {
      id: 'http://data.europeana.eu/organization/1482250000001710507',
      description: 'English description'
    },
    profileInternalEntity: {
      id: 'http://data.europeana.eu/organization/1482250000001710507',
      type: 'Organization',
      sameAs: ['https://crm.zoho.com/crm/org51823723/tab/Accounts/1482250000001710507'],
      description: { en: 'English description', fr: 'French description' },
      proxies: [
        {
          id: 'http://data.europeana.eu/organization/1482250000001710507#proxy_europeana',
          type: 'Organization',
          sameAs: ['https://crm.zoho.com/crm/org51823723/tab/Accounts/1482250000001710507']
        },
        {
          id: 'https://crm.zoho.com/crm/org51823723/tab/Accounts/1482250000001710507',
          type: 'Organization',
          description: { en: 'English description', fr: 'French description' }
        }
      ]
    }
  }
};

const factory = ({ propsData = {}, data = {} }) => mount(EntityUpdateModal, {
  localVue,
  propsData: {
    modalStatic: true,
    ...propsData
  },
  data() {
    return { ...data };
  },
  mocks: {
    $apis: {
      entityManagement: {
        get: sinon.stub().resolves(fixtures.concept.profileInternalEntity),
        update: sinon.spy()
      }
    },
    $i18n: {
      locale: 'en'
    },
    $t: (key) => key
  }
});

describe('components/entity/EntityUpdateModal', () => {
  describe('template', () => {
    describe('form submission', () => {
      it('updates existing entity', async() => {
        const wrapper = factory({ propsData: fixtures.concept.propsData });
        await wrapper.find('#entity-description').setValue('Updated');
        sinon.spy(wrapper.vm, 'updateEntity');

        await wrapper.find('form').trigger('submit.stop.prevent');
        expect(wrapper.vm.updateEntity.called).toBe(true);
      });

      it('hides the modal', async() => {
        const wrapper = factory({ propsData: fixtures.concept.propsData });
        const bvModalHide = sinon.spy(wrapper.vm.$bvModal, 'hide');

        await wrapper.find('form').trigger('submit.stop.prevent');
        await wrapper.vm.$nextTick();

        expect(bvModalHide.calledWith('entityUpdateModal')).toBe(true);
      });

      it('makes toast', async() => {
        const wrapper = factory({ propsData: fixtures.concept.propsData });
        const rootBvToast = sinon.spy(wrapper.vm.$root.$bvToast, 'toast');

        await wrapper.find('form').trigger('submit.stop.prevent');
        await wrapper.vm.$nextTick();

        expect(rootBvToast.calledWith('collections.notifications.update', sinon.match.any)).toBe(true);
      });
    });

    describe('update button', () => {
      describe('when there is no description update', () => {
        it('is disabled', () => {
          const wrapper = factory({ propsData: fixtures.concept.propsData });

          wrapper.find('#entity-description').setValue(fixtures.concept.propsData.description);
          expect(wrapper.find('[data-qa="submit button"]').attributes('disabled')).toBe('disabled');
        });
      });
      describe('when description is filled with empty string', () => {
        it('is disabled', () => {
          const wrapper = factory({ propsData: { ...fixtures.concept.propsData, description: undefined } });

          wrapper.find('#entity-description').setValue('');

          expect(wrapper.find('[data-qa="submit button"]').attributes('disabled')).toBe('disabled');
        });
      });
    });
  });

  describe('computed', () => {
    describe('descriptionFieldName', () => {
      it('is "note" for concept entities', () => {
        const wrapper = factory({ propsData: fixtures.concept.propsData });

        const descriptionFieldName = wrapper.vm.descriptionFieldName;

        expect(descriptionFieldName).toBe('note');
      });

      it('is "description" for other entities', () => {
        const wrapper = factory({ propsData: fixtures.organization.propsData });

        const descriptionFieldName = wrapper.vm.descriptionFieldName;

        expect(descriptionFieldName).toBe('description');
      });
    });

    describe('europeanaProxy', () => {
      it('finds the proxy whose ID ends with "#proxy_europeana"', () => {
        const wrapper = factory({ propsData: fixtures.concept.propsData, data: { entity: fixtures.concept.profileInternalEntity } });

        const europeanaProxy = wrapper.vm.europeanaProxy;

        expect(europeanaProxy.id).toBe('http://data.europeana.eu/concept/190#proxy_europeana');
      });
    });

    describe('updatedBody', () => {
      it('preserves all pre-existing non-description data from Europeana proxy', () => {
        const wrapper = factory({
          propsData: fixtures.concept.propsData,
          data: { entity: fixtures.concept.profileInternalEntity, descriptionValue: 'Updated' }
        });

        const updatedBody = wrapper.vm.updatedBody;

        for (const fieldName of ['id', 'type', 'prefLabel']) {
          expect(updatedBody[fieldName]).toBeDefined();
          expect(updatedBody[fieldName]).toEqual(fixtures.concept.profileInternalEntity.proxies[0][fieldName]);
        }
      });

      describe('description field, updated for the current language', () => {
        it('is updated for arrays of values', () => {
          const wrapper = factory({
            propsData: fixtures.concept.propsData,
            data: { entity: fixtures.concept.profileInternalEntity, descriptionValue: 'Updated' }
          });

          const updatedBody = wrapper.vm.updatedBody;

          expect(updatedBody.note.en).toEqual(['Updated']);
        });

        it('is updated for for single string values', () => {
          const wrapper = factory({
            propsData: fixtures.organization.propsData,
            data: { entity: fixtures.organization.profileInternalEntity, descriptionValue: 'Updated' }
          });

          const updatedBody = wrapper.vm.updatedBody;

          expect(updatedBody.description.en).toEqual('Updated');
        });

        it('preserves other languages from the proxy', () => {
          const wrapper = factory({
            propsData: fixtures.concept.propsData,
            data: { entity: fixtures.concept.profileInternalEntity, descriptionValue: 'Updated' }
          });

          const updatedBody = wrapper.vm.updatedBody;

          expect(updatedBody.note.fr).toEqual(['French note']);
        });

        it('handles no pre-existing description field from the proxy', () => {
          const wrapper = factory({
            propsData: fixtures.organization.propsData,
            data: { entity: fixtures.organization.profileInternalEntity, descriptionValue: 'Updated' }
          });

          const updatedBody = wrapper.vm.updatedBody;

          expect(updatedBody.description.fr).toBeUndefined();
        });
      });
    });
  });

  describe('methods', () => {
    describe('updateEntity', () => {
      it('fetches the entity from the management API', async() => {
        const wrapper = factory({ propsData: fixtures.concept.propsData, data: { descriptionValue: 'Updated' } });

        await wrapper.vm.updateEntity();

        expect(wrapper.vm.$apis.entityManagement.get.calledWith(fixtures.concept.propsData.id)).toBe(true);
      });

      it('updates via the management API, preserving existing proxy data', async() => {
        const wrapper = factory({ propsData: fixtures.concept.propsData, data: { descriptionValue: 'Updated' } });

        await wrapper.vm.updateEntity();

        expect(wrapper.vm.$apis.entityManagement.update.calledWith(
          fixtures.concept.propsData.id, {
            id: 'http://data.europeana.eu/concept/190#proxy_europeana',
            type: 'Concept',
            exactMatch: ['http://www.wikidata.org/entity/Q735'],
            prefLabel: { en: 'Art' },
            note: { en: ['Updated'], fr: ['French note'] }
          }
        )).toBe(true);
      });
    });
  });
});
