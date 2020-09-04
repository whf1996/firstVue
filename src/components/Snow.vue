<template>
  <div>
    <!--    面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>配置中心</el-breadcrumb-item>
      <el-breadcrumb-item>雪地管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片区域-->
    <el-card class="box-card">
      <!--      搜索、新增-->
      <el-row :gutter="20">
        <el-col :span="9">
          <el-input placeholder="请输入内容" v-model="queryParams.query" clearable @clear="getSnowList">
            <el-button slot="append" icon="el-icon-search" @click="getSnowList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="getSnwoInfo">新增雪地</el-button>
        </el-col>
      </el-row>
      <!--      列表-->
      <el-table :data="userList" stripe border style="width: 100%">
        <el-table-column prop="name" label="名称" align="center"></el-table-column>
        <el-table-column prop="city" label="所在城市" align="center"></el-table-column>
        <el-table-column prop="addr" label="详细地址" align="center"></el-table-column>
        <el-table-column prop="workday_time" label="营业时间" align="center"></el-table-column>
        <el-table-column label="宣传图片" align="center">
          <template slot-scope="scope">
            <div v-for="(item, key) in JSON.parse(scope.row.photo)" :key="key">
              <el-image :src="item"></el-image>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="desc" label="雪地介绍" width="300px" align="center"></el-table-column>
        <el-table-column label="操作" width="100px" align="center">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="getSnowInfoById(scope.row.id)">编辑
            </el-button>
            <br>
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
    <el-dialog title="添加雪地" :visible.sync="addDialogVisible" width="50%" @close="resetAddData">
      <el-form :model="addSnowForm" :rules="addSnowFormRules" ref="addSnowFormRef" label-width="120px">
        <el-form-item label="雪地图片" prop="header">
          <el-upload action="http://www.hhh.com/management/upload/uploadFile" :on-preview="addHandlePreview"
                     :on-remove="addHandleRemove" list-type="picture" name="image" :on-success="addHandleSuccess">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <br>
        <el-form-item label="名称" prop="name">
          <el-input v-model="addSnowForm.name" placeholder="请输入雪地名称"></el-input>
        </el-form-item>
        <el-form-item label="省份" prop="addProvinceType">
          <el-select v-model="addProvinceType" placeholder="请输入省份" @change="getCityByPid(addProvinceType)">
            <el-option v-for="(item, key) in allProvince" :key="key" :value="key" :label="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="城市" prop="addCityType">
          <el-select v-model="addCityType" placeholder="先输入省份" :disabled="isDisabled">
            <el-option v-for="(item, key) in allCity" :key="key" :value="item.cityid" :label="item.city"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="营业时间" prop="workday_time">
          <el-time-picker is-range v-model="addSnowForm.workday_time" clearable range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围" value-format="HH:mm:ss"></el-time-picker>
        </el-form-item>
        <el-form-item label="地址" prop="addr">
          <el-input v-model="addSnowForm.addr" placeholder="请输入雪地地址"></el-input>
        </el-form-item>
        <el-form-item label="雪地简介" prop="desc">
          <el-input type="textarea" v-model="addSnowForm.desc" placeholder="请输入雪地简介"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="resetAddData">重置</el-button>
        <el-button type="primary" @click="addSnow">确定</el-button>
      </span>
    </el-dialog>
    <!--    dialog编辑弹窗-->
    <el-dialog title="修改雪地" :visible.sync="editDialogVisible" width="50%" @close="resetAddData">
      <el-form :model="editSnowForm" :rules="editSnowFormRules" ref="editSnowFormRef" label-width="120px">
        <el-form-item label="雪地图片" prop="header">
          <el-upload action="http://www.hhh.com/management/upload/uploadFile" :on-preview="addHandlePreview"
                     :on-remove="addHandleRemove" list-type="picture" name="image" :on-success="editHandleSuccess">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <br>
        <el-form-item label="名称" prop="name">
          <el-input v-model="editSnowForm.name" placeholder="请输入雪地名称"></el-input>
        </el-form-item>
        <el-form-item label="省份" prop="provinceid">
          <el-select v-model="editProvinceType" placeholder="请输入省份" @change="getCityByPid(editProvinceType, 1)">
            <el-option v-for="(item, key) in allProvince" :key="key" :value="key" :label="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="城市" prop="cityid">
          <el-select v-model="editCityType" placeholder="先输入省份">
            <el-option v-for="(item, key) in allCity" :key="key" :value="item.cityid" :label="item.city"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="营业时间" prop="workday_time">
          <el-time-picker is-range v-model="editSnowForm.workday_time" clearable range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围" value-format="HH:mm"></el-time-picker>
        </el-form-item>
        <el-form-item label="地址" prop="addr">
          <el-input v-model="editSnowForm.addr" placeholder="请输入雪地地址"></el-input>
        </el-form-item>
        <el-form-item label="雪地简介" prop="desc">
          <el-input type="textarea" v-model="editSnowForm.desc" placeholder="请输入雪地简介"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="resetEditData">重置</el-button>
        <el-button type="primary" @click="editSnow">确定</el-button>
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
      this.getSnowList()
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
        addSnowForm: {
          header: '',
          name: '',
          addr: '',
          provinceid: '',
          cityid: '',
          desc: '',
          workday_time: ''
        },
        fileList: [],
        editSnowForm: {},
        uploadUrl: '',
        uploadDialogVisible: false,
        allProvince: {},
        allCity: [],
        addProvinceType: '',
        addCityType: '',
        editProvinceType: '',
        editCityType: '',
        isDisabled: true,
        addSnowFormRules: {
          'name': [
            {required: true, message: '请输入雪地名称', trigger: 'blur'}
          ],
          'provinceid': [
            {required: true, message: '请输入省份', trigger: 'blur'}
          ],
          'cityid': [
            {required: true, message: '请输入城市', trigger: 'blur'}
          ],
          'addr': [
            {required: true, message: '请输入地址', trigger: 'blur'}
          ],
          'desc': [
            {required: true, message: '请输入员工简介', trigger: 'blur'}
          ]
        },
        editSnowFormRules: {
          'name': [
            {required: true, message: '请输入雪地名称', trigger: 'blur'}
          ],
          'provinceid': [
            {required: true, message: '请输入省份', trigger: 'blur'}
          ],
          'cityid': [
            {required: true, message: '请输入城市', trigger: 'blur'}
          ],
          'addr': [
            {required: true, message: '请输入地址', trigger: 'blur'}
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
          this.$refs.addSnowFormRef.resetFields()
        }
      },
      resetEditData () {
        if (this.editDialogVisible) {
          this.$refs.editSnowFormRef.resetFields()
        }
      },
      async getSnowList () {
        const {data: res} = await this.$http.get('snow/list', {'params': this.queryParams})
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
        this.getSnowList()
      },
      handleCurrentChange (newPage) {
        this.queryParams.page = newPage
        this.getSnowList()
      },
      addSnow () {
        this.$refs.addUserFormRef.validate(async valid => {
          this.addSnowForm.provinceid = this.addProvinceType
          this.addSnowForm.cityid = this.addCityType
          this.addSnowForm.header = JSON.stringify(this.fileList)
          this.addSnowForm.workday_time = this.addSnowForm.workday_time[0] + '-' + this.addSnowForm.workday_time[1]
          if (!valid) {
            return false
          }
          const {data: res} = await this.$http.post('snow/add', this.addSnowForm)
          this.verifyLogin(res)
          if (res.status !== 200) {
            this.$message.error(res.msg)
            return false
          }
          this.addDialogVisible = false
          this.getSnowList()
          this.$message.success(res.msg)
        })
      },
      async getSnowInfoById (id) {
        const {data: res} = await this.$http.get('snow/id', {params: {id: id}})
        this.verifyLogin(res)
        if (res.status !== 200) {
          this.$message.error(res.msg)
          return false
        }
        this.getAllProvince()
        this.getCityByPid(res.result.provinceid)
        this.editSnowForm = res.result
        this.editProvinceType = res.result.provinceid
        this.editCityType = res.result.cityid
        this.editSnowForm.workday_time = res.result.workday_time.split('-')
        this.fileList = JSON.parse(res.result.photo)
        this.isDisabled = false
        this.editDialogVisible = true
      },
      editSnow () {
        this.$refs.editSnowFormRef.validate(async valid => {
          this.editSnowForm.provinceid = this.editProvinceType
          this.editSnowForm.cityid = this.editCityType
          this.editSnowForm.header = JSON.stringify(this.fileList)
          this.editSnowForm.workday_time = this.editSnowForm.workday_time[0] + '-' + this.editSnowForm.workday_time[1]
          console.log(this.editSnowForm)
          if (!valid) {
            return false
          }
          const {data: res} = await this.$http.post('snow/edit', this.editSnowForm)
          this.verifyLogin(res)
          if (res.status !== 200) {
            this.$message.error(res.msg)
            return false
          }
          this.editDialogVisible = false
          this.getSnowList()
          this.$message.success(res.msg)
        })
      },
      async del (id) {
        const result = await this.$confirm('此操作将永久删除该雪地, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(error => error)
        if (result !== 'confirm') {
          this.$message.info('已取消删除')
          return false
        }
        const {data: res} = await this.$http.post('snow/del', {id: id})
        this.verifyLogin(res)
        if (res.status !== 200) {
          this.$message.error(res.msg)
          return false
        }
        this.getSnowList()
        this.$message.success(res.msg)
      },
      addHandlePreview (file) {
        this.uploadUrl = file.response.result
        this.uploadDialogVisible = true
      },
      addHandleRemove (file) {
        const currentUrl = file.response.result
        const index = this.fileList.findIndex(x => x === currentUrl)
        this.fileList.splice(index, 1)
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
        this.fileList.push(response.result)
      },
      editHandleSuccess (response) {
        this.fileList.push(response.result)
        console.log(this.fileList)
      },
      getSnwoInfo () {
        this.fileList = []
        this.addSnowForm = {}
        this.addProvinceType = ''
        this.addCityType = ''
        this.addDialogVisible = true
        this.getAllProvince()
      },
      async getAllProvince () {
        const {data: res} = await this.$http.get('city/allProvince')
        this.verifyLogin(res)
        if (res.status !== 200) {
          this.$message.error(res.msg)
          return false
        }
        this.allProvince = res.result
      },
      async getCityByPid (provinceid, flag = 0) {
        const {data: res} = await this.$http.get('city/getCitysByPid', {'params': {'provinceid': provinceid}})
        this.verifyLogin(res)
        if (res.status !== 200) {
          this.$message.error(res.msg)
          return false
        }
        this.addCityType = ''
        if (flag === 1) {
          this.editCityType = ''
        }
        this.isDisabled = false
        this.allCity = res.result
      }
    }
  }
</script>

<style scoped>
  .uploadImg {
    width: 100%
  }
</style>
