import { configure } from '@storybook/vue';
import { action } from '@storybook/addon-actions';

//import NuxtLink from '../.nuxt/components/nuxt-link.js'

import Vue from 'vue';

Vue.component('RouterLink', {
  props:   ['to'],
  methods: {
    log() {
      action('link target')(this.to)
    },
  },
  template: '<a @click="log()"><slot>RouterLink</slot></a>'
})

Vue.component('NuxtLink', {
  props:   ['to'],
  methods: {
    log() {
      action('link target')(this.to)
    },
  },
  template: '<a @click="log()"><slot>NuxtLink</slot></a>'
})

// automatically import all files ending in *.stories.js from the components directory
const req = require.context('../components', true, /.stories.js$/);

function loadStories() {
  req.keys().forEach(filename => {
    req(filename);
  });
}

configure(loadStories, module);
