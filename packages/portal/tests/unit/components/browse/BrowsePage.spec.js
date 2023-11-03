import { createLocalVue, shallowMount } from '@vue/test-utils';

import BrowsePage from '@/components/browse/BrowsePage.vue';

const localVue = createLocalVue();

const factory = (propsData) => shallowMount(BrowsePage, {
  localVue,
  propsData,
  stubs: ['b-container']
});

describe('components/browse/BrowsePage', () => {
  describe('computed', () => {
    describe('layoutClass', () => {
      describe('when there are no card groups with more than 4 cards', () => {
        const hasPartCollection = {
          items: [
            {
              '__typename': 'AutomatedCardGroup',
              genre: 'Featured themes',
              moreButton: {
                url: '/themes',
                text: 'Show more themes'
              }
            },
            {
              '__typename': 'CardGroup',
              headline: 'Features',
              text: null,
              moreButton: {
                url: '/features',
                text: 'Show more features'
              },
              hasPartCollection: {
                items: [
                  {
                    '__typename': 'CuratedCard',
                    name: 'Colouring books'
                  },
                  {
                    '__typename': 'CuratedCard',
                    name: 'Black history'
                  },
                  {
                    '__typename': 'CuratedCard',
                    name: 'Middle Ages'
                  },
                  {
                    '__typename': 'CuratedCard',
                    name: 'Making Culture'
                  }
                ]
              }
            }
          ]
        };
        it('is "browse-page-4-col"', () => {
          const wrapper = factory({ name: 'Collections page', hasPartCollection });

          const layoutClass = wrapper.vm.layoutClass;
          expect(layoutClass).toBe('browse-page-4-col');
        });
      });
      describe('when there are card groups with more than 4 cards', () => {
        const hasPartCollection = {
          items: [
            {
              '__typename': 'CardGroup',
              headline: 'Features',
              text: null,
              moreButton: {
                url: '/features',
                text: 'Show more features'
              },
              hasPartCollection: {
                items: [
                  {
                    '__typename': 'CuratedCard',
                    name: 'Colouring books'
                  },
                  {
                    '__typename': 'CuratedCard',
                    name: 'Black history'
                  },
                  {
                    '__typename': 'CuratedCard',
                    name: 'Middle Ages'
                  },
                  {
                    '__typename': 'CuratedCard',
                    name: 'Making Culture'
                  }
                ]
              }
            },
            {
              '__typename': 'CardGroup',
              headline: null,
              text: null,
              moreButton: null,
              hasPartCollection: {
                items: [
                  {
                    '__typename': 'CuratedCard',
                    name: 'Science'
                  },
                  {
                    '__typename': 'CuratedCard',
                    name: 'Seasonal celebrations'
                  },
                  {
                    '__typename': 'CuratedCard',
                    name: 'Sport'
                  },
                  {
                    '__typename': 'CuratedCard',
                    name: 'Transport'
                  },
                  {
                    '__typename': 'CuratedCard',
                    name: 'Women\'s history'
                  },
                  {
                    '__typename': 'CuratedCard',
                    name: 'Wellness'
                  },
                  {
                    '__typename': 'CuratedCard',
                    name: 'Working Lives'
                  }
                ]
              }
            }
          ]
        };
        it('is undefined', () => {
          const wrapper = factory({ name: 'Features page', hasPartCollection });

          const layoutClass = wrapper.vm.layoutClass;
          expect(layoutClass).toBe(null);
        });
      });
    });
  });
});
