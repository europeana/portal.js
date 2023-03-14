import { createLocalVue, shallowMount } from '@vue/test-utils';
import sinon from 'sinon';
import mixin from '@/mixins/europeana/entities/entityBestItemsSet';

const component = {
  template: '<div></div>',
  mixins: [mixin]
};

const localVue = createLocalVue();

const fixtures = {
  entityId: 'http://data.europeana.eu/concept/120120',
  englishPrefLabel: 'English',
  germanPrefLabel: 'Deutsch',
  setId: 'http://data.europeana.eu/set/120120',
  setType: 'EntityBestItemsSet'
};
fixtures.entityPrefLabelScalars = {
  de: fixtures.germanPrefLabel,
  en: fixtures.englishPrefLabel
};
fixtures.entityPrefLabelArrays = {
  de: [fixtures.germanPrefLabel],
  en: [fixtures.englishPrefLabel]
};
fixtures.setTitle = {
  de: 'set.entityBestBets.title Deutsch',
  en: 'set.entityBestBets.title English'
};

const factory = () => {
  return shallowMount(component, {
    localVue,
    mocks: {
      $apis: {
        set: {
          create: sinon.stub().resolves({ id: fixtures.setId })
        }
      },
      $t: (key, interpolations) => `${key} ${interpolations.entity}`
    }
  });
};

describe('mixins/europeana/entities/entityBestItemsSet', () => {
  describe('methods', () => {
    describe('ensureEntityBestItemsSetExists', () => {
      it('creates an EntityBestItemsSet via the Set API, from entity id and scalar prefLabels', async() => {
        const wrapper = factory();

        await wrapper.vm.ensureEntityBestItemsSetExists(null, {
          id: fixtures.entityId,
          prefLabel: fixtures.entityPrefLabelScalars
        });

        expect(wrapper.vm.$apis.set.create.calledWith({
          type: fixtures.setType,
          title: fixtures.setTitle,
          subject: [fixtures.entityId]
        })).toBe(true);
      });

      it('creates an EntityBestItemsSet via the Set API, from entity about and array prefLabels', async() => {
        const wrapper = factory();

        await wrapper.vm.ensureEntityBestItemsSetExists(null, {
          about: fixtures.entityId,
          prefLabel: fixtures.entityPrefLabelArrays
        });

        expect(wrapper.vm.$apis.set.create.calledWith({
          type: fixtures.setType,
          title: fixtures.setTitle,
          subject: [fixtures.entityId]
        })).toBe(true);
      });

      it('returns the created set ID', async() => {
        const wrapper = factory();

        const setId = await wrapper.vm.ensureEntityBestItemsSetExists(null, {
          id: fixtures.entityId,
          prefLabel: fixtures.entityPrefLabelScalars
        });

        expect(setId).toBe(fixtures.setId);
      });
    });
  });
});
