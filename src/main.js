import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';
import '../src/assets/css/global.css';
import '../src/assets/css/fonts/iconfont'
import ZkTable from 'vue-table-with-tree-grid'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import VueQuillEditor from 'vue-quill-editor';

// var echarts = require('echarts');

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor, /* { default global options } */ )

//注册为tree-table为全局组件
Vue.use(ZkTable)



Vue.use(ElementUI);
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
Vue.prototype.$http = axios;
// Vue.prototype.$Message = Message;

// 通过axios请求拦截添加token,保证拥有获取数据的权限
// 在request拦截器中展示进度条 NProgress.start()
axios.interceptors.request.use(config => {
        // console.log(config);
        NProgress.start()
        config.headers.Authorization = window.sessionStorage.getItem('token');
        // 最后必须返回config
        return config;
    })
    // 在request拦截器中隐藏进度条 NProgress.done()
axios.interceptors.response.use(config => {
    NProgress.done()
    return config
})
Vue.filter('dateFormat', function(originVal) {
    const dt = new Date(originVal)
    var y = dt.getFullYear()
    var m = (dt.getMonth() + 1).toString().padStart(2, '0')
    var d = dt.getDate().toString().padStart(2, '0')
    var hh = dt.getHours().toString().padStart(2, '0')
    var mm = dt.getMinutes().toString().padStart(2, '0')
    var ss = dt.getSeconds().toString().padStart(2, '0')


    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})



Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')