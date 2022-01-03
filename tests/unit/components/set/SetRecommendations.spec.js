import { shallowMountNuxt } from '../../utils';
import sinon from 'sinon';

import SetRecommendations from '@/components/set/SetRecommendations';

const factory = ({ propsData = {}, features = {}, recommendations = [] }) => shallowMountNuxt(SetRecommendations, {
  propsData,
  mocks: {
    $apis: { recommendation: { recommend: sinon.stub().resolves({ items: recommendations }) } },
    $features: features,
    $fetchState: {},
    $store: {
      commit: sinon.spy(),
      state: { set: { activeRecommendations: recommendations } }
    },
    $t: (key) => key
  },
  stubs: ['b-row', 'b-col']
});

describe('components/set/SetRecommendations', () => {
  const recommendations = [{ id: '/123/abc' }];

  describe('fetch()', () => {
    const propsData = {
      identifier: '/2019',
      type: 'Collection'
    };

    it('fetches recommendations and commits them to the store', async() => {
      const wrapper = factory({ propsData, recommendations });

      await wrapper.vm.fetch();

      wrapper.vm.$apis.recommendation.recommend.should.have.been.calledWith('set', propsData.identifier);
      wrapper.vm.$store.commit.should.have.been.calledWith('set/setActiveRecommendations', recommendations);
    });
  });

  describe('accept/reject disclaimer', () => {
    context('when set is for entity best items', () => {
      const propsData = {
        identifier: '/2019',
        type: 'EntityBestItemsSet'
      };

      context('and only accept recommendations is enabled', () => {
        const features = { acceptEntityRecommendations: true };

        it('describes use of accept button', async() => {
          const wrapper = factory({ propsData, features, recommendations });

          await wrapper.vm.fetch();

          const disclaimer = wrapper.find('[data-qa="recommendations disclaimer"]');

          disclaimer.text().should.eq('recommendation.prompts.accept');
        });
      });

      context('and only reject recommendations is enabled', () => {
        const features = { rejectEntityRecommendations: true };

        it('describes use of reject button', async() => {
          const wrapper = factory({ propsData, features, recommendations });

          await wrapper.vm.fetch();

          const disclaimer = wrapper.find('[data-qa="recommendations disclaimer"]');

          disclaimer.text().should.eq('recommendation.prompts.reject');
        });
      });

      context('and both accept and reject recommendations are enabled', () => {
        const features = { acceptEntityRecommendations: true, rejectEntityRecommendations: true };

        it('describes use of both accept and reject buttons', async() => {
          const wrapper = factory({ propsData, features, recommendations });

          await wrapper.vm.fetch();

          const disclaimer = wrapper.find('[data-qa="recommendations disclaimer"]');

          disclaimer.text().should.eq('recommendation.prompts.accept — recommendation.prompts.reject');
        });
      });

      context('and neither accept nor reject recommendations are enabled', () => {
        const features = {};

        it('is not present', async() => {
          const wrapper = factory({ propsData, features, recommendations });

          await wrapper.vm.fetch();

          const disclaimer = wrapper.find('[data-qa="recommendations disclaimer"]');

          disclaimer.exists().should.be.false;
        });
      });
    });

    context('when set is not for entity best items', () => {
      const propsData = {
        identifier: '/2019',
        type: 'Collection'
      };

      context('and accept recommendations is enabled', () => {
        const features = { acceptSetRecommendations: true };

        it('describes use of both accept and reject buttons', async() => {
          const wrapper = factory({ propsData, features, recommendations });

          await wrapper.vm.fetch();

          const disclaimer = wrapper.find('[data-qa="recommendations disclaimer"]');

          disclaimer.text().should.eq('recommendation.prompts.accept — recommendation.prompts.reject');
        });
      });

      context('and neither accept nor reject recommendations are enabled', () => {
        const features = {};

        it('is not present', async() => {
          const wrapper = factory({ propsData, features, recommendations });

          await wrapper.vm.fetch();

          const disclaimer = wrapper.find('[data-qa="recommendations disclaimer"]');

          disclaimer.exists().should.be.false;
        });
      });
    });
  });
});
