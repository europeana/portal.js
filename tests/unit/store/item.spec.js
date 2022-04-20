import store from '@/store/item';
import sinon from 'sinon';

const annotations = [
  {
    motivation: 'transcribing',
    body: {
      type: 'FullTextResource',
      value: 'This is the full transcription!',
      language: 'en'
    }
  },
  {
    motivation: 'tagging',
    body: {
      type: 'Concept',
      prefLabel: {
        en: 'tag',
        fr: 'tag FR'
      }
    }
  }
];

const featuredSetPins = {
  'entityIdWithPin': ['/123/abc', '456/def'],
  'entityIdWithoutPin': []
};
const featuredSetIds = {
  'entityIdOne': '123',
  'entityIdTwo': '124'
};

describe('store/item', () => {
  describe('getters', () => {
    describe('pinnedTo()', () => {
      describe('when there are featuredSetPins', () => {
        const state = {
          id: '/123/abc',
          featuredSetPins
        };
        describe('when asking for an entity that has the pin', () => {
          it('returns true', () => {
            expect(store.getters.pinnedTo(state)('entityIdWithPin')).toBe(true);
          });
        });

        describe('when asking for an entity that DOES not have the pin', () => {
          it('returns false', () => {
            expect(store.getters.pinnedTo(state)('entityIdWithoutPin')).toBe(false);
          });
        });
      });
    });

    describe('id()', () => {
      describe('when there is an item id', () => {
        const state = {
          id: '/123/abc'
        };
        it('returns the id', () => {
          expect(store.getters.id(state)).toBe('/123/abc');
        });
      });
      describe('when there is NO item id', () => {
        const state = {
          id: null
        };
        it('returns the id', () => {
          expect(store.getters.id(state)).toBeNull();
        });
      });
    });

    describe('annotationsByMotivation()', () => {
      describe('when there are annotations', () => {
        const state = {
          annotations
        };
        describe('when asking for tagging annotations', () => {
          it('has a tagging motivation', () => {
            const taggingAnnotations = store.getters.annotationsByMotivation(state)('tagging');
            expect(taggingAnnotations[0].motivation).toBe('tagging');
            expect(taggingAnnotations.length).toBe(1);
          });
        });
        describe('when asking for transcribing annotations', () => {
          it('has a transcribing motivation', () => {
            const taggingAnnotations = store.getters.annotationsByMotivation(state)('transcribing');
            expect(taggingAnnotations[0].motivation).toBe('transcribing');
            expect(taggingAnnotations.length).toBe(1);
          });
        });
      });
    });
  });

  describe('actions', () => {
    describe('reset', () => {
      it('resets all values', async() => {
        const commit = sinon.spy();

        await store.actions.reset({ commit });

        expect(commit.calledWith('setId', { value: null })).toBe(true);
        expect(commit.calledWith('setAnnotations', [])).toBe(true);
        expect(commit.calledWith('setRelatedEntities', [])).toBe(true);
        expect(commit.calledWith('setAllRelatedEntities', [])).toBe(true);
        expect(commit.calledWith('setFeaturedSetIds', {})).toBe(true);
        expect(commit.calledWith('setFeaturedSetPins', {})).toBe(true);
        expect(commit.calledWith('setSimilarItems', [])).toBe(true);
      });
    });
  });

  describe('mutations', () => {
    describe('setId()', () => {
      it('sets the id state', () => {
        const state = { id: null };
        store.mutations.setId(state, 'abc/123');
        expect(state.id).toEqual('abc/123');
      });
    });
    describe('setAnnotations()', () => {
      it('sets the annotations state', () => {
        const state = { annotations: [] };
        store.mutations.setAnnotations(state, annotations);
        expect(state.annotations).toEqual(annotations);
      });
    });
    describe('setRelatedEntities()', () => {
      it('sets the relatedEntities state', () => {
        const relatedEntities = ['related'];
        const state = { relatedEntities: [] };
        store.mutations.setRelatedEntities(state, relatedEntities);
        expect(state.relatedEntities).toEqual(relatedEntities);
      });
    });
    describe('setAllRelatedEntities()', () => {
      it('sets the allRelatedEntities state', () => {
        const allRelatedEntities = ['all related'];
        const state = { allRelatedEntities: [] };
        store.mutations.setAllRelatedEntities(state, allRelatedEntities);
        expect(state.allRelatedEntities).toEqual(allRelatedEntities);
      });
    });
    describe('setFeaturedSetIds()', () => {
      it('sets the featuredSetIds state', () => {
        const state = { featuredSetIds: {} };
        store.mutations.setFeaturedSetIds(state, featuredSetIds);
        expect(state.featuredSetIds).toEqual(featuredSetIds);
      });
    });
    describe('addToFeaturedSetIds()', () => {
      it('sets the featuredset state', async() => {
        const state = { featuredSetIds: {} };
        await store.mutations.addToFeaturedSetIds(state, { entityUri: 'entityIdThree', setId: '125' });
        expect(state.featuredSetIds['entityIdThree']).toEqual('125');
      });
    });
    describe('setFeaturedSetPins()', () => {
      it('sets the featuredSetPins state', () => {
        const state = { featuredSetPins: {} };
        store.mutations.setFeaturedSetPins(state, featuredSetPins);
        expect(state.featuredSetPins).toEqual(featuredSetPins);
      });
    });
    describe('addToFeaturedSetPins()', () => {
      it('sets the featuredset state', async() => {
        const state = { featuredSetPins: {} };
        await store.mutations.addToFeaturedSetPins(state, { entityUri: 'entityIdThree', pins: [] });
        expect(state.featuredSetPins['entityIdThree']).toEqual([]);
      });
    });
    describe('addPinToFeaturedSetPins()', () => {
      it('sets the featuredset state', async() => {
        const state = { featuredSetPins };
        await store.mutations.addPinToFeaturedSetPins(state, { entityUri: 'entityIdWithoutPin', pin: '/123/abc' });
        expect(state.featuredSetPins['entityIdWithoutPin'].includes('/123/abc')).toEqual(true);
      });
    });
    describe('setSimilarItems()', () => {
      it('sets the similarItems state', () => {
        const similarItems = ['similar'];
        const state = { similarItems: [] };
        store.mutations.setSimilarItems(state, similarItems);
        expect(state.similarItems).toEqual(similarItems);
      });
    });
  });
});
