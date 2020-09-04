<template>
  <div>
    <!--    面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>排课系统</el-breadcrumb-item>
      <el-breadcrumb-item>管理员课表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片区域-->
    <el-card class="box-card">
      <!--      搜索-->
      <el-form :inline="true">
        <el-form-item label="城市">
          <el-select v-model="cityType" placeholder="请选择城市" @change="getSnowByCid(cityType)">
            <el-option v-for="(item, key) in allCity" :key="key" :value="key" :label="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="雪地">
          <el-select v-model="queryParams.snow_id" placeholder="请先选择城市" :disabled="isDisabled">
            <el-option v-for="(item, key) in allSnow" :key="key" :value="key" :label="item"></el-option>
          </el-select>
        </el-form-item>
          <el-form-item>
              <el-date-picker v-model="queryParams.time" align="right" type="date" placeholder="请选择日期" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getHistoryCourseList">查询</el-button>
        </el-form-item>
      </el-form>
      <!--      列表-->
      <el-table :data="historyCourseList" stripe border style="width: 100%">
        <el-table-column prop="coachName" label="教练" align="center"></el-table-column>
        <el-table-column prop="coachType" label="类型" align="center"></el-table-column>
        <el-table-column prop="name" label="课程" align="center"></el-table-column>
        <el-table-column prop="snowName" label="雪地" align="center"></el-table-column>
        <el-table-column prop="stuName" label="报名学员" align="center"></el-table-column>
        <el-table-column prop="count" label="报名人数" align="center"></el-table-column>
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
        :page-sizes="[10, 15, 20, 30]"
        :page-size="queryParams.limit"
        layout="total,sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
  export default {
    created () {
      this.getHistoryCourseList()
      this.getSnowCity()
    },
    data () {
      return {
        queryParams: {
          snow_id: '',
          time: '',
          limit: 10,
          page: 1
        },
        historyCourseList: [],
        totalCount: 0,
        cityType: '',
        allCity: {},
        allSnow: {},
        snowType: '',
        dateType: '',
        isDisabled: true
      }
    },
    methods: {
      async getHistoryCourseList () {
        const {data: res} = await this.$http.get('class/allCourseList', {'params': this.queryParams})
        this.verifyLogin(res)
        if (res.status !== 200) {
          this.$message.error(res.msg)
          return false
        }
        this.historyCourseList = res.result.data
        this.totalCount = res.result.totalCount
      },
      handleSizeChange (newLimit) {
        this.queryParams.limit = newLimit
        this.getHistoryCourseList()
      },
      handleCurrentChange (newPage) {
        this.queryParams.page = newPage
        this.getHistoryCourseList()
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
      async getSnowCity() {
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
      async delCourse (id) {
        const {data: res} = await this.$http.get('class/del', {'params': {'class_id': id}})
        this.verifyLogin(res)
        if (res.status !== 200) {
          this.$message.error(res.msg)
          return false
        }
        this.getHistoryCourseList()
        this.$message.success(res.msg)
      }
    }
  }
</script>

<style scoped>

</style>
