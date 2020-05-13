import { storiesOf } from '@storybook/vue';
import Vuex from 'vuex';
import VueI18n from 'vue-i18n';
import SocialShare from './SocialShare.vue';

const i18n = new VueI18n();

const store = new Vuex.Store({
  getters: {
    'http/canonicalUrl': () => {}
  }
});

storiesOf('Generic', module)
  .add('Social share', () => ({
    components: { SocialShare },
    i18n,
    store,
    data() {
      return {
        section: {
          fields: {
            headline: 'Art',
            text: 'Discover inspiring art, artists and stories in 2,165,362 artworks from European museums, galleries, libraries and archives',
            hasPart: [{
              sys: {
                id: '123456'
              },
              fields: {
                name: 'Jonas Martinaitis. Piemenų landynė. 1942 | Jonas Martinaitis',
                image: {
                  fields: {
                    file: {
                      url: 'img/landscape.jpg'
                    }
                  }
                },
                url: 'http://europeana.eu'
              }
            },
            {
              sys: {
                id: '6789'
              },
              fields: {
                name: 'Kanutas Ruseckas. Mitologinė pastoralinė scena. XIX a. | Kanutas Ruseckas',
                image: {
                  fields: {
                    file: {
                      url: 'img/landscape.jpg'
                    }
                  }
                },
                url: 'http://europeana.eu'
              }
            },
            {
              sys: {
                id: '98765'
              },
              fields: {
                name: 'Jonas Mackevičius. Anykščių bažnyčia. XX a. I p. | Jonas Mackevičius',
                image: {
                  fields: {
                    file: {
                      url: 'img/landscape.jpg'
                    }
                  }
                },
                url: 'http://europeana.eu'
              }
            },
            {
              sys: {
                id: '43210'
              },
              fields: {
                name: 'Juozapas Kamarauskas. Vilniaus muitinės pastatas. 1920 | Juozapas Kamarauskas',
                image: {
                  fields: {
                    file: {
                      url: 'img/landscape.jpg'
                    }
                  }
                },
                url: 'http://europeana.eu'
              }
            }]
          }
        }
      };
    },
    template: `
      <b-container class="mt-3">
        <SocialShare media-url="/" />
      </b-container>
    `
  }));
