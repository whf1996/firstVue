<template>
  <el-container class="home-container">
    <!--  头部区域-->
    <el-header>
      <div>
        <img src="../assets/aishangxue2.png" alt=""/>
        <span>GISS管理系统</span>
      </div>
      <div>
        <el-dropdown>
          <span style="color: white; font-size: 30px">你好,{{user.name}}</span>
          <el-dropdown-menu slot="dropdown" :split-button="true">
            <el-button @click="editUserInfo" style="width: 100%; border:none">修改密码</el-button>
            <br>
            <el-button @click="logout" style="width: 100%; border:none">退出</el-button>
          </el-dropdown-menu>
        </el-dropdown>
        <img :src="user.header" alt=""/>
      </div>
      <el-dialog title="修改密码" :visible.sync="editDialogVisible" width="50%" @close="resetEditData">
        <el-form :model="editUserForm" :rules="editUserFormRules" ref="editUserFormRef" label-width="120px">
          <el-form-item label="新密码" prop="password">
            <el-input v-model="editUserForm.password" placeholder="请输入新密码" type="password"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="danger" @click="resetEditData">重置</el-button>
        <el-button type="primary" @click="editPassword">确定</el-button>
        </span>
      </el-dialog>
    </el-header>
    <!--    主体区域-->
    <el-container>
      <!--      侧边栏-->
      <el-aside :width="isOpen ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleOpen">|||</div>
        <el-menu background-color="#333744"
                 text-color="#fff"
                 active-text-color="#ffd04b" :unique-opened="true" :collapse="isOpen" :collapse-transition="false"
                 :router="true" :default-active="navStatus">
          <el-submenu :index="list.id.toString()" v-for="list in dataList" :key="list.id">
            <template slot="title">
              <i :class="iconObj[list.id]"></i>
              <span>{{list.name}}</span>
            </template>
            <el-menu-item :index="item.path" v-for="item in list.child" :key="item.id"
                          @click="saveNavStatus(item.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{item.name}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--      内容区域-->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
  export default {
    data () {
      return {
        dataList: [
          {
            'id': 1,
            'name': '配置中心',
            'child': [{'id': 10, 'name': '员工管理', 'path': '/user'}, {
              'id': 11,
              'name': '雪地信息',
              'path': '/snow'
            }, {'id': 12, 'name': '课程管理', 'path': '/course'}, {
              'id': 13,
              'name': '考题管理',
              'path': '/question'
            }, {'id': 14, 'name': 'banner管理', 'path': '/banner'}]
          },
          {
            'id': 2,
            'name': '排课系统',
            'child': [{'id': 20, 'name': '教练课表', 'path': '/coachCourse'}, {
              'id': 21,
              'name': '管理员课表',
              'path': '/adminCourse'
            }]
          },
          {
            'id': 3,
            'name': '订单管理',
            'child': [{'id': 30, 'name': '全部订单', 'path': '/order'}, {'id': 31, 'name': '退款处理', 'path': '/refund'}]
          },
          {
            'id': 4,
            'name': '消息中心',
            'child': [{'id': 41, 'name': '预约体验', 'path': '/reservation'}, {'id': 42, 'name': '教练申请', 'path': '/joinUs'}]
          }
        ],
        iconObj: {
          '1': 'iconfont el-icon-s-tools',
          '2': 'iconfont el-icon-notebook-1',
          '3': 'iconfont el-icon-shopping-cart-full',
          '4': 'iconfont el-icon-circle-plus'
        },
        isOpen: false,
        navStatus: '',
        user: {},
        editUserForm: {},
        editUserFormRules: {
          'password': [
            {required: true, message: '密码不能为空', trigger: 'blur'}
          ]
        },
        editDialogVisible: false
      }
    },
    created () {
      // 刷新或者重新进入该组件调用
      this.user = JSON.parse(window.localStorage.getItem('user'))
      if (this.user.is_resident !== 2) {
        this.dataList = [
          {
            'id': 1,
            'name': '排课系统',
            'child': [{'id': 10, 'name': '教练课表', 'path': '/coachCourse'}]
          }]
        this.iconObj = {
          '1': 'iconfont el-icon-notebook-1'
        }
      }
      this.navStatus = window.localStorage.getItem('navStatus')
    },
    methods: {
      resetEditData () {
        if (this.editDialogVisible) {
          this.$refs.editUserFormRef.resetFields()
        }
      },
      async logout () {
        window.localStorage.clear()
        const {data: res} = await this.$http.post('user/logout')
        this.verifyLogin(res)
        if (res.status !== 200) {
          return this.$message.error(res.msg)
        }
        this.$router.push('/login')
        this.$message.success(res.msg)
      },
      async editPassword () {
        const {data: res} = await this.$http.post('user/editPassword', this.editUserForm)
        this.verifyLogin(res)
        if (res.status !== 200) {
          return this.$message.error(res.msg)
        }
        this.$message.success(res.msg)
        this.editDialogVisible = false
      },
      toggleOpen () {
        this.isOpen = !this.isOpen
      },
      saveNavStatus: function (navPath) {
        // 防刷新
        window.localStorage.setItem('navStatus', navPath)
        this.navStatus = navPath
      },
      verifyLogin (res) {
        if (res.status === 124) {
          this.$message.error(res.msg)
          return this.$router.push('/login')
        }
        if (res.status === 125) {
          this.$message.error(res.msg)
          return this.$router.push('/login')
        }
      },
      editUserInfo () {
        this.editUserForm = {}
        this.editDialogVisible = true
      }
    }
  }
</script>

<style scoped>
  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;
  }

  .el-header > div {
    display: flex;
    align-items: center;
  }

  .el-header img {
    height: 60px;
    width: 60px;
    border-radius: 50%;
  }

  .el-aside {
    background-color: #333744;
  }

  .el-main {
    background-color: #eaedf1;
  }

  .home-container {
    height: 100%;
  }

  .iconfont {
    margin-right: 10px;
  }

  .el-menu {
    border-right: none;
  }

  .toggle-button {
    background-color: #4a5064;
    color: #fff;
    font-size: 10px;
    text-align: center;
    line-height: 22px;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
</style>
