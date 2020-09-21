import middleware from '../../../middleware/apis';
import apiConfig from '../../../plugins/europeana';

describe('middleware/apis', () => {
  it('sets API URLs in plugin from store state', () => {
    const store = {
      state: {
        apis: {
          urls: {
            record: 'https://record.example.org',
            newspaper: 'https://newspaper.example.org'
          }
        }
      }
    };

    middleware({ store });

    apiConfig.record.url.should.eq('https://record.example.org');
    apiConfig.newspaper.url.should.eq('https://newspaper.example.org');
  });
});
