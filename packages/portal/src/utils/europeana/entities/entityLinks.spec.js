import * as utils from './entityLinks.js';

describe('@/utils/europeana/entities/entityLinks', () => {
  describe('collectionTitle', () => {
    it('uses native language for organisations', () => {
      const title = utils.collectionTitle({ id: 'http://data.europeana.eu/organization/123', prefLabel: { en: 'Museum', fr: 'Musée' } });

      expect(title).toEqual({ fr: 'Musée' });
    });

    it('uses full prefLabel for other entity types if available', () => {
      const title = utils.collectionTitle({ type: 'Concept', prefLabel: { en: 'Cartoon', es: 'Dibujo humorístico' } });

      expect(title).toEqual({ en: 'Cartoon', es: 'Dibujo humorístico' });
    });

    it('falls back to name', () => {
      const title = utils.collectionTitle({ name: 'Curated related entity' });

      expect(title).toBe('Curated related entity');
    });
  });
});
