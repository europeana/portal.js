import Vue from 'vue'
import VueI18n from 'vue-i18n'

import { ButtonPlugin, FormPlugin, FormGroupPlugin, FormTextareaPlugin, LinkPlugin } from 'bootstrap-vue'


import App from './App.vue'
import i18nMessages from './i18n.js'

Vue.use(VueI18n)
Vue.use(LinkPlugin)
Vue.use(ButtonPlugin)
Vue.use(FormPlugin)
Vue.use(FormGroupPlugin)
Vue.use(FormTextareaPlugin)

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '@europeana/style'

const i18n = new VueI18n({
  locale: 'en', // set locale
  messages: i18nMessages, // set locale messages
})

Vue.config.productionTip = false

new Vue({
  i18n,
  render: h => h(App),
}).$mount('#app')
