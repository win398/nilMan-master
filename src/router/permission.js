import router from './index.js';
//路由拦截 获取vuex数据
import store from '../store/index.js'
router.beforeEach((to, from, next) => {
  //console.log(to);
  //判断是否需要登录
  if (to.matched.some(ele => ele.meta.isLogin)) {
    //判断是否已经登录
    let token = store.state.LoginModule.userinfo.token;
    if (token) {
      next();
    } else {
      next('/login')
    }
  } else {
    //不需要登录
    next();
  }
})