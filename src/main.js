// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import store from "./store/index.js" //引入你新建的store文件
import App from './App'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import ElementUI from 'element-ui'
import Moment from 'moment'
import 'element-ui/lib/theme-chalk/index.css';
import './assets/styles/iconfont/iconfont.css';
import ECharts from 'vue-echarts'
import { use } from 'echarts/core'
import JsonExcel from 'vue-json-excel'

import './router/permission'
import './utils/localStorage'

// 手动引入 ECharts 各模块来减小打包体积
import {
  CanvasRenderer
} from 'echarts/renderers'
import {
  BarChart
} from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent
} from 'echarts/components'

use([
  CanvasRenderer,
  BarChart,
  GridComponent,
  TooltipComponent
]);


// 全局注册组件（也可以使用局部注册）
Vue.component('v-chart', ECharts)
Vue.filter('dateformat', function(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return Moment(new Date(dataStr)).format(pattern)
  })
Vue.use(VueAxios, axios)
Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.component('downloadExcel', JsonExcel)

axios.defaults.baseURL = "http://175.24.179.240:8085/"
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
