import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';
import nock from 'nock';
import FeedbackWidget from '@/components/feedback/FeedbackWidget.vue';
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
    describe('on initial page load and before user scrolled', () => {
      it('is large', () => {
        const wrapper = factory();
        const button = wrapper.find('[data-qa="feedback button"]');
        expect(button.attributes().class).toContain('big');
      });
      it('and shows text', () => {
        const wrapper = factory();
        const buttonText = wrapper.find('[data-qa="feedback button text"]');
        expect(buttonText.isVisible()).toBe(true);
      });
    });
    describe('after scrolling', () => {
      it('shrinks', async() => {
        const wrapper = factory();
        global.window.dispatchEvent(new Event('scroll'));
        await wrapper.vm.$nextTick();
        const button = wrapper.find('[data-qa="feedback button"]');
        expect(button.attributes().class).not.toContain('big');
      });
      describe('and on mouseover', () => {
        it('grows big', async() => {
          const wrapper = factory();
          global.window.dispatchEvent(new Event('scroll'));
          const button = wrapper.find('[data-qa="feedback button"]');
          button.trigger('mouseover');
          await wrapper.vm.$nextTick();
          expect(button.attributes().class).toContain('big');
        });
      });
      describe('and on mouseleave', () => {
        it('shrinks again', async() => {
          const wrapper = factory();
          global.window.dispatchEvent(new Event('scroll'));
          await wrapper.vm.$nextTick();
          const button = wrapper.find('[data-qa="feedback button"]');
          button.trigger('mouseover');
          button.trigger('mouseleave');
          expect(button.attributes().class).not.toContain('big');
        });
      });
    });
  });
  describe('next button', () => {
    describe('when there is no value for feedback', () => {
      it('is disabled', async() => {
        const wrapper = factory();

        await wrapper.setData({
          currentStep: 1,
          feedback: ''
        });

        expect(wrapper.find('[data-qa="feedback next button"]').attributes('disabled')).toBe('disabled');
      });
    });
    describe('when there is a value for feedback', () => {
      it('is enabled', async() => {
        const wrapper = factory();

        await wrapper.setData({
          currentStep: 1,
          feedback: 'This website is great!'
        });

        expect(wrapper.find('[data-qa="feedback next button"]').attributes('disabled')).toBe(undefined);
      });
      it('and it is clicked and it has only 4 words', async() => {
        const wrapper = factory();

        await wrapper.setData({
          currentStep: 1,
          feedback: 'This website is great!'
        });

        await wrapper.find('form').trigger('submit.prevent');

        const errorMessage = wrapper.find('[data-qa="feedback message invalid"]');
        expect(errorMessage.exists()).toBe(true);
      });
      it('and it is clicked and it has over 5 words', async() => {
        const wrapper = factory();

        await wrapper.setData({
          currentStep: 1,
          feedback: 'This website is my favourite website!'
        });

        await wrapper.find('form').trigger('submit.prevent');

        const errorMessage = wrapper.find('[data-qa="feedback message invalid"]');
        expect(errorMessage.exists()).toBe(false);
      });
      it('and it is clicked, it goes to the next step', async() => {
        const wrapper = factory();

        await wrapper.setData({
          currentStep: 1,
          feedback: 'This website is super great!'
        });

        await wrapper.find('form').trigger('submit.prevent');

        expect(wrapper.vm.currentStep).toBe(2);
      });
    });
    describe('when there is no value for email', () => {
      it('is disabled', async() => {
        const wrapper = factory();

        await wrapper.setData({
          currentStep: 2,
          email: ''
        });

        expect(wrapper.find('[data-qa="feedback next button"]').attributes('disabled')).toBe('disabled');
      });
    });
    describe('when there is a value for email', () => {
      it('is enabled', async() => {
        const wrapper = factory();

        await wrapper.setData({
          currentStep: 2,
          email: 'example@mail.com'
        });

        expect(wrapper.find('[data-qa="feedback next button"]').attributes('disabled')).toBe(undefined);
      });
    });
  });

  describe('resetForm', () => {
    describe('when widget is opened', () => {
      it('form values are reset', () => {
        const wrapper = factory();

        const resetForm = sinon.spy(wrapper.vm, 'resetForm');

        wrapper.find('[data-qa="feedback button"]').trigger('click');

        expect(resetForm.called).toBe(true);
      });
    });
  });

  describe('sendFeedback', () => {
    describe('when email is not filled in and user clicks skip button', () => {
      it('feedback is send', async() => {
        const wrapper = factory();

        await wrapper.setData({
          currentStep: 2,
          email: ''
        });

        await wrapper.find('form').trigger('submit.prevent');

        expect(wrapper.vm.sendFeedback.called).toBe(true);
      });
    });
    describe('when email is filled in and user clicks next button', () => {
      it('feedback is send', async() => {
        const wrapper = factory();

        await wrapper.setData({
          currentStep: 2,
          email: 'example@mail.com'
        });

        await wrapper.find('form').trigger('submit.prevent');

        expect(wrapper.vm.sendFeedback.called).toBe(true);
      });
    });
    describe('when request failed and user clicks send button', () => {
      it('feedback is send', async() => {
        const wrapper = factory();

        await wrapper.setData({
          currentStep: 3,
          requestSuccess: false
        });

        await wrapper.find('form').trigger('submit.prevent');

        expect(wrapper.vm.sendFeedback.called).toBe(true);
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

      await wrapper.setData({
        requestSuccess: false,
        feedback
      });
      wrapper.vm.$config = { app: { baseUrl } };
      await wrapper.vm.postFeedbackMessage();

      expect(nock.isDone()).toBe(true);
    });

    it('includes email if provided', async() => {
      const email = 'me@example.org';
      nock(baseUrl).post(middlewarePath, body => (
        (body.feedback === feedback) && (body.email === email)
      )).reply(201);
      const wrapper = factory();

      await wrapper.setData({
        requestSuccess: false,
        feedback,
        email
      });
      wrapper.vm.$config = { app: { baseUrl } };
      await wrapper.vm.postFeedbackMessage();

      expect(nock.isDone()).toBe(true);
    });
  });
});
