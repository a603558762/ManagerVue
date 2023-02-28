<template>

  <div class="login_container">
    <div class="login_box">
      <div class="avatar">
        <img src="../assets/logo.png" alt="logo">
      </div>

      <div class="login_form">
        <el-form ref="LoginFormRef" :rules="LoginRules" label-width="0px" :model="loginForm">
          <!--          用户名-->
          <el-form-item prop="username" label="">
            <el-input v-model="loginForm.username" placeholder="用户名"
                      prefix-icon="iconfont icon-user-circle"></el-input>
          </el-form-item>
          <!--          密码-->
          <el-form-item prop="password" label="">
            <el-input v-model="loginForm.password"
                      placeholder="密码"
                      prefix-icon="iconfont icon-lock"
                      type="password"
            ></el-input>
          </el-form-item>
          <!--    确认登录-->
          <el-form-item class="btns">
            <el-button type="primary" @click="onSubmit">登陆</el-button>
            <el-button @click="resetLoginForm">重置</el-button>
          </el-form-item>

        </el-form>

      </div>


    </div>
  </div>
</template>

<script>


import {request} from "@/plugins/request";

export default {
  name: "loginP",
  data() {


    return {
      loginForm: {
        username: 'yoyo',
        password: "hx123456"
      },
      LoginRules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 3, message: "用户名长度大于3", trigger: 'blur'},
        ],
        password: [
          {
            required: true, message: '请输入密码', trigger: 'blur'
          },
          {
            min: 6, max: 15, message: '密码长度大于5小于15', trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    resetLoginForm() {
      this.$refs.LoginFormRef.resetFields()
    },
    onSubmit() {
      let _this = this
      this.$refs.LoginFormRef.validate((valid) => {
        if (!valid) return;
        request({
          method:"POST",
          url :'login/',
          data:{
            username: this.loginForm.username,
            password: this.loginForm.password
          }
        }).then(function (response) {
              console.log(response);
              if(response && response.status==200) {
                 _this.$message.success('登陆成功！');
                 window.sessionStorage.setItem('token',response.data.token)
                 window.sessionStorage.setItem('username',response.data.username)
                  _this.$router.push('/home')
              }else{
                 _this.$message.error('登陆失败！');
              }
        })
            .catch(function (error) {
              console.log(error);
            });

      })

    }
  }
}
</script>

<style lang="less" scoped>
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: center;
}

.login_container {
  background: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background: #afafaf;
  border-radius: 5px;
  position: absolute;
  left: 50%;
  right: 50%;
  transform: translate(-50%, 20%);

}

.avatar {
  width: 130px;
  height: 130px;
  background: #afafaf;
  border-radius: 50%;
  padding: 5px;
  border: 1px solid #f9f9f9;
  position: absolute;
  transform: translate(95%, -30%);
  box-shadow: 0 0 10px #f9f9f9;

  img {
    width: 100%;
    height: 100%;
    border: 1px solid #afafaf;
    border-radius: 50%;
    background: #afafaf;

  }

}

</style>