import store from '@/store/search';

describe('store/search', () => {
  describe('mutations', () => {
    describe('disableCollectionFacet', () => {
      it('sets the collectionFacetEnabled state to false', () => {
        const state = { collectionFacetEnabled: true };
        store.mutations.disableCollectionFacet(state);
        expect(state.collectionFacetEnabled).toEqual(false);
      });
    });
    describe('enableCollectionFacet', () => {
      it('sets the collectionFacetEnabled state to true', () => {
        const state = { collectionFacetEnabled: false };
        store.mutations.enableCollectionFacet(state);
        expect(state.collectionFacetEnabled).toEqual(true);
      });
    });
    describe('setActive', () => {
      it('sets the active state', () => {
        const state = { active: false };
        store.mutations.setActive(state, true);
        expect(state.active).toEqual(true);
      });
    });
    describe('setShowSearchBar', () => {
      it('sets the showSearchBar state', () => {
        const state = { showSearchBar: false };
        store.mutations.setShowSearchBar(state, true);
        expect(state.showSearchBar).toEqual(true);
      });
    });
    describe('setTotalResults', () => {
      it('sets the totalResults state', () => {
        const state = { totalResults: 0 };
        store.mutations.setTotalResults(state, 100);
        expect(state.totalResults).toEqual(100);
      });
    });
    describe('setView', () => {
      it('sets the view state', () => {
        const state = { view: 'grid' };
        store.mutations.setView(state, 'list');
        expect(state.view).toEqual('list');
      });
    });
    describe('setCollectionLabel', () => {
      it('sets the collectionLabel state', () => {
        const state = { collectionLabel: null };
        store.mutations.setCollectionLabel(state, 'Art');
        expect(state.collectionLabel).toEqual('Art');
      });
    });
    describe('setShowSearchSidebar', () => {
      it('sets the showSearchSidebar state', () => {
        const state = { showSearchSidebar: false };
        store.mutations.setShowSearchSidebar(state, true);
        expect(state.showSearchSidebar).toEqual(true);
      });
    });
    describe('setshowSidebarToggle', () => {
      it('sets the showSidebarToggle state', () => {
        const state = { showSidebarToggle: false };
        store.mutations.setShowSidebarToggle(state, true);
        expect(state.showSidebarToggle).toEqual(true);
      });
    });
    describe('addQasWithSelectedEntityValue', () => {
      it('adds the value to the qasWithSelectedEntityValue state', () => {
        const state = { qasWithSelectedEntityValue: [] };
        store.mutations.addQasWithSelectedEntityValue(state, 'qa');
        expect(state.qasWithSelectedEntityValue).toEqual(['qa']);
      });
    });
    describe('setQasWithSelectedEntityValue', () => {
      it('sets the qasWithSelectedEntityValue state', () => {
        const state = { qasWithSelectedEntityValue: ['qa0', 'qa1'] };
        store.mutations.setQasWithSelectedEntityValue(state, ['qa3']);
        expect(state.qasWithSelectedEntityValue).toEqual(['qa3']);
      });
    });
    describe('setQueryInputValue', () => {
      it('sets the queryInputValue state', () => {
        const state = { queryInputValue: 'cat' };
        store.mutations.setQueryInputValue(state, 'dog');
        expect(state.queryInputValue).toEqual('dog');
      });
    });
  });

  describe('getters', () => {
    describe('activeView', () => {
      it('returns view from state if set', () => {
        const state = { view: 'list' };

        const activeView = store.getters.activeView(state);

        expect(activeView).toBe(state.view);
      });

      it('defaults to grid view', () => {
        const state = {};

        const activeView = store.getters.activeView(state);

        expect(activeView).toBe('grid');
      });
    });
  });
});
