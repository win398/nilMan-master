<template>
  <div>
    <el-menu
      :default-active="this.$route.path"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      router
      :collapse="isCollapse">
      <el-menu-item>
        <i class="iconfont icon-lu"></i>
        <span slot="title">Nil后台管理系统</span>
      </el-menu-item>
      <el-menu-item index="/">
        <i class="el-icon-menu"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-menu-item index="/userlist">
        <i class="el-icon-user"></i>
        <span slot="title">用户管理</span>
      </el-menu-item>
      <el-menu-item index="/logs">
        <i class="el-icon-notebook-2"></i>
        <span slot="title">用户日志</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'Menu',
  props: ['isCollapse'],
  data() {
    return {

    };
  },
  created() {

  },
  methods: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
.el-menu {
  border-right: 0;
  .is-active {
    background: #3ba1f5b6 !important;
    color: #fff !important;
  }
  .iconfont {
    font-size: 24px;
    color: skyblue;
  }
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

</style>
