<template>
  <div>
    <!--    面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>排课系统</el-breadcrumb-item>
      <el-breadcrumb-item>教练课表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片区域-->
    <el-card class="box-card">
      <!--      搜索、新增-->
      <el-row :gutter="20">
        <el-col :span="9">
          <el-form :inline="true">
            <el-form-item>
              <el-date-picker v-model="queryParams.start_time" align="right" type="date" placeholder="请选择日期"
                              value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getCoachCourseList">查询</el-button>
            </el-form-item>
          </el-form>
          <el-button slot="append" icon="el-icon-search" @click="getCoachCourseList"></el-button>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="getClassInfo">排课</el-button>
        </el-col>
      </el-row>
      <!--      列表-->
      <el-table :data="coachCourseList" stripe border style="width: 100%">
        <el-table-column prop="name" label="课程" align="center"></el-table-column>
        <el-table-column prop="snowName" label="雪地" align="center"></el-table-column>
        <el-table-column prop="count" label="报名人数" align="center"></el-table-column>
        <el-table-column prop="max_count" label="课程最大人数" align="center"></el-table-column>
        <el-table-column prop="stuName" label="报名学员" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="danger" @click="delCourse(scope.row.id)">取消课程</el-button>
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
    <el-dialog title="排课" :visible.sync="addDialogVisible" width="50%" @close="resetAddData">
      <el-form :model="addCoachCourseForm" :rules="addCoachCourseRules" ref="addCoachCourseRef" label-width="120px"
               :inline="true">
        <el-form-item label="城市" prop="city">
          <el-select v-model="addCoachCourseForm.city" placeholder="请选择城市"
                     @change="getSnowByCid(addCoachCourseForm.city)">
            <el-option v-for="(item, key) in allCity" :key="key" :value="key" :label="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="雪场" prop="snow_id">
          <el-select v-model="addCoachCourseForm.snow_id" placeholder="请先选择城市" :disabled="isDisabled">
            <el-option v-for="(item, key) in allSnow" :key="key" :value="key" :label="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程" prop="course_id">
          <el-select v-model="addCoachCourseForm.course_id" placeholder="请选择课程">
            <el-option v-for="(item, key) in allCourse" :key="key" :value="key" :label="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始日期" prop="time">
          <el-date-picker v-model="addCoachCourseForm.start_time" align="right" type="date" placeholder="请选择日期"
                          value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="开课人数" prop="max_count">
          <el-input v-model="addCoachCourseForm.max_count" placeholder="请输入开课人数"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="resetAddData">重置</el-button>
        <el-button type="primary" @click="dealCourses">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    created () {
      this.getTodayTime()
      this.getCoachCourseList()
      this.getSnowCity()
      this.allCourse()
    },
    data () {
      return {
        queryParams: {
          start_time: '2020-08-30',
          limit: 10,
          page: 1
        },
        coachCourseList: [],
        totalCount: 0,
        addDialogVisible: false,
        allCity: {},
        allSnow: {},
        isDisabled: true,
        addCoachCourseForm: {
          city: '',
          snow_id: '',
          course_id: '',
          max_count: '',
          start_time: ''
        },
        addCoachCourseRules: {
          'city': [
            {required: true, message: '请选择城市', trigger: 'blur'}
          ],
          'snow_id': [
            {required: true, message: '请选择雪地', trigger: 'blur'}
          ],
          'course_id': [
            {required: true, message: '请选择课程', trigger: 'blur'}
          ],
          'max_count': [
            {required: true, message: '请输入开课人数', trigger: 'blur'}
          ],
          'start_time': [
            {required: true, message: '请选择开课时间', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      resetAddData () {
        if (this.addDialogVisible) {
          this.$refs.addCoachCourseRef.resetFields()
        }
      },
      async getCoachCourseList () {
        const {data: res} = await this.$http.get('class/list', {'params': this.queryParams})
        this.verifyLogin(res)
        if (res.status !== 200) {
          this.$message.error(res.msg)
          return false
        }
        this.coachCourseList = res.result
        this.totalCount = res.result.totalCount
      },
      handleSizeChange (newLimit) {
        this.queryParams.limit = newLimit
        this.getCoachCourseList()
      },
      handleCurrentChange (newPage) {
        this.queryParams.page = newPage
        this.getCoachCourseList()
      },
      dealCourses () {
        this.$refs.addCoachCourseRef.validate(async valid => {
          if (!valid) {
            return false
          }
          const {data: res} = await this.$http.post('class/dealCourses', this.addCoachCourseForm)
          this.verifyLogin(res)
          if (res.status !== 200) {
            this.$message.error(res.msg)
            return false
          }
          this.addDialogVisible = false
          this.getCoachCourseList()
          this.$message.success(res.msg)
        })
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
      async delCourse (id) {
        const {data: res} = await this.$http.get('class/del', {'params': {'class_id': id}})
        this.verifyLogin(res)
        if (res.status !== 200) {
          this.$message.error(res.msg)
          return false
        }
        this.getCoachCourseList()
        this.$message.success(res.msg)
      },
      async getSnowCity () {
        const {data: res} = await this.$http.get('class/getSnowCity')
        this.verifyLogin(res)
        if (res.status !== 200) {
          this.$message.error(res.msg)
          return false
        }
        this.allCity = res.result
      },
      async getSnowByCid (cid) {
        const {data: res} = await this.$http.get('class/getSnowIdByCId', {'params': {'cid': cid}})
        this.verifyLogin(res)
        if (res.status !== 200) {
          this.$message.error(res.msg)
          return false
        }
        this.isDisabled = false
        this.allSnow = res.result
      },
      async allCourse () {
        const {data: res} = await this.$http.get('course/allCourse')
        this.verifyLogin(res)
        if (res.status !== 200) {
          this.$message.error(res.msg)
          return false
        }
        this.allCourse = res.result
      },
      getClassInfo () {
        this.addCoachCourseForm = {}
        this.isDisabled = true
        this.addDialogVisible = true
      },
      getTodayTime () {
        let day = new Date()
        this.queryParams.start_time = day.getFullYear() + '-' + (day.getMonth() + 1) + '-' + day.getDate()
      }
    }
  }
</script>

<style scoped>
  .uploadImg {
    width: 100%
  }
</style>
