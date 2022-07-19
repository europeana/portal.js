import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import VueI18n from 'vue-i18n';
import EntityUpdateModal from '@/components/entity/EntityUpdateModal';
import sinon from 'sinon';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(VueI18n);

import messages from '@/lang/en';

const i18n = new VueI18n({
  locale: 'en',
  messages: {
    en: messages
  }
});

const existingEntityPropsData = {
  id: 'http://data.europeana.eu/concept/190',
  description: 'Expressive work intended to be appreciated for its beauty or emotional power; or the process of creating such a work'
};

const entityManagementGetResponse = {
  id: 'http://data.europeana.eu/concept/190',
  type: 'Concept',
  exactMatch: ['http://www.wikidata.org/entity/Q735'],
  note: { en: 'Expressive work intended to be appreciated for its beauty or emotional power; or the process of creating such a work' },
  prefLabel: { en: 'Art' },
  proxies: [
    {
      id: 'http://data.europeana.eu/concept/190#proxy_europeana',
      type: 'Concept',
      prefLabel: { en: 'Art' },
      note: { en: 'Expressive work intended to be appreciated for its beauty or emotional power; or the process of creating such a work' }
    }
  ]
};

const factory = (propsData = {}) => mount(EntityUpdateModal, {
  localVue,
  propsData: {
    modalStatic: true,
    ...propsData
  },
  i18n,
  mocks: {
    $apis: {
      entityManagement: {
        get: sinon.stub().resolves(entityManagementGetResponse),
        update: sinon.spy()
      }
    }
  }
});

describe('components/entity/EntityUpdateModal', () => {
  describe('template', () => {
    describe('form submission', () => {
      it('updates existing entity', async() => {
        const wrapper = factory(existingEntityPropsData);
        await wrapper.find('#entity-description').setValue('Updated');
        sinon.spy(wrapper.vm, 'updateEntity');

        await wrapper.find('form').trigger('submit.stop.prevent');
        expect(wrapper.vm.updateEntity.called).toBe(true);
      });

      it('hides the modal', async() => {
        const wrapper = factory(existingEntityPropsData);
        const bvModalHide = sinon.spy(wrapper.vm.$bvModal, 'hide');

        await wrapper.find('form').trigger('submit.stop.prevent');
        await wrapper.vm.$nextTick();

        expect(bvModalHide.calledWith('entityUpdateModal')).toBe(true);
      });

      it('makes toast', async() => {
        const wrapper = factory(existingEntityPropsData);
        const rootBvToast = sinon.spy(wrapper.vm.$root.$bvToast, 'toast');

        await wrapper.find('form').trigger('submit.stop.prevent');
        await wrapper.vm.$nextTick();

        expect(rootBvToast.calledWith('The collection has been updated', sinon.match.any)).toBe(true);
      });
    });

    describe('update button', () => {
      describe('when there is no description update', () => {
        it('is disabled', () => {
          const wrapper = factory(existingEntityPropsData);

          wrapper.find('#entity-description').setValue(existingEntityPropsData.description);
          expect(wrapper.find('[data-qa="submit button"]').attributes('disabled')).toBe('disabled');
        });
      });
      describe('when description is filled with empty string', () => {
        it('is disabled', () => {
          const wrapper = factory({ ...existingEntityPropsData, description: undefined });

          wrapper.find('#entity-description').setValue('');

          expect(wrapper.find('[data-qa="submit button"]').attributes('disabled')).toBe('disabled');
        });
      });
    });
  });

  describe('methods', () => {
    describe('updateEntity', () => {
      it('fetches the entity from the management API', async() => {
        const wrapper = factory(existingEntityPropsData);
        await wrapper.setData({ descriptionValue: 'Updated' });

        await wrapper.vm.updateEntity();

        expect(wrapper.vm.$apis.entityManagement.get.calledWith(existingEntityPropsData.id)).toBe(true);
      });

      it('updates via the management API, preserving existing proxy data', async() => {
        const wrapper = factory(existingEntityPropsData);
        await wrapper.setData({ descriptionValue: 'Updated' });

        await wrapper.vm.updateEntity();

        expect(wrapper.vm.$apis.entityManagement.update.calledWith(
          existingEntityPropsData.id, {
            exactMatch: ['http://www.wikidata.org/entity/Q735'],
            id: 'http://data.europeana.eu/concept/190#proxy_europeana',
            type: 'Concept',
            prefLabel: { en: 'Art' },
            note: { en: ['Updated'] }
          }
        )).toBe(true);
      });

      it('handles no Europeana proxy in management API response', async() => {
        const wrapper = factory(existingEntityPropsData);
        wrapper.vm.$apis.entityManagement.get.resolves({
          ...entityManagementGetResponse,
          proxies: []
        });
        await wrapper.setData({ descriptionValue: 'Updated' });

        await wrapper.vm.updateEntity();

        expect(wrapper.vm.$apis.entityManagement.update.calledWith(
          existingEntityPropsData.id, {
            exactMatch: ['http://www.wikidata.org/entity/Q735'],
            id: 'http://data.europeana.eu/concept/190',
            type: 'Concept',
            note: { en: ['Updated'] }
          }
        )).toBe(true);
      });
    });
  });
});
