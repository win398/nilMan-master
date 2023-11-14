<template>
  <!-- 最外层的大盒子 -->
  <div class="bigBox">
    <div class="box">
      <!-- 滑动盒子 -->
      <div class="pre-box">
        <h1>NIL后台管理系统</h1>
        <p>Welcome！</p>
        <div class="img-box">
          <img src="../../assets/img/waoku.jpg" alt="" id="avatar" />
        </div>
      </div>
      <!-- 登录盒子 -->
      <div class="login-form">
        <!-- 标题盒子 -->
        <div class="title-box">
          <h1>登录</h1>
        </div>
        <!-- 输入框盒子 -->
        <el-form :model="loginForm" ref="loginForm" :rules="rules" label-with="5px">
          <el-form-item prop="userNum" class="login-form">
            <el-input
              type="text"
              placeholder="用户名"
              v-model="loginForm.userNum"
            />
          </el-form-item>
          <el-form-item prop="password" class="login-form">
            <el-input
              type="password"
              placeholder="密码"
              v-model="loginForm.password"
            />
          </el-form-item>
        </el-form>
        <!-- 按钮盒子 -->
        <div class="btn-box">
          <button @click="login('loginForm')">登录</button>
        </div>
      </div>
    </div>
    <div class="record-num">
      <p>@2022 NIL后台管理系统 仅供个人学习使用 鄂ICP备2022006626号</p>
    </div>
  </div>
</template>

<script>
import {mapMutations} from 'vuex'
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        userNum: "",
        password: "",
      },
      rules: {
        userNum: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 8,
            message: "长度应该在3~8个字符之间",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, message: "长度应该大于6", trigger: "blur" },
        ],
      },
      timer: '',
      bubles: [],
    };
  },
  created() {},
  mounted() {
    var that=this;
    this.timer = setInterval(() => {
      that.bubleCreate();
    }, 100);
  },
  beforeDestroy() {
    clearTimeout(this.timer);
    for (var i = 0; i < this.bubles.length; i++) {
      this.bubles[i].remove();
    }
  },
  methods: {
    ...mapMutations('LoginModule', ['setUser']),
    bubleCreate() {
      // 获取body元素
      const body = document.body;
      // 创建泡泡元素
      const buble = document.createElement("buble");
      // 设置泡泡半径
      let r = Math.random() * 5 + 20; //半径大小为20~25
      // 设置泡泡的宽高
      buble.style.width = r + "px";
      buble.style.height = r + "px";
      // 设置泡泡的随机起点
      buble.style.left = Math.random() * innerWidth - 25 + "px";
      // 为body添加buble元素
      body.append(buble);
      // 4s清除一次泡泡
      this.bubles.push(buble);
      setTimeout(() => {
        buble.remove();
        this.bubles.splice(0, 1);
      }, 4000);
    },
    //登录
    login(submitForm) {
      this.$refs[submitForm].validate((valid) => {
        if (valid) {
            console.log('submit!');
            this.axios.post("user/manLogin", this.loginForm).then((response) => {
                //console.log(response)
                if (response.data) {
                  //console.log(response.data);
                  let loginUser = {
                    user: '',
                    token: response.data
                  }
                  this.setUser(loginUser)
                  //存储本地
                  localStorage.setItem('userinfo', JSON.stringify(loginUser))
                  //跳转
                  this.$router.push('/')
                } else {
                  this.$message.error('账号或密码错误');
                  this.loginForm.password = ''
                }
            });
          } else {
            console.log('error submit!!');
            this.$message.error('输入不合法');
            return false;
          }
      });
    },
  },
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.bigBox {
  /* 溢出隐藏 */
  height: 100vh;
  overflow-x: hidden;
  display: flex;
  /* 渐变方向从左到右 */
  background: linear-gradient(to right, rgb(247, 209, 215), rgb(191, 227, 241));
}

/* 最外层的大盒子 */
.box {
  width: 1050px;
  height: 600px;
  display: flex;
  /* 相对定位 */
  position: relative;
  z-index: 2;
  margin: auto;
  /* 设置圆角 */
  border-radius: 8px;
  /* 设置边框 */
  border: 1px solid rgba(255, 255, 255, 0.6);
  /* 设置盒子阴影 */
  box-shadow: 2px 1px 19px rgba(0, 0, 0, 0.1);
}

.record-num {
  width: 100%;
  position: fixed;
  bottom: 0;
  z-index: 99;
  text-align: center;
  margin-bottom: 20px;
}

