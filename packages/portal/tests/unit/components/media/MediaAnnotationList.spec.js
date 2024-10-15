import { createLocalVue } from '@vue/test-utils';
import sinon from 'sinon';

import { shallowMountNuxt } from '../../utils';
import MediaAnnotationList from '@/components/media/MediaAnnotationList.vue';
import * as itemMediaPresentation from '@/composables/itemMediaPresentation.js';

const localVue = createLocalVue();

const annotations = [
  { body: { value: 'anno 1' }, id: 'anno1' },
  { body: { value: 'anno 2' }, id: 'anno2' }
];
const fetchAnnotationsStub = sinon.stub();
const uri = 'https://iiif.europeana.eu/annos/1';

const factory = ({ data, propsData } = {}) => shallowMountNuxt(MediaAnnotationList, {
  data() {
    return {
      ...data
    };
  },
  propsData,
  mocks: {
    $fetchState: {}
  },
  localVue,
  stubs: ['b-list-group', 'b-list-group-item']
});

describe('components/media/MediaAnnotationList', () => {
  beforeAll(() => {
    sinon.stub(itemMediaPresentation, 'default').returns({
      annotations,
      fetchAnnotations: fetchAnnotationsStub
    });
  });
  afterEach(sinon.resetHistory);
  afterAll(sinon.restore);

  describe('template', () => {
    it('renders annotations', () => {
      const wrapper = factory({ propsData: { uri } });

      const listItems = wrapper.findAll('b-list-group-item-stub');

      expect(listItems.at(0).text()).toBe('anno 1');
      expect(listItems.at(1).text()).toBe('anno 2');
    });

    it('marks active annotation', () => {
      const activeAnnotation = 'anno2';
      const wrapper = factory({ data: { activeAnnotation }, propsData: { uri } });

      const listItems = wrapper.findAll('b-list-group-item-stub');

      expect(listItems.at(1).attributes('active')).toBe('true');
    });

    it('emits selectAnno event when annotation is clicked', async() => {
      const wrapper = factory({ propsData: { uri } });

      const listItem = wrapper.find('b-list-group-item-stub');
      await listItem.vm.$emit('click');

      expect(wrapper.emitted().selectAnno[0]).toEqual([annotations[0]]);
    });
  });

  describe('fetch', () => {
    it('fetches annotation list via itemMediaPresentation composable', async() => {
      const wrapper = factory({ propsData: { uri } });

      await wrapper.vm.fetch();

      expect(fetchAnnotationsStub.calledWith(uri)).toBe(true);
    });
  });
});
