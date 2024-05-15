import { createLocalVue, shallowMount } from '@vue/test-utils';
import { thumbnail as EuropeanaThumbnailApi } from '@europeana/apis';

import mixin from '@/mixins/europeana/entities/entityImageUrl.js';

const component = {
  template: '<div></div>',
  mixins: [mixin]
};

const localVue = createLocalVue();

const factory = () => {
  return shallowMount(component, {
    localVue,
    mocks: {
      $apis: {
        thumbnail: new EuropeanaThumbnailApi
      }
    }
  });
};

describe('@/mixins/europeana/entities/entityImageUrl.js', () => {
  describe('methods', () => {
    describe('entityImageUrl', () => {
      const europeanaThumbnailUrl = 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?uri=https%3A%2F%2Fwww.example.org%2Fimage.jpeg&type=IMAGE';
      const wikimediaImageUrl = 'http://commons.wikimedia.org/wiki/Special:FilePath/Europeana_logo_2015_basic.svg';

      describe('when entity has Europeana thumbnail in `image`', () => {
        const entity = {
          image: europeanaThumbnailUrl
        };

        it('uses it at 200px size', () => {
          const entityImageUrl = factory().vm.entityImageUrl(entity);

          expect(entityImageUrl).toBe('https://api.europeana.eu/thumbnail/v3/200/6c0a0d323f07cbfd98f575e88c782474');
        });
      });

      describe('when entity has Europeana thumbnail in `isShownBy.thumbnail`', () => {
        const entity = {
          isShownBy: {
            thumbnail: europeanaThumbnailUrl
          }
        };

        it('uses it at 200px size', () => {
          const entityImageUrl = factory().vm.entityImageUrl(entity);

          expect(entityImageUrl).toBe('https://api.europeana.eu/thumbnail/v3/200/6c0a0d323f07cbfd98f575e88c782474');
        });
      });

      describe('when entity has Wikimedia image in `logo.id`', () => {
        const entity = {
          logo: {
            id: wikimediaImageUrl
          }
        };

        it('uses it at 28px size', () => {
          const entityImageUrl = factory().vm.entityImageUrl(entity);

          expect(entityImageUrl).toBe('https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Europeana_logo_2015_basic.svg/28px-Europeana_logo_2015_basic.svg.png');
        });
      });

      describe('otherwise', () => {
        const entity = {};

        it('is `null`', () => {
          const entityImageUrl = factory().vm.entityImageUrl(entity);

          expect(entityImageUrl).toBe(null);
        });
      });
    });
  });
});
