import { createLocalVue } from '@vue/test-utils';
import { mountNuxt } from '@test/utils.js';
import BootstrapVue from 'bootstrap-vue';
import sinon from 'sinon';

import StoryHero from '@/components/story/StoryHero.vue';
import * as parallaxElementComposable from '@/composables/parallaxElement.js';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const baseProps = { title: 'This is a title',
  heroImage: { image: { url: 'https://www.europeana.eu/example.jpg', height: 1000, contentType: 'image/jpeg' } } };

const factory = (propsData = baseProps) => mountNuxt(StoryHero, {
  localVue,
  attachTo: document.body,
  propsData,
  mocks: {
    $t: (key) => key
  }
});

describe('components/story/StoryHero', () => {
  it('applies parallax effect to the hero background image', () => {
    sinon.spy(parallaxElementComposable, 'useParallaxElement');

    factory();

    expect(parallaxElementComposable.useParallaxElement.calledWith('#hero-background-image img')).toBe(true);
  });
});
