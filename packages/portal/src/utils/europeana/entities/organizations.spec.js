import * as utils from './organizations.js';

describe('@/utils/europeana/entities/organizations', () => {
  describe('isNamedOrganizationEntity', () => {
    it('is `false` if arg is empty', () => {
      const arg = null;
      const expected = false;

      const actual = utils.isNamedOrganizationEntity(arg);

      expect(actual).toBe(expected);
    });

    it('is `false` if arg type is not "Organization"', () => {
      const arg = { type: 'Concept', prefLabel: { en: 'Cartoon' } };
      const expected = false;

      const actual = utils.isNamedOrganizationEntity(arg);

      expect(actual).toBe(expected);
    });

    it('is `false` if arg has no prefLabel', () => {
      const arg = { type: 'Organization' };
      const expected = false;

      const actual = utils.isNamedOrganizationEntity(arg);

      expect(actual).toBe(expected);
    });

    it('is `true` if arg has type "Organization" and prefLabel', () => {
      const arg = { type: 'Organization', prefLabel: { en: 'Museum' } };
      const expected = true;

      const actual = utils.isNamedOrganizationEntity(arg);

      expect(actual).toBe(expected);
    });
  });

  describe('organizationEntityNativeName', () => {
    it('is `null` if arg is not a named organization entity', () => {
      const arg = { type: 'Concept', prefLabel: { en: 'Cartoon' } };
      const expected = null;

      const actual = utils.organizationEntityNativeName(arg);

      expect(actual).toBe(expected);
    });

    it('favours the first non-English prefLabel, if any', () => {
      const arg = { type: 'Organization', prefLabel: { en: 'Museum', fr: 'Musée' } };
      const expected = { fr: 'Musée' };

      const actual = utils.organizationEntityNativeName(arg);

      expect(actual).toEqual(expected);
    });

    it('falls back to the English prefLabel if no others', () => {
      const arg = { type: 'Organization', prefLabel: { en: 'Museum' } };
      const expected = { en: 'Museum' };

      const actual = utils.organizationEntityNativeName(arg);

      expect(actual).toEqual(expected);
    });
  });

  describe('organizationEntityNonNativeEnglishName', () => {
    it('is `null` if arg is not a named organization entity', () => {
      const arg = { type: 'Concept', prefLabel: { en: 'Cartoon' } };
      const expected = null;

      const actual = utils.organizationEntityNonNativeEnglishName(arg);

      expect(actual).toBe(expected);
    });

    it('is the English prefLabel if others are also present', () => {
      const arg = { type: 'Organization', prefLabel: { en: 'Museum', fr: 'Musée' } };
      const expected = { en: 'Museum' };

      const actual = utils.organizationEntityNonNativeEnglishName(arg);

      expect(actual).toEqual(expected);
    });

    it('is `null` if only the English prefLabel is present', () => {
      const arg = { type: 'Organization', prefLabel: { en: 'Museum' } };
      const expected = null;

      const actual = utils.organizationEntityNonNativeEnglishName(arg);

      expect(actual).toBe(expected);
    });
  });
});
