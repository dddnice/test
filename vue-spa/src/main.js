import Vue from 'vue';
import App from './App.vue';
import store from './store';

Vue.component('Filters', require('./components/Filters').default);
Vue.component('News', require('./components/News').default);

new Vue({
  el: '#app',
  render: h => h(App),
  store: store
});