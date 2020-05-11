import { storiesOf } from '@storybook/vue';
import VueI18n from 'vue-i18n';

import ContentCard from './ContentCard.vue';
import ContentCardSection from '../browse/ContentCardSection.vue';

storiesOf('Generic', module)
  .add('Content card', () => ({
    i18n: new VueI18n(),
    components: { ContentCard },
    template: `<b-col cols="3" class="mt-3">
    	<ContentCard 
        title="This is a Storybook Card"
        contentSource="card"
        imageUrl="img/landscape.jpg" 
      />
    </b-col>`
  }))
  .add('Section with content cards', () => ({
    components: { ContentCardSection },
    i18n: new VueI18n(),
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
    template: `<b-container class="mt-3">
      <ContentCardSection 
        :section="section"
      />
    </b-container>`
  }));
