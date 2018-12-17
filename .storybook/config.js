import { configure } from '@storybook/vue';
import { action } from '@storybook/addon-actions';

import Vue from 'vue';

const templateClickLink = '<a @click="log()"><slot>RouterLink</slot></a>';
const linkMethods = {
  log() {
    action('link target')(this.to)
  }
};

Vue.component('RouterLink', {
  props:   ['to'],
  methods: linkMethods,
  template: templateClickLink
})

Vue.component('NuxtLink', {
  props:   ['to'],
  methods: linkMethods,
  template: templateClickLink
})

// automatically import all files ending in *.stories.js from the components directory
const req = require.context('../components', true, /.stories.js$/);

function loadStories() {
  req.keys().forEach(filename => {
    req(filename);
  });
}

configure(loadStories, module);
