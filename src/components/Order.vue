<template>
  <div>
    <!--    面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>全部订单</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片区域-->
    <el-card class="box-card">
      <!--      搜索、新增-->
      <el-row :gutter="20">
        <el-col :span="9">
          <el-input placeholder="请输入内容" v-model="queryParams.query" clearable @clear="getOrderList">
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!--      列表-->
      <el-table :data="orderList" stripe border style="width: 100%">
        <el-table-column prop="student_name" label="学员" align="center"></el-table-column>
        <el-table-column prop="course_name" label="课程" align="center"></el-table-column>
        <el-table-column prop="amount" label="支付金额" align="center"></el-table-column>
        <el-table-column prop="create_time" label="下单时间" align="center"></el-table-column>
        <el-table-column prop="pay_time" label="支付时间" align="center"></el-table-column>
        <el-table-column prop="status_map" label="状态" align="center"></el-table-column>
        <el-table-column label="操作" width="100px" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="getProtocol(scope.row.id)">查看</el-button>
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
    <!--    查看协议-->
    <el-dialog title="协议内容" :visible.sync="protocolDialogVisible" width="50%">
      <span>{{protocol}}</span>
      <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="protocolDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    created () {
      this.getOrderList()
    },
    data () {
      return {
        queryParams: {
          query: '',
          limit: 10,
          page: 1
        },
        orderList: [],
        totalCount: 0,
        protocolDialogVisible: false,
        protocol: ''
      }
    },
    methods: {
      async getOrderList () {
        const {data: res} = await this.$http.get('order/list', {'params': this.queryParams})
        this.verifyLogin(res)
        if (res.status !== 200) {
          this.$message.error(res.msg)
          return false
        }
        res.result.data.forEach(v => { v.amount = '¥' + v.amount })
        this.orderList = res.result.data
        this.totalCount = res.result.totalCount
      },
      handleSizeChange (newLimit) {
        this.queryParams.limit = newLimit
        this.getOrderList()
      },
      handleCurrentChange (newPage) {
        this.queryParams.page = newPage
        this.getOrderList()
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
      async getProtocol (id) {
        const {data: res} = await this.$http.get('order/id', {'params': {'id': id}})
        this.verifyLogin(res)
        if (res.status !== 200) {
          this.$message.error(res.msg)
          return false
        }
        this.protocol = res.result.agreement
        this.protocolDialogVisible = true
      }
    }
  }
</script>

<style scoped>

</style>
