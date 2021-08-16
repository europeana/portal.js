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
  // before('mock $i18n', () => {
  //   store.actions.$i18n = { locale: 'es' };
  // });

  describe('getters', () => {
    describe('annotationsByMotivation()', () => {
      context('when there are annotations', () => {
        const state = {
          active: true,
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
    describe('activate', () => {
      it('sets the active state to true', async() => {
        const commit = sinon.spy();

        await store.actions.activate({ commit });

        commit.should.have.been.calledWith('setActive', true);
      });
    });

    describe('deactivate', async() => {
      it('sets the active state to false and resets all values', async() => {
        const commit = sinon.spy();
        const dispatch = sinon.spy();

        await store.actions.deactivate({ commit, dispatch });

        commit.should.have.been.calledWith('setActive', false);
        dispatch.should.have.been.calledWith('reset');
      });
    });

    describe('reset', async() => {
      it('esets all values', async() => {
        const commit = sinon.spy();

        await store.actions.reset({ commit });

        commit.should.have.been.calledWith('set', ['annotations', []]);
        commit.should.have.been.calledWith('set', ['relatedEntities', []]);
        commit.should.have.been.calledWith('set', ['similarItems', []]);
      });
    });
  });

  describe('mutations', () => {
    describe('setActive()', () => {
      it('sets the active state', () => {
        const state = { active: false };
        store.mutations.setActive(state, true);
        state.active.should.eql(true);
      });
    });
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
