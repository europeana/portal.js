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
      context('when there are annotations', () => {
        const state = {
          annotations
        };
        context('when asking for tagging annotations', () => {
          const taggingAnnotations = store.getters.annotationsByMotivation(state)('tagging');
          taggingAnnotations[0].motivation.should.eq('tagging');
          taggingAnnotations.length.should.eq(1);
        });
        context('when asking for transcribing annotations', () => {
          const taggingAnnotations = store.getters.annotationsByMotivation(state)('transcribing');
          taggingAnnotations[0].motivation.should.eq('transcribing');
          taggingAnnotations.length.should.eq(1);
        });
      });
    });
  });

  describe('actions', () => {
    describe('reset', async() => {
      it('resets all values', async() => {
        const commit = sinon.spy();

        await store.actions.reset({ commit });

        commit.should.have.been.calledWith('setAnnotations', []);
        commit.should.have.been.calledWith('setRelatedEntities', []);
        commit.should.have.been.calledWith('setSimilarItems', []);
      });
    });
  });

  describe('mutations', () => {
    describe('setAnnotations()', () => {
      it('sets the annotations state', () => {
        const state = { annotations: [] };
        store.mutations.setAnnotations(state, annotations);
        state.annotations.should.eql(annotations);
      });
    });
    describe('setRelatedEntities()', () => {
      it('sets the relatedEntities state', () => {
        const relatedEntities = ['related'];
        const state = { relatedEntities: [] };
        store.mutations.setRelatedEntities(state, relatedEntities);
        state.relatedEntities.should.eql(relatedEntities);
      });
    });
    describe('setSimilarItems()', () => {
      it('sets the similarItems state', () => {
        const similarItems = ['similar'];
        const state = { similarItems: [] };
        store.mutations.setSimilarItems(state, similarItems);
        state.similarItems.should.eql(similarItems);
      });
    });
  });
});
