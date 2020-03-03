import { createLocalVue, shallowMount } from '@vue/test-utils';
import EntityCards from '../../../../components/entity/EntityCards.vue';

const localVue = createLocalVue();

const factory = () => shallowMount(EntityCards, {
  localVue,
  mocks: {
    $t: () => {},
    $i18n: () => {}
  }
});

const entities = [
  {
    id: 'http://data.europeana.eu/concept/base/47',
    type: 'Concept',
    depiction: {
      id: 'http://en.wikipedia.org/wiki/Special:FilePath/Mona_Lisa,_by_Leonardo_da_Vinci,_from_C2RMF_retouched.jpg',
      source: 'http://en.wikipedia.org/wiki/File:Mona_Lisa,_by_Leonardo_da_Vinci,_from_C2RMF_retouched.jpg'
    },
    prefLabel: {
      en: 'Painting'
    },
    note: {
      en: ['Painting is the practice of applying paint, pigment, color or other medium to a surface (support base).']
    }
  },
  {
    id: 'http://data.europeana.eu/agent/base/42',
    type: 'Agent',
    prefLabel: {
      en: 'Philip Augar'
    },
    biographicalInformation: [
      {
        '@language': 'en',
        '@value': 'Philip Augar is a British author, and was an equities broker in the City of London, for twenty years from the 1970s, first with NatWest and J. Henry Schroder, and was part of the team that negotiated the sale of Schroders investment bank to Citigroup.'
      }
    ]
  }
];

describe('components/entity/EntityCards', () => {
  it('renders a content card for concept and agent entities', () => {
    const wrapper = factory();
    wrapper.setProps({ entities });
    const paintingCard = wrapper.find('[data-qa="Painting entity card"]');
    const augarCard = wrapper.find('[data-qa="Philip Augar entity card"]');

    paintingCard.should.exist;
    paintingCard.props().variant.should.eq('entity');
    paintingCard.props().title.should.eql({ 'en': 'Painting' });
    paintingCard.props().imageUrl.should.eq('https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa,_by_Leonardo_da_Vinci,_from_C2RMF_retouched.jpg/255px-Mona_Lisa,_by_Leonardo_da_Vinci,_from_C2RMF_retouched.jpg');
    paintingCard.props().url.should.deep.eq({
      name: 'collections-type-all',
      params: { type: 'topic', pathMatch: '47-painting' }
    });

    augarCard.should.exist;
    augarCard.props().variant.should.eq('entity');
    augarCard.props().title.should.eql({ 'en': 'Philip Augar' });
    augarCard.props().url.should.deep.eq({
      name: 'collections-type-all',
      params: { type: 'person', pathMatch: '42-philip-augar' }
    });
  });
});
