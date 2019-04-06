import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')

var Habitica = require('habitica')
var api = new Habitica()
api.localLogin(
    'ENTER USERNAME HERE',
    'ENTER PASSWORD HERE'
).then((res) => {
    console.log(res.data)
    console.log(api.get('/user'))
})
Object.defineProperty(Vue.prototype, 'api', { value: api })

