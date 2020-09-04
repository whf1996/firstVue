<template>
  <div>
    <!--    面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>配置中心</el-breadcrumb-item>
      <el-breadcrumb-item>员工管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片区域-->
    <el-card class="box-card">
      <!--      搜索、新增-->
      <el-row :gutter="20">
        <el-col :span="9">
          <el-input placeholder="请输入内容" v-model="queryParams.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="getUserInfo">新增员工</el-button>
        </el-col>
      </el-row>
      <!--      列表-->
      <el-table :data="userList" stripe border style="width: 100%">
        <el-table-column label="头像">
          <template slot-scope="scope">
            <el-image :src="scope.row.header"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" align="center"></el-table-column>
        <el-table-column prop="work_years" label="执教年限" align="center"></el-table-column>
        <el-table-column prop="is_resident" label="角色" align="center"></el-table-column>
        <el-table-column prop="resident_snow" label="常驻雪场" align="center"></el-table-column>
        <el-table-column prop="phone" label="联系电号" align="center"></el-table-column>
        <el-table-column prop="card" label="身份证号" width="170px" align="center"></el-table-column>
        <el-table-column label="操作" width="200px" align="center">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="getUserInfoById(scope.row.id)">编辑
            </el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--      分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParams.page"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="queryParams.limit"
        layout="total,sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
    </el-card>
    <!--    dialog增加弹窗-->
    <el-dialog title="添加员工" :visible.sync="addDialogVisible" width="50%" @close="resetAddData">
      <el-form :model="addUserForm" :rules="addUserFormRules" ref="addUserFormRef" label-width="120px" :inline="true">
        <el-form-item label="头像" prop="header">
          <el-upload action="http://www.hhh.com/management/upload/uploadFile" :on-preview="addHandlePreview"
                     :on-remove="addHandleRemove" list-type="picture" name="image" :on-success="addHandleSuccess">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <br>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addUserForm.name" placeholder="请输入员工姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="addUserForm.phone" placeholder="请输入员工手机号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password" type="password" placeholder="请输入员工密码"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="card">
          <el-input v-model="addUserForm.card" placeholder="请输入员工身份证号"></el-input>
        </el-form-item>
        <el-form-item label="执教年限" prop="work_years">
          <el-input v-model="addUserForm.work_years" placeholder="请输入员工执教年限"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="is_resident">
          <el-select v-model="addUserType" placeholder="请选择员工类型">
            <el-option v-for="item in allRole" :key="item.id" :value="item.id" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="常驻雪地" prop="resident_snow">
          <el-input v-model="addUserForm.resident_snow" placeholder="请输入员工常驻雪地"></el-input>
        </el-form-item>
        <el-form-item label="员工简介" prop="desc">
          <el-input type="textarea" v-model="addUserForm.desc" placeholder="请输入员工简介"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="resetAddData">重置</el-button>
        <el-button type="primary" @click="addUser">确定</el-button>
      </span>
    </el-dialog>
    <!--    dialog编辑弹窗-->
    <el-dialog title="编辑员工" :visible.sync="editDialogVisible" width="50%" @close="resetEditData">
      <el-form :model="editUserForm" :rules="addUserFormRules" ref="editUserFormRef" label-width="120px" :inline="true">
        <el-form-item label="头像" prop="header">
          <el-upload action="http://www.hhh.com/management/upload/uploadFile" :on-preview="addHandlePreview"
                     :on-remove="editHandleRemove" list-type="picture" name="image" :on-success="editHandleSuccess">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <br>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editUserForm.name" placeholder="请输入员工姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="editUserForm.phone" placeholder="请输入员工手机号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="editUserForm.password" type="password" placeholder="请输入员工密码"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="card">
          <el-input v-model="editUserForm.card" placeholder="请输入员工身份证号"></el-input>
        </el-form-item>
        <el-form-item label="执教年限" prop="work_years">
          <el-input v-model="editUserForm.work_years" placeholder="请输入员工执教年限"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="is_resident">
          <el-select v-model="editUserType" placeholder="请选择员工类型">
            <el-option v-for="item in allRole" :key="item.id" :value="item.id" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="常驻雪地" prop="resident_snow">
          <el-input v-model="editUserForm.resident_snow" placeholder="请输入员工常驻雪地"></el-input>
        </el-form-item>
        <el-form-item label="员工简介" prop="desc">
          <el-input type="textarea" v-model="editUserForm.desc" placeholder="请输入员工简介"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="resetEditData">重置</el-button>
        <el-button type="primary" @click="editUser">确定</el-button>
      </span>
    </el-dialog>
    <!--    预览图片-->
    <el-dialog title="预览图片" :visible.sync="uploadDialogVisible" width="50%">
      <img :src="uploadUrl" alt="" class="uploadImg">
    </el-dialog>
  </div>
</template>

