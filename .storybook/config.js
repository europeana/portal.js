import { configure } from '@storybook/vue';
import { action } from '@storybook/addon-actions';

import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue'

Vue.use(BootstrapVue);

// add bootstrap CSS to head
const bootstrapPkg = require('bootstrap/package');
const bootstrapVuePkg = require('bootstrap-vue/package');

let styleBootstrap = document.createElement('link');
styleBootstrap.setAttribute('rel', 'stylesheet');
styleBootstrap.setAttribute('href', `https://cdn.jsdelivr.net/npm/bootstrap@${bootstrapPkg.version}/dist/css/bootstrap.min.css`);

document.querySelector('head').appendChild(styleBootstrap);

let styleBootstrapVue = document.createElement('link');
styleBootstrapVue.setAttribute('rel', 'stylesheet');
styleBootstrapVue.setAttribute('href', `https://cdn.jsdelivr.net/npm/bootstrap-vue@${bootstrapVuePkg.version}/dist/bootstrap-vue.css`);

document.querySelector('head').appendChild(styleBootstrapVue);

// automatically import all files ending in *.stories.js from the components directory
const req = require.context('../components', true, /.stories.js$/);

function loadStories() {
  req.keys().forEach(filename => {
    req(filename);
  });
}

configure(loadStories, module);
