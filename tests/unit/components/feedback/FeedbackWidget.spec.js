import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';
import nock from 'nock';
import FeedbackWidget from '../../../../src/components/feedback/FeedbackWidget.vue';
import VueI18n from 'vue-i18n';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(VueI18n);

const factory = (propsData = {}) => {
  const wrapper = mount(FeedbackWidget, {
    localVue,
    i18n: new VueI18n({  locale: 'en',
      messages: {
        en: {
          feedback: {
            policies: 'By continuing, you agree to our {0} and acknowledge our {1}.'
          }
        }
      } }),
    propsData,
    mocks: {
      $t: () => {},
      $path: () => {}
    }
  });
  wrapper.vm.sendFeedback = sinon.spy();
  return wrapper;
};

describe('components/feedback/FeedbackWidget', () => {
  describe('feedback button', () => {
    context('on initial page load and before user scrolled', () => {
      it('is large', () => {
        const wrapper = factory();
        const button = wrapper.find('[data-qa="feedback button"]');
        button.attributes().class.should.contain('big');
      });
      it('and shows text', () => {
        const wrapper = factory();
        const buttonText = wrapper.find('[data-qa="feedback button text"]');
        buttonText.isVisible().should.equal(true);
      });
    });
    context('after scrolling', () => {
      it('shrinks', () => {
        const wrapper = factory();
        global.window.dispatchEvent(new Event('scroll'));
        const button = wrapper.find('[data-qa="feedback button"]');
        button.attributes().class.should.not.contain('big');
      });
      context('and on mouseover', () => {
        it('grows big', () => {
          const wrapper = factory();
          global.window.dispatchEvent(new Event('scroll'));
          const button = wrapper.find('[data-qa="feedback button"]');
          button.trigger('mouseover');
          button.attributes().class.should.contain('big');
        });
      });
      context('and on mouseleave', () => {
        it('shrinks again', () => {
          const wrapper = factory();
          global.window.dispatchEvent(new Event('scroll'));
          const button = wrapper.find('[data-qa="feedback button"]');
          button.trigger('mouseover');
          button.trigger('mouseleave');
          button.attributes().class.should.not.contain('big');
        });
      });
    });
  });
  describe('next button', () => {
    context('when there is no value for feedback', () => {
      it('is disabled', () => {
        const wrapper = factory();

        wrapper.setData({
          currentStep: 1,
          feedback: ''
        });

        wrapper.find('[data-qa="feedback next button"]').attributes('disabled').should.eq('disabled');
      });
    });
    context('when there is a value for feedback', () => {
      it('is enabled', () => {
        const wrapper = factory();

        wrapper.setData({
          currentStep: 1,
          feedback: 'This website is great!'
        });

        (wrapper.find('[data-qa="feedback next button"]').attributes('disabled') === undefined).should.be.true;
      });
      it('and it is clicked, it goes to the next step', async() => {
        const wrapper = factory();

        wrapper.setData({
          currentStep: 1,
          feedback: 'This website is great!'
        });

        await wrapper.find('form').trigger('submit.prevent');

        wrapper.vm.currentStep.should.equal(2);
      });
    });
    context('when there is no value for email', () => {
      it('is disabled', () => {
        const wrapper = factory();

        wrapper.setData({
          currentStep: 2,
          email: ''
        });

        wrapper.find('[data-qa="feedback next button"]').attributes('disabled').should.eq('disabled');
      });
    });
    context('when there is a value for email', () => {
      it('is enabled', () => {
        const wrapper = factory();

        wrapper.setData({
          currentStep: 2,
          email: 'example@mail.com'
        });

        (wrapper.find('[data-qa="feedback next button"]').attributes('disabled') === undefined).should.be.true;
      });
    });
  });

  describe('resetForm', () => {
    context('when widget is opened', () => {
      it('form values are reset', () => {
        const wrapper = factory();

        const resetForm = sinon.spy(wrapper.vm, 'resetForm');

        wrapper.find('[data-qa="feedback button"]').trigger('click');

        resetForm.should.have.been.called;
      });
    });
  });

  describe('sendFeedback', () => {
    context('when email is not filled in and user clicks skip button', () => {
      it('feedback is send', async() => {
        const wrapper = factory();

        wrapper.setData({
          currentStep: 2,
          email: ''
        });

        await wrapper.find('form').trigger('submit.prevent');

        wrapper.vm.sendFeedback.should.have.been.called;
      });
    });
    context('when email is filled in and user clicks next button', () => {
      it('feedback is send', async() => {
        const wrapper = factory();

        wrapper.setData({
          currentStep: 2,
          email: 'example@mail.com'
        });

        await wrapper.find('form').trigger('submit.prevent');

        wrapper.vm.sendFeedback.should.have.been.called;
      });
    });
    context('when request failed and user clicks send button', () => {
      it('feedback is send', async() => {
        const wrapper = factory();

        wrapper.setData({
          currentStep: 3,
          requestSuccess: false
        });

        await wrapper.find('form').trigger('submit.prevent');

        wrapper.vm.sendFeedback.should.have.been.called;
      });
    });
  });

  describe('postFeedbackMessage', () => {
    const baseUrl = 'http://www.example.org';
    const middlewarePath = '/_api/jira/service-desk';
    const feedback = 'This was useful. Thanks!';

    it('posts feedback to server middleware', async() => {
      nock(baseUrl).post(middlewarePath, body => (body.feedback === feedback)).reply(201);
      const wrapper = factory();

      wrapper.setData({
        requestSuccess: false,
        feedback
      });
      wrapper.vm.$config = { app: { baseUrl } };
      await wrapper.vm.postFeedbackMessage();

      nock.isDone().should.be.true;
    });

    it('includes email if provided', async() => {
      const email = 'me@example.org';
      nock(baseUrl).post(middlewarePath, body => (
        (body.feedback === feedback) && (body.email === email)
      )).reply(201);
      const wrapper = factory();

      wrapper.setData({
        requestSuccess: false,
        feedback,
        email
      });
      wrapper.vm.$config = { app: { baseUrl } };
      await wrapper.vm.postFeedbackMessage();

      nock.isDone().should.be.true;
    });
  });
});
