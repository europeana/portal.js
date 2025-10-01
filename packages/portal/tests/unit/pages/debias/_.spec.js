import { createLocalVue } from '@vue/test-utils';
import { shallowMountNuxt } from '../../utils';

import page from '@/pages/debias/_';
import sinon from 'sinon';

const localVue = createLocalVue();

const annotationApiSearchStub = sinon.stub().resolves({});

// const idNum = 44;
const locale = 'en';
const prefLabel = 'Tribe';
const id = 'https://rnd-2.eanadev.org/share/debias/vocabulary/c_44_en.xml';
const pathMatch = '44-tribe';

const $t = (key) => key;
const $i18n = {
  locale,
  t: $t
};
const $error = sinon.spy();

const factory = ({ data, mocks } = {}) => shallowMountNuxt(page, {
  localVue,
  data() {
    return { ...data };
  },
  mocks: {
    $apis: {
      annotation: {
        search: annotationApiSearchStub
      }
    },
    $error,
    $fetchState: {},
    $i18n,
    $route: {
      params: {
        pathMatch
      }
    },
    $t,
    ...mocks
  },
  stubs: [
    'ErrorMessage',
    'LoadingSpinner',
    'AuthoredHead',
    'b-col',
    'b-row',
    'b-container',
    'i18n'
  ]
});

describe('DeBiasPage', () => {
  afterEach(sinon.resetHistory);
  afterAll(sinon.reset);

  describe('fetch', () => {
    it('searches for the term on the Annotation API', async() => {
      const wrapper = factory();

      await wrapper.vm.fetch();

      expect(annotationApiSearchStub.calledWith({
        query: `body_uri:"${id}"`,
        pageSize: 1,
        profile: 'dereference'
      })).toBe(true);
    });

    describe('when no term is found', () => {
      it('displays a notice message', async() => {
        annotationApiSearchStub.resolves({ total: 0 });
        const wrapper = factory();

        await wrapper.vm.fetch();

        expect(wrapper.text()).toBe('debias.termNotFound');
      });
    });

    describe('when Annotation API errors', () => {
      it('handles it via error plugin', async() => {
        const badRequestError = { statusCode: 400, message: 'Bad Request' };
        annotationApiSearchStub.rejects(badRequestError);
        const wrapper = factory();

        await wrapper.vm.$fetch();

        expect(wrapper.vm.$error.calledWith(badRequestError, { scope: 'page' })).toBe(true);
      });
    });
  });

  describe('template', () => {
    describe('while fetching', () => {
      it('shows a loading spinner', () => {
        const wrapper = factory({ mocks: { $fetchState: { pending: true } } });

        const loadingSpinner = wrapper.find('loadingspinner-stub');

        expect(loadingSpinner.exists()).toBe(true);
      });
    });

    describe('on fetch error', () => {
      it('shows an error message', () => {
        const wrapper = factory({ mocks: { $fetchState: { error: { message: 'Something went wrong' } } } });

        const errorMessage = wrapper.find('[data-qa="error message container"]');

        expect(errorMessage.exists()).toBe(true);
      });
    });

    it('uses the term prefLabel as authored head title', () => {
      const data = { term: { prefLabel: { [locale]: prefLabel } } };
      const wrapper = factory({ data });

      const authoredHead = wrapper.find('authoredhead-stub');

      expect(authoredHead.attributes('title')).toBe(prefLabel);
    });
  });
});
