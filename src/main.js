import Vue from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VueRouter from 'vue-router';
import router from './Routes/routers'
import dashboard from './layout/dashboard'
import login from './layout/login'
import CKEditor from '@ckeditor/ckeditor5-vue';

Vue.use( CKEditor )
Vue.use(VueRouter);

Vue.component('dashboard-layout', dashboard);
Vue.component('login-layout', login);
Vue.config.productionTip = false
if(localStorage.getItem("users")!= undefined){
  Vue.prototype.authuser = localStorage.getItem("users");
}

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
