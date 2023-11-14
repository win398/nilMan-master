<template>
  <div class="layout">
    <!-- 导航 -->
    <Menu class="menu" :isCollapse="isCollapse"/>
    <!-- 内容 -->
    <Content class="content" :class="{isActive:isCollapse}" @changeCollapse='changeCollapse' :isCollapse="isCollapse"/>
  </div>
</template>

<script>
import store from '../../store/index'
import Menu from './Menu.vue'
import Content from './Content.vue';
export default {
  user: '',
  name: 'Index',
  components: {
    Menu,
    Content
  },
  data () {
    return {
      isCollapse: false,
    }
  },
  created() {
    let token = store.state.LoginModule.userinfo.token;
    this.getUserInfo(token);
  },
  methods: {
    changeCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    getUserInfo(token) {
      this.axios.get("user/getManInfo", {
        headers: {
          'token': token,
        }
      }).then((response) => {
        let user = localStorage.getItem("userinfo");
        user = JSON.parse(user);
        user.user = response.data;
        localStorage.setItem("userinfo", JSON.stringify(user));
        store.commit('LoginModule/setUser', user)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
.layout {
  .menu {
    background: #545c64;
    position: fixed;
    top: 0;
    bottom: 0;
  }
  .content {
    margin-left: 200px;
    transition: margin-left ease-in-out 0.3s;
  }
  .isActive {
    margin-left: 64px;
  }
}
</style>
