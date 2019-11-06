import { createLocalVue, shallowMount } from '@vue/test-utils';
import EntityCards from '../../../../components/entity/EntityCards.vue';

const localVue = createLocalVue();

const factory = () => shallowMount(EntityCards, {
  localVue,
  mocks: {
    $t: () => {}
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
  }
];

describe('components/generic/EntityCards', () => {
  it('renders a content card for an entity', () => {
    const wrapper = factory();
    wrapper.setProps({ entities });
    const paintingCard = wrapper.find('[data-qa="Painting entity card"]');

    paintingCard.should.exist;
    paintingCard.props().isRelated.should.be.true;
    paintingCard.props().title.should.eq('Painting');
    paintingCard.props().imageUrl.should.eq('https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa,_by_Leonardo_da_Vinci,_from_C2RMF_retouched.jpg/255px-Mona_Lisa,_by_Leonardo_da_Vinci,_from_C2RMF_retouched.jpg');
    paintingCard.props().texts.should.deep.eq(['Painting is the practice of applying paint, pigment, color or other medium to a surface (support base).']);
    paintingCard.props().url.should.deep.eq({
      name: 'entity-type-all',
      params: { type: 'topic', pathMatch: '47-painting' }
    });
  });
});
