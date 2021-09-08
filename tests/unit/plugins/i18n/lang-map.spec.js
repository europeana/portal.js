import LangMap from '@/plugins/i18n/lang-map.js';

describe('plugins/i18n/lang-map', () => {
  describe('LangMap', () => {
    describe('static methods', () => {
      describe('test()', () => {
        it('is false for non-object data', () => {
          const data = 'Home';

          LangMap.test(data).should.be.false;
        });

        it('is false for an object with non-language code keys', () => {
          const data = { about: 'http://example.org' };

          LangMap.test(data).should.be.false;
        });

        it('is true for an object with two-letter language code (ISO 639-1) keys', () => {
          const data = {
            en: 'Home',
            de: 'Startseite'
          };

          LangMap.test(data).should.be.true;
        });

        it('is true for an object with three-letter language code (ISO 639-2) keys', () => {
          const data = {
            eng: 'Home',
            deu: 'Startseite'
          };

          LangMap.test(data).should.be.true;
        });

        it('is true for an object with two-letter language code (ISO 639-1) keys with national variants', () => {
          const data = {
            'en-GB': 'Home',
            'de-DE': 'Startseite'
          };

          LangMap.test(data).should.be.true;
        });

        it('is true for an object with three-letter language code (ISO 639-2) keys with national variants', () => {
          const data = {
            'kok-IN': 'Konkani (India)',
            'syr-SY': 'Syriac (Syria)'
          };

          LangMap.test(data).should.be.true;
        });
      });
    });

    describe('instance methods', () => {
      describe('localise()', () => {
        it('reduces data to single locale', () => {
          const data = {
            en: 'Home',
            de: 'Startseite'
          };
          const locale = 'de';

          const langMap = new LangMap(data);
          const localised = langMap.localise(locale);

          localised.should.eql({ de: 'Startseite' });
        });
      });
    });
  });
});
