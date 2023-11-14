import store from '../store/index';
//持久化
let user = localStorage.getItem('userinfo')
if (user) {
  user = JSON.parse(user);
  store.commit('LoginModule/setUser', user)
}