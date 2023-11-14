<template>
  <div>
    <div class="nav">
      <div class="btn-collapse">
        <i v-if="!isCollapse" @click="changeMenu" class="iconfont icon-right-indent"/>
        <i v-else @click="changeMenu" class="iconfont icon-bx-right-indent" />
        <span>{{myTime}}，{{userinfo.user.userName}}</span>
      </div>
      <div class="user">
        <el-dropdown szie="medium">
          <span class="el-dropdown-link">
            <img :src="picIp+userinfo.user.header"/>
            <i class="el-icon-arrow-down"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item disabled>个人中心</el-dropdown-item>
            <el-dropdown-item @click.native="toIndex">首页</el-dropdown-item>
            <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        
      </div>
    </div>
    <!-- 内容--路由出口 -->
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  name: "Content",
  props: ["isCollapse"],
  data() {
    return {
      picIp: "http://175.24.179.240:8085/npic/",
      myTime: '早上好',
    };
  },
  created() {
    this.getMyTime();
  },
  computed: {
    ...mapState('LoginModule', ['userinfo'])
  },
  methods: {
    ...mapMutations('LoginModule', ['clearUser']),
    changeMenu() {
      this.$emit("changeCollapse");
    },
    getMyTime() {
      // 获取当前时间
				var time_now=new Date();
				var hour=time_now.getHours();	//小时
        // 判断时间：0-12点上午 12点到18下午 其他时间是晚上
				if(hour>=0&&hour<12){
					this.myTime="上午好";
				}else if(hour>=12&&hour<=18){
					this.myTime="下午好";
				}else{
					this.myTime="晚上好";
				}
    },
    toIndex() {
      this.$router.push('/');
    },
    logout() {
      //退出登录
      this.clearUser()
      localStorage.removeItem('userinfo')
      this.$router.replace('/login')
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.nav {
  height: 50px;
  line-height: 50px;
  padding: 3px;
  display: flex;
  justify-content:space-between;
  color: rgb(85, 76, 76);
  .iconfont {
    font-size: 24px;
  }
  .btn-collapse {
    margin-left: 6px;
    span {
      font: bold 20px arial,sans-serif;
      margin-left: 20px;
    }
  }
  .user {
    margin-right: 16px;
    height: 50px;
    img {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      vertical-align: middle;
      margin-right: 6px;
    }
  }
}


</style>
