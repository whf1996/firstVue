<template>
  <div>
    <!--    面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>消息中心</el-breadcrumb-item>
      <el-breadcrumb-item>预约体验</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片区域-->
    <el-card class="box-card">
      <!--      搜索、新增-->
      <el-row :gutter="20">
        <el-col :span="9">
          <el-input placeholder="请输入内容" v-model="queryParams.query" clearable @clear="getReservationList">
            <el-button slot="append" icon="el-icon-search" @click="getReservationList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!--      列表-->
      <el-table :data="reservationList" stripe border style="width: 100%">
        <el-table-column prop="name" label="姓名" align="center"></el-table-column>
        <el-table-column prop="city" label="所在城市" align="center"></el-table-column>
        <el-table-column prop="phone" label="联系电话" align="center"></el-table-column>
        <el-table-column prop="experience" label="有无经验" align="center"></el-table-column>
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
  </div>
</template>

<script>
  export default {
    created () {
      this.getReservationList()
    },
    data () {
      return {
        queryParams: {
          query: '',
          limit: 10,
          page: 1
        },
        reservationList: [],
        totalCount: 0
      }
    },
    methods: {
      async getReservationList () {
        const {data: res} = await this.$http.get('message/reservationIndex', {'params': this.queryParams})
        this.verifyLogin(res)
        if (res.status !== 200) {
          this.$message.error(res.msg)
          return false
        }
        this.reservationList = res.result.data
        this.totalCount = res.result.totalCount
      },
      handleSizeChange (newLimit) {
        this.queryParams.limit = newLimit
        this.getReservationList()
      },
      handleCurrentChange (newPage) {
        this.queryParams.page = newPage
        this.getReservationList()
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
      }
    }
  }
</script>

<style scoped>

</style>
