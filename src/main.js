import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueSwal from 'vue-swal'
import {ApiService} from "./common/api.service";
import {BootstrapVue, BootstrapVueIcons} from "bootstrap-vue"
import {CHECK_AUTH} from "./store/actions.type";
import './assets/css/bootstrap.css'
import './assets/css/all.css'
import './assets/css/custom.css'

import FilterError from './common/filter.error'
import FilterCurrency from './common/filter.currency'

Vue.use(VueSwal)
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

Vue.filter('error', FilterError)
Vue.filter('currency', FilterCurrency)

Vue.config.productionTip = false


ApiService.init();

router.beforeEach((to, from, next) => {
    Promise.all([
        store.dispatch(CHECK_AUTH).then(() => next())
    ])
})

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        // this route requires auth, check if logged in
        // if not, redirect to login page.
        if (!store.getters.isAuthenticated) {
            next({
                name: 'home',
                //query: { redirect: to.fullPath }
            })
        } else {
            next()
        }
    } else {
        next() // make sure to always call next()!
    }
})


new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')