/* 滑动的盒子 */
.pre-box {
  /* 宽度为大盒子的一半 */
  width: calc(1050px / 2);
  height: 100%;
  border-radius: 4px;
  background-color: #edd4dc;
  box-shadow: 2px 1px 19px rgba(0, 0, 0, 0.1);
}

/* 滑动盒子的标题 */
.pre-box h1 {
  margin-top: 150px;
  text-align: center;
  /* 文字间距 */
  letter-spacing: 5px;
  color: white;
  /* 禁止选中 */
  user-select: none;
  /* 文字阴影 */
  text-shadow: 4px 4px 3px rgba(0, 0, 0, 0.1);
}

/* 滑动盒子的文字 */
.pre-box p {
  height: 30px;
  line-height: 30px;
  text-align: center;
  margin: 20px 0;
  /* 禁止选中 */
  user-select: none;
  font-weight: bold;
  color: white;
  text-shadow: 4px 4px 3px rgba(0, 0, 0, 0.1);
}

/* 图片盒子 */
.img-box {
  width: 200px;
  height: 200px;
  margin: 20px auto;
  /* 设置为圆形 */
  border-radius: 50%;
  /* 设置用户禁止选中 */
  user-select: none;
  overflow: hidden;
  box-shadow: 4px 4px 3px rgba(0, 0, 0, 0.1);
}

/* 图片 */
.img-box img {
  width: 100%;
}

/* 登录和注册盒子 */
.login-form,
.pre-box {
  width: 50%;
  height: 100%;
}

/* 标题盒子 */
.title-box {
  height: 300px;
  line-height: 500px;
}

/* 标题 */
.title-box h1 {
  text-align: center;
  color: white;
  /* 禁止选中 */
  user-select: none;
  letter-spacing: 5px;
  text-shadow: 4px 4px 3px rgba(0, 0, 0, 0.1);
}

/* 输入框盒子 */
.el-form {
  display: flex;
  /* 纵向布局 */
  flex-direction: column;
  /* 水平居中 */
  align-items: center;
}
.el-form-item {
  width: 60%;
}
.login-form {
  /* 输入框 */
  /deep/ .el-input__inner {
    width: 100%;
    height: 40px;
    margin-bottom: 10px;
    text-indent: 10px;
    border: 1px solid #fff;
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 120px;
    /* 增加磨砂质感 */
    backdrop-filter: blur(10px);
  }

  // /deep/ .el-input__inner:focus {
  //   /* 光标颜色 */
  //   color: #5a6166;
  // }

  /* 聚焦时隐藏文字 */
  // /deep/ .el-input__inner:focus::placeholder {
  //   opacity: 0;
  // }
}

/* 按钮盒子 */
.btn-box {
  display: flex;
  justify-content: center;
}

/* 按钮 */
button {
  width: 100px;
  height: 36px;
  margin: 0 7px;
  line-height: 30px;
  border: none;
  border-radius: 4px;
  background-color: #69b3f0;
  color: white;
}

/* 按钮悬停时 */
button:hover {
  /* 鼠标小手 */
  cursor: pointer;
  /* 透明度 */
  opacity: 0.8;
}

/* 按钮文字 */
.btn-box p {
  height: 30px;
  line-height: 30px;
  /* 禁止选中 */
  user-select: none;
  font-size: 14px;
  color: white;
}

.btn-box p:hover {
  cursor: pointer;
  border-bottom: 1px solid white;
}
</style>
<style>
buble {
  position: absolute;
  z-index: 0;
  bottom: 0;
  border-radius: 50%;
  /* 径向渐变 */
  background: radial-gradient(
    circle at 72% 28%,
    #fff 3px,
    #ff7edf 8%,
    #5b5b5b,
    #aad7f9 100%
  );
  /* 泡泡内阴影 */
  box-shadow: inset 0 0 6px #fff, inset 3px 0 6px #eaf5fc,
    inset 2px -2px 10px #efcde6, inset 0 0 60px #f9f6de, 0 0 20px #fff;
  /* 动画 */
  animation: myMove 4s linear infinite;
}

@keyframes myMove {
  0% {
    transform: translateY(0%);
    opacity: 1;
  }

  50% {
    transform: translate(10%, -1000%);
  }

  75% {
    transform: translate(-20%, -1200%);
  }

  99% {
    opacity: 0.9;
  }

  100% {
    transform: translateY(-1800%) scale(1.5);
    opacity: 0;
  }
}
</style>
