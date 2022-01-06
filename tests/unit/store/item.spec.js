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
describe('store/item', () => {
  describe('getters', () => {
    describe('annotationsByMotivation()', () => {
      describe('when there are annotations', () => {
        const state = {
          annotations
        };
        describe('when asking for tagging annotations', () => {
          const taggingAnnotations = store.getters.annotationsByMotivation(state)('tagging');
          expect(taggingAnnotations[0].motivation).toBe('tagging');
          expect(taggingAnnotations.length).toBe(1);
        });
        describe('when asking for transcribing annotations', () => {
          const taggingAnnotations = store.getters.annotationsByMotivation(state)('transcribing');
          expect(taggingAnnotations[0].motivation).toBe('transcribing');
          expect(taggingAnnotations.length).toBe(1);
        });
      });
    });
  });

  describe('actions', () => {
    describe('reset', () => {
      it('resets all values', async() => {
        const commit = sinon.spy();

        await store.actions.reset({ commit });

        expect(commit.calledWith('setAnnotations', [])).toBe(true);
        expect(commit.calledWith('setRelatedEntities', [])).toBe(true);
        expect(commit.calledWith('setSimilarItems', [])).toBe(true);
      });
    });
  });

  describe('mutations', () => {
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
