import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../views/Layout/Index.vue';
import Home from '../views/Home/Home.vue';
import Login from '../views/Login/Login.vue';
//异步
const Logs = ()=>import('../views/Logs/Logs.vue')
const UserList = ()=>import('../views/Users/UserList.vue')

Vue.use(Router)

const routes =  [
  {
    path: '/',
    component: Layout,
    meta: {
      isLogin:true
    },
    children: [
      {
        path: '/',
        name: 'Home',
        component: Home,
      },
      {
        path: '/userlist',
        name: 'UserList',
        component: UserList,
      },
      {
        path: '/logs',
        name: 'Logs',
        component: Logs,
      },
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
]

const router = new Router({
  routes
})


export default router

const originalPush = Router.prototype.push
   Router.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}

