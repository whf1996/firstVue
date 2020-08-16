<template>
  <div class="login_container">
    <div class="login_box">
      <div class="login_photo">
        <img src="../assets/logo.png" alt="">
      </div>
      <el-form label-width="0px" class="login_form" :model="loginForm" :rules="loginFormRules" ref="loginFormRef">
        <!--        用户名-->
        <el-form-item prop="username">
          <el-input prefix-icon="ali-iconfont ali-icon-user" placeholder="请输入用户名"
                    v-model="loginForm.username"></el-input>
        </el-form-item>
        <!--        密码-->
        <el-form-item prop="password">
          <el-input prefix-icon="ali-iconfont ali-icon-mima" placeholder="请输入密码" v-model="loginForm.password"
                    type="password"></el-input>
        </el-form-item>
        <!--        按钮-->
        <el-form-item class="btn">
          <el-button type="primary" @click="login">登入</el-button>
          <el-button type="info" @click="resetData">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        'loginForm': {
          'username': '',
          'password': ''
        },
        'loginFormRules': {
          'username': [
            {required: true, message: '请输入活动名称', trigger: 'blur'},
            {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
          ],
          'password': [
            {required: true, message: '请输入活动名称', trigger: 'blur'},
            {min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      resetData () {
        this.$refs.loginFormRef.resetFields()
      },
      login: function () {
        this.$refs.loginFormRef.validate(valid => {
          if (!valid) return false
          if (!(this.loginForm.username === 'admin' && this.loginForm.password === '123456')) return this.$message.error('用户名或密码错误')
          window.sessionStorage.setItem('token', '这是token')
          this.$message.success('登入成功')
          this.$router.push('/home')
        })
      }
    }

  }
</script>

<style scoped>
  .login_container {
    background-color: #2b4b6b;
    height: 100%;
  }

  .login_box {
    height: 300px;
    width: 450px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .login_photo {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    box-shadow: 0 0 10px gold;
  }

  .login_photo img {
    height: 100%;
    width: 100%;
    border-radius: 50%;
    background-color: #eee;
    box-shadow: 0 0 10px gold;
  }

  .btn {
    display: flex;
    justify-content: flex-end;
  }

  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
</style>
