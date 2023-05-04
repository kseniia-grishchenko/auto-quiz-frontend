import Vue from 'vue';
import ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/ua';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/element-variables.scss';

import App from './App.vue';

import './assets/main.scss';

Vue.use(ElementUI, { locale });

new Vue({
  render: (h) => h(App)
}).$mount('#app');
