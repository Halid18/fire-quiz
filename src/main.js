import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App'
import router from './router/router'
import store from './store'
import './auth';

import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)


new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  render: h => h(App),
  components: { App }
}).$mount('#app')
