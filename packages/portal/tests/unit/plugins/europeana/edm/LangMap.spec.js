import LangMap from '@/plugins/europeana/edm/LangMap';

describe('plugins/europeana/edm/LangMap', () => {
  describe('LangMap', () => {
    describe('static', () => {
      describe('.isLangMap()', () => {
        it('is `false` for a string', () => {
          const data = 'string';

          const isLangMap = LangMap.isLangMap(data);

          expect(isLangMap).toBe(false);
        });

        it('is `false` for an array', () => {
          const data = ['string'];

          const isLangMap = LangMap.isLangMap(data);

          expect(isLangMap).toBe(false);
        });

        it('is `false` for a date', () => {
          const data = new Date();

          const isLangMap = LangMap.isLangMap(data);

          expect(isLangMap).toBe(false);
        });

        it('is `false` for an object without language-like keys', () => {
          const data = {
            a: 'foo',
            b: 'bar'
          };

          const isLangMap = LangMap.isLangMap(data);

          expect(isLangMap).toBe(false);
        });

        it('is `true` for an object with language-like keys', () => {
          const data = {
            def: 'def',
            en: 'en',
            'fr-FR': 'fr-FR'
          };

          const isLangMap = LangMap.isLangMap(data);

          expect(isLangMap).toBe(true);
        });
      });
    });

    describe('instance', () => {
      describe('.localise()', () => {
        it('uses the pref lang if available', () => {
          const data = {
            en: 'English',
            fr: 'French'
          };

          const localised = new LangMap(data).localise('fr');

          expect(localised).toEqual({ fr: 'French' });
        });

        it('first falls back to English if pref lang not available', () => {
          const data = {
            en: 'English',
            fr: 'French'
          };

          const localised = new LangMap(data).localise('nl');

          expect(localised).toEqual({ en: 'English' });
        });

        it('second falls back to unknown if pref lang and English not available', () => {
          const data = {
            def: 'Unknown',
            fr: 'French'
          };

          const localised = new LangMap(data).localise('nl');

          expect(localised).toEqual({ def: 'Unknown' });
        });

        test.todo('picks an arbitrary lang if no other lang to prefer');

        describe('when htmlify option is `true`', () => {
          const options = { htmlify: true };

          it('returns object with lang and value properties', () => {
            const data = {
              en: 'English',
              fr: 'French'
            };

            const localised = new LangMap(data).localise('nl', options);

            expect(localised).toEqual({ lang: 'en', value: 'English' });
          });

          it('returns lang as `null` if for pref lang', () => {
            const data = {
              en: 'English',
              fr: 'French'
            };

            const localised = new LangMap(data).localise('fr', options);

            expect(localised).toEqual({ lang: null, value: 'French' });
          });
        });
      });
    });
  });
});