<script>
  export default {
    created () {
      this.getUserList()
    },
    data () {
      return {
        queryParams: {
          query: '',
          limit: 10,
          page: 1
        },
        userList: [],
        totalCount: 0,
        addDialogVisible: false,
        editDialogVisible: false,
        beforeAvatarUpload: false,
        handleAvatarSuccess: false,
        imageUrl: '',
        addUserForm: {
          header: '',
          name: '',
          phone: '',
          password: '',
          card: '',
          work_years: '',
          resident_snow: '',
          is_resident: '',
          desc: ''
        },
        editUserForm: {},
        uploadUrl: '',
        uploadDialogVisible: false,
        allRole: [{'name': '驻场教练', 'id': 0}, {'name': '自由教练', 'id': 1}, {'name': '管理员', 'id': 2}],
        addUserType: '',
        editUserType: '',
        addUserFormRules: {
          'header': [
            {required: true, message: '员工头像不能为空', trigger: 'blur'}
          ],
          'name': [
            {required: true, message: '请输入员工名称', trigger: 'blur'},
            {min: 2, max: 10, message: '姓名在 2 到 10 个字符', trigger: 'blur'}
          ],
          'phone': [
            {required: true, message: '请输入手机号', trigger: 'blur'},
            {min: 11, max: 11, message: '手机号长度11位', trigger: 'blur'}
          ],
          'card': [
            {required: true, message: '请输入身份证号', trigger: 'blur'}
          ],
          'work_years': [
            {required: true, message: '请输入执教年限', trigger: 'blur'}
          ],
          'resident_snow': [
            {required: true, message: '请输入常驻雪地', trigger: 'blur'}
          ],
          'desc': [
            {required: true, message: '请输入员工简介', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      resetAddData () {
        if (this.addDialogVisible) {
          this.$refs.addUserFormRef.resetFields()
        }
      },
      resetEditData () {
        if (this.editDialogVisible) {
          this.$refs.editUserFormRef.resetFields()
        }
      },
      async getUserList () {
        const {data: res} = await this.$http.get('user/list', {'params': this.queryParams})
        this.verifyLogin(res)
        if (res.status !== 200) {
          this.$message.error(res.msg)
          return false
        }
        this.userList = res.result.data
        this.totalCount = res.result.totalCount
      },
      handleSizeChange (newLimit) {
        this.queryParams.limit = newLimit
        this.getUserList()
      },
      handleCurrentChange (newPage) {
        this.queryParams.page = newPage
        this.getUserList()
      },
      addUser () {
        this.$refs.addUserFormRef.validate(async valid => {
          this.addUserForm.is_resident = this.addUserType
          if (!valid) {
            return false
          }
          const {data: res} = await this.$http.post('user/add', this.addUserForm)
          this.verifyLogin(res)
          if (res.status !== 200) {
            this.$message.error(res.msg)
            return false
          }
          this.addDialogVisible = false
          this.getUserList()
          this.$message.success(res.msg)
        })
      },
      async getUserInfoById (id) {
        const {data: res} = await this.$http.get('user/id', {params: {id: id}})
        this.verifyLogin(res)
        if (res.status !== 200) {
          this.$message.error(res.msg)
          return false
        }
        res.result.password = ''
        this.editUserForm = res.result
        this.editUserType = res.result.is_resident
        this.editDialogVisible = true
      },
      editUser () {
        this.$refs.editUserFormRef.validate(async valid => {
          this.editUserForm.is_resident = this.editUserType
          if (!valid) {
            return false
          }
          const {data: res} = await this.$http.post('user/edit', this.editUserForm)
          this.verifyLogin(res)
          if (res.status !== 200) {
            this.$message.error(res.msg)
            return false
          }
          this.editDialogVisible = false
          this.getUserList()
          this.$message.success(res.msg)
        })
      },
      async del (id) {
        const result = await this.$confirm('此操作将永久删除该员工, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(error => error)
        if (result !== 'confirm') {
          this.$message.info('已取消删除')
          return false
        }
        const {data: res} = await this.$http.post('user/del', {id: id})
        this.verifyLogin(res)
        if (res.status !== 200) {
          this.$message.error(res.msg)
          return false
        }
        this.getUserList()
        this.$message.success(res.msg)
      },
      addHandlePreview (file) {
        this.uploadUrl = file.response.result
        this.uploadDialogVisible = true
      },
      addHandleRemove (file) {
        this.addUserForm.header = ''
      },
      editHandleRemove (file) {
        this.editUserForm.header = ''
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
      addHandleSuccess (response) {
        this.addUserForm.header = response.result
      },
      editHandleSuccess (response) {
        this.editUserForm.header = response.result
      },
      getUserInfo () {
        this.addUserForm = {}
        this.addUserType = ''
        this.addDialogVisible = true
      }
    }
  }
</script>

<style scoped>
  .uploadImg {
    width: 100%
  }
</style>
