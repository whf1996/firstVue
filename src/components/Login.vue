<template>
  <div class="login_container">
    <div class="login_box">
      <div class="login_photo">
        <img src="../assets/aishangxue.png" alt="">
      </div>
      <el-form label-width="0px" class="login_form" :model="loginForm" :rules="loginFormRules" ref="loginFormRef">
        <!--        用户名-->
        <el-form-item prop="phone">
          <el-input prefix-icon="ali-iconfont ali-icon-user" placeholder="请输入手机号" v-model="loginForm.phone"></el-input>
        </el-form-item>
        <!--        密码-->
        <el-form-item prop="password">
          <el-input prefix-icon="ali-iconfont ali-icon-mima" placeholder="请输入密码" v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <!--        按钮-->
        <el-form-item class="btn">
          <el-button type="danger" @click="resetData">重置</el-button>
          <el-button type="primary" @click="login">登入</el-button>
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
          'phone': '',
          'password': ''
        },
        'loginFormRules': {
          'phone': [
            {required: true, message: '请输入手机号', trigger: 'blur'},
            {min: 11, max: 11, message: '长度在 11 到 11 个字符', trigger: 'blur'}
          ],
          'password': [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      resetData () {
        this.$refs.loginFormRef.resetFields()
      },
      login () {
        this.$refs.loginFormRef.validate(async valid => {
          if (!valid) return false
          const {data: res} = await this.$http.post('user/login', this.loginForm)
          if (res.status !== 200) {
            return this.$message.error(res.msg)
          }
          window.localStorage.setItem('user', JSON.stringify(res.result))
          this.$message.success(res.msg)
          // window.sessionStorage.setItem('token', 'this is a token')
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
