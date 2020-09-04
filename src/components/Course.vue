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
          <el-input placeholder="请输入内容" v-model="queryParams.query" clearable @clear="getCourseList">
            <el-button slot="append" icon="el-icon-search" @click="getCourseList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="getCourseInfo">新增课程</el-button>
        </el-col>
      </el-row>
      <!--      列表-->
      <el-table :data="courseList" stripe border style="width: 100%">
        <el-table-column label="图片" align="center">
          <template slot-scope="scope">
            <el-image :src="scope.row.photo"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" align="center"></el-table-column>
        <el-table-column prop="price" label="价格" align="center"></el-table-column>
        <el-table-column prop="level" label="等级" align="center"></el-table-column>
        <el-table-column prop="course_time" label="时长" align="center"></el-table-column>
        <el-table-column label="操作" width="200px" align="center">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="getCourseInfoById(scope.row.id)">编辑
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
    <el-dialog title="添加课程" :visible.sync="addDialogVisible" width="50%" @close="resetAddData">
      <el-form :model="addCourseForm" :rules="addCourseFormRules" ref="addCourseFormRef" label-width="120px">
        <el-form-item label="头像" prop="header">
          <el-upload action="http://www.hhh.com/management/upload/uploadFile" :on-preview="addHandlePreview"
                     :on-remove="addHandleRemove" list-type="picture" name="image" :on-success="addHandleSuccess">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <br>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addCourseForm.name" placeholder="请输入课程名称"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="addCourseForm.price" placeholder="请输入课程价格" style="width:140px"></el-input>
        </el-form-item>
        <el-form-item label="课程等级" prop="level">
          <el-select v-model="addLevelType" placeholder="请选择课程等级">
            <el-option v-for="item in allLevel" :key="item.id" :value="item.id" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程时长" prop="course_time">
          <el-select v-model="addCourseTimeType" placeholder="请选择课程时长">
            <el-option v-for="item in allCourseTime" :key="item.id" :value="item.id" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程周期" prop="circle">
          <el-select v-model="addCircleType" placeholder="请选择课程周期">
            <el-option v-for="item in allCircle" :key="item.id" :value="item.id" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="resetAddData">重置</el-button>
        <el-button type="primary" @click="addCourse">确定</el-button>
      </span>
    </el-dialog>
    <!--    dialog编辑弹窗-->
    <el-dialog title="修改课程" :visible.sync="editDialogVisible" width="50%" @close="resetAddData">
      <el-form :model="editCourseForm" :rules="editCourseFormRules" ref="editCourseFormRef" label-width="120px">
        <el-form-item label="头像" prop="header">
          <el-upload action="http://www.hhh.com/management/upload/uploadFile" :on-preview="addHandlePreview"
                     :on-remove="editHandleRemove" list-type="picture" name="image" :on-success="editHandleSuccess">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <br>
        <el-form-item label="名称" prop="name">
          <el-input v-model="editCourseForm.name" placeholder="请输入课程名称"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="editCourseForm.price" placeholder="请输入课程价格" style="width:140px"></el-input>
        </el-form-item>
        <el-form-item label="课程等级" prop="level">
          <el-select v-model="editLevelType" placeholder="请选择课程等级">
            <el-option v-for="item in allLevel" :key="item.id" :value="item.id" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程时长" prop="course_time">
          <el-select v-model="editCourseTimeType" placeholder="请选择课程时长">
            <el-option v-for="item in allCourseTime" :key="item.id" :value="item.id" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程周期" prop="circle">
          <el-select v-model="editCircleType" placeholder="请选择课程周期">
            <el-option v-for="item in allCircle" :key="item.id" :value="item.id" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="resetEditData">重置</el-button>
        <el-button type="primary" @click="editCourse">确定</el-button>
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
      this.getCourseList()
    },
    data () {
      return {
        queryParams: {
          query: '',
          limit: 10,
          page: 1
        },
        courseList: [],
        totalCount: 0,
        addDialogVisible: false,
        editDialogVisible: false,
        beforeAvatarUpload: false,
        handleAvatarSuccess: false,
        imageUrl: '',
        addCourseForm: {
          header: '',
          name: '',
          price: '',
          level: '',
          course_time: '',
          circle: '',
          desc: ''
        },
        editCourseForm: {},
        uploadUrl: '',
        uploadDialogVisible: false,
        allLevel: [{'name': '第一等级', 'id': 0}, {'name': '第二等级', 'id': 1}, {'name': '第三等级', 'id': 2}, {'name': '第四等级', 'id': 3}],
        allCourseTime: [{'name': '3课时(半天)', 'id': 0}, {'name': '2*2课时(半天)', 'id': 1}, {'name': '2*2课时(五天)', 'id': 2}],
        allCircle: [{'name': '1', 'id': 0}, {'name': '5', 'id': 1}],
        editCircleType: '',
        editCourseTimeType: '',
        editLevelType: '',
        addCircleType: '',
        addCourseTimeType: '',
        addLevelType: '',
        addCourseFormRules: {
          'name': [
            {required: true, message: '请输入课程名称', trigger: 'blur'}
          ],
          'price': [
            {required: true, message: '请输入价格', trigger: 'blur'}
          ]
        },
        editCourseFormRules: {
          'name': [
            {required: true, message: '请输入课程名称', trigger: 'blur'}
          ],
          'price': [
            {required: true, message: '请输入价格', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      resetAddData () {
        if (this.addDialogVisible) {
          this.$refs.addCourseFormRef.resetFields()
        }
      },
      resetEditData () {
        if (this.editDialogVisible) {
          this.$refs.editCourseFormRef.resetFields()
        }
      },
      async getCourseList () {
        const {data: res} = await this.$http.get('course/list', {'params': this.queryParams})
        this.verifyLogin(res)
        if (res.status !== 200) {
          this.$message.error(res.msg)
          return false
        }
        var courseTimeArr = ['3课时(半天)', '2*2课时(半天)', '2*2课时(五天)']
        var levelArr = ['第一等级', '第二等级', '第三等级', '第四等级']
        for (let i in res.result.data) {
          res.result.data[i].course_time = courseTimeArr[res.result.data[i].course_time]
          res.result.data[i].level = levelArr[res.result.data[i].level]
        }
        this.courseList = res.result.data
        this.totalCount = res.result.totalCount
      },
      handleSizeChange (newLimit) {
        this.queryParams.limit = newLimit
        this.getCourseList()
      },
      handleCurrentChange (newPage) {
        this.queryParams.page = newPage
        this.getCourseList()
      },
      addCourse () {
        this.$refs.addCourseFormRef.validate(async valid => {
          this.addCourseForm.circle = this.addCircleType
          this.addCourseForm.course_time = this.addCourseTimeType
          this.addCourseForm.level = this.addLevelType
          if (!valid) {
            return false
          }
          const {data: res} = await this.$http.post('course/add', this.addCourseForm)
          this.verifyLogin(res)
          if (res.status !== 200) {
            this.$message.error(res.msg)
            return false
          }
          this.addDialogVisible = false
          this.getCourseList()
          this.$message.success(res.msg)
        })
      },
      async getCourseInfoById (id) {
        const {data: res} = await this.$http.get('course/id', {params: {id: id}})
        this.verifyLogin(res)
        if (res.status !== 200) {
          this.$message.error(res.msg)
          return false
        }
        this.editCourseForm = res.result
        this.editCourseForm.header = res.result.photo
        this.editCircleType = this.editCourseForm.circle
        this.editCourseTimeType = this.editCourseForm.course_time
        this.editLevelType = this.editCourseForm.level
        this.editDialogVisible = true
      },
      editCourse () {
        this.$refs.editCourseFormRef.validate(async valid => {
          this.editCourseForm.circle = this.editCircleType
          this.editCourseForm.course_time = this.editCourseTimeType
          this.editCourseForm.level = this.editLevelType
          if (!valid) {
            return false
          }
          const {data: res} = await this.$http.post('course/edit', this.editCourseForm)
          this.verifyLogin(res)
          if (res.status !== 200) {
            this.$message.error(res.msg)
            return false
          }
          this.editDialogVisible = false
          this.getCourseList()
          this.$message.success(res.msg)
        })
      },
      async del (id) {
        const result = await this.$confirm('此操作将永久删除该课程, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(error => error)
        if (result !== 'confirm') {
          this.$message.info('已取消删除')
          return false
        }
        const {data: res} = await this.$http.post('course/del', {id: id})
        this.verifyLogin(res)
        if (res.status !== 200) {
          this.$message.error(res.msg)
          return false
        }
        this.getCourseList()
        this.$message.success(res.msg)
      },
      addHandlePreview (file) {
        this.uploadUrl = file.response.result
        this.uploadDialogVisible = true
      },
      addHandleRemove (file) {
        this.addCourseForm.header = ''
      },
      editHandleRemove (file) {
        this.editCourseForm.header = ''
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
        this.addCourseForm.header = response.result
      },
      editHandleSuccess (response) {
        this.editCourseForm.header = response.result
      },
      getCourseInfo () {
        this.addCourseForm = {}
        this.addCircleType = ''
        this.addCourseTimeType = ''
        this.addLevelType = ''
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
