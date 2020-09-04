<template>
  <div>
    <!--    面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>配置中心</el-breadcrumb-item>
      <el-breadcrumb-item>课程管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片区域-->
    <el-card class="box-card">
      <!--      搜索、新增-->
      <el-row :gutter="20">
        <el-col :span="9">
          <el-input placeholder="请输入内容" v-model="queryParams.query" clearable @clear="getBannerList">
            <el-button slot="append" icon="el-icon-search" @click="getBannerList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="getBannerInfo">新增Banner</el-button>
        </el-col>
      </el-row>
      <!--      列表-->
      <el-table :data="BannerList" stripe border style="width: 100%">
        <el-table-column prop="number" label="序号" align="center"></el-table-column>
        <el-table-column label="图片" align="center">
          <template slot-scope="scope">
            <el-image :src="scope.row.pic"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" align="center"></el-table-column>
        <el-table-column prop="link" label="链接" align="center"></el-table-column>
        <el-table-column label="操作" width="200px" align="center">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="getBannerInfoById(scope.row.id)">编辑
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
    <el-dialog title="添加Banner" :visible.sync="addDialogVisible" width="50%" @close="resetAddData">
      <el-form :model="addBannerForm" :rules="addBannerFormRules" ref="addBannerFormRef" label-width="120px">
        <el-form-item label="图片" prop="header">
          <el-upload action="http://www.hhh.com/management/upload/uploadFile" :on-preview="addHandlePreview"
                     :on-remove="addHandleRemove" list-type="picture" name="image" :on-success="addHandleSuccess">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="序号" prop="number">
          <el-select v-model="addBannerType" placeholder="请选择banner序号">
            <el-option v-for="item in allType" :key="item.id" :value="item.id" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="addBannerForm.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="链接" prop="link">
          <el-input v-model="addBannerForm.link" placeholder="请输入标题"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="resetAddData">重置</el-button>
        <el-button type="primary" @click="addBanner">确定</el-button>
      </span>
    </el-dialog>
    <!--    dialog编辑弹窗-->
    <el-dialog title="编辑Banner" :visible.sync="editDialogVisible" width="50%" @close="resetEditData">
      <el-form :model="editBannerForm" :rules="editBannerFormRules" ref="editBannerFormRef" label-width="120px">
        <el-form-item label="图片" prop="header">
          <el-upload action="http://www.hhh.com/management/upload/uploadFile" :on-preview="addHandlePreview"
                     :on-remove="editHandleRemove" list-type="picture" name="image" :on-success="editHandleSuccess">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="序号" prop="number">
          <el-select v-model="editBannerType" placeholder="请选择banner序号">
            <el-option v-for="item in allType" :key="item.id" :value="item.id" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="editBannerForm.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="链接" prop="link">
          <el-input v-model="editBannerForm.link" placeholder="请输入标题"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="resetEditData">重置</el-button>
        <el-button type="primary" @click="editBanner">确定</el-button>
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
      this.getBannerList()
    },
    data () {
      return {
        queryParams: {
          query: '',
          limit: 10,
          page: 1
        },
        BannerList: [],
        totalCount: 0,
        addDialogVisible: false,
        editDialogVisible: false,
        imageUrl: '',
        addBannerForm: {
          header: '',
          title: '',
          number: '',
          link: ''
        },
        editBannerForm: {},
        uploadUrl: '',
        uploadDialogVisible: false,
        allType: [{'name': '1', 'id': 1}, {'name': '2', 'id': 2}, {'name': '3', 'id': 3}, {'name': '4', 'id': 4}, {'name': '5', 'id': 5}, {'name': '6', 'id': 6}],
        editBannerType: '',
        addBannerType: '',
        addBannerFormRules: {
          'title': [
            {required: true, message: '请输入Banner标题', trigger: 'blur'}
          ],
          'link': [
            {required: true, message: '请输入Banner跳转链接', trigger: 'blur'}
          ]
        },
        editBannerFormRules: {
          'title': [
            {required: true, message: '请输入Banner标题', trigger: 'blur'}
          ],
          'link': [
            {required: true, message: '请输入Banner跳转链接', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      resetAddData () {
        if (this.addDialogVisible) {
          this.$refs.addBannerFormRef.resetFields()
        }
      },
      resetEditData () {
        if (this.editDialogVisible) {
          this.$refs.editBannerFormRef.resetFields()
        }
      },
      async getBannerList () {
        const {data: res} = await this.$http.get('banner/list', {'params': this.queryParams})
        this.verifyLogin(res)
        if (res.status !== 200) {
          this.$message.error(res.msg)
          return false
        }
        this.BannerList = res.result.data
        this.totalCount = res.result.totalCount
      },
      handleSizeChange (newLimit) {
        this.queryParams.limit = newLimit
        this.getBannerList()
      },
      handleCurrentChange (newPage) {
        this.queryParams.page = newPage
        this.getBannerList()
      },
      addBanner () {
        this.$refs.addBannerFormRef.validate(async valid => {
          this.addBannerForm.number = this.addBannerType
          if (!valid) {
            return false
          }
          const {data: res} = await this.$http.post('banner/add', this.addBannerForm)
          this.verifyLogin(res)
          if (res.status !== 200) {
            this.$message.error(res.msg)
            return false
          }
          this.addDialogVisible = false
          this.getBannerList()
          this.$message.success(res.msg)
        })
      },
      async getBannerInfoById (id) {
        const {data: res} = await this.$http.get('banner/id', {params: {id: id}})
        this.verifyLogin(res)
        if (res.status !== 200) {
          this.$message.error(res.msg)
          return false
        }
        this.editBannerForm = res.result
        this.editBannerType = res.result.number
        this.editBannerForm.header = res.result.pic
        this.editDialogVisible = true
      },
      editBanner () {
        this.$refs.editBannerFormRef.validate(async valid => {
          this.editBannerForm.number = this.editBannerType
          if (!valid) {
            return false
          }
          const {data: res} = await this.$http.post('banner/edit', this.editBannerForm)
          this.verifyLogin(res)
          if (res.status !== 200) {
            this.$message.error(res.msg)
            return false
          }
          this.editDialogVisible = false
          this.getBannerList()
          this.$message.success(res.msg)
        })
      },
      async del (id) {
        const result = await this.$confirm('此操作将永久删除该banner, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(error => error)
        if (result !== 'confirm') {
          this.$message.info('已取消删除')
          return false
        }
        const {data: res} = await this.$http.post('banner/del', {id: id})
        this.verifyLogin(res)
        if (res.status !== 200) {
          this.$message.error(res.msg)
          return false
        }
        this.getBannerList()
        this.$message.success(res.msg)
      },
      addHandlePreview (file) {
        this.uploadUrl = file.response.result
        this.uploadDialogVisible = true
      },
      addHandleRemove (file) {
        this.addBannerForm.header = ''
      },
      editHandleRemove (file) {
        this.editBannerForm.header = ''
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
        this.addBannerForm.header = response.result
      },
      editHandleSuccess (response) {
        this.editBannerForm.header = response.result
      },
      getBannerInfo () {
        this.addBannerForm = {}
        this.addBannerType = ''
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
