<template>
  <div>
    <!--    面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>配置中心</el-breadcrumb-item>
      <el-breadcrumb-item>考题管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片区域-->
    <el-card class="box-card">
      <!--      搜索、新增-->
      <el-row :gutter="20">
        <el-col :span="9">
          <el-input placeholder="请输入内容" v-model="queryParams.query" clearable @clear="getQuestionList">
            <el-button slot="append" icon="el-icon-search" @click="getQuestionList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="getQuestionInfo">新增考题</el-button>
        </el-col>
      </el-row>
      <!--      列表-->
      <el-table :data="questionList" stripe border style="width: 100%">
        <el-table-column prop="rank" label="序号" align="center"></el-table-column>
        <el-table-column prop="content" label="题目内容" align="center"></el-table-column>
        <el-table-column prop="option_A" label="选项A" align="center"></el-table-column>
        <el-table-column prop="option_B" label="选项B" align="center"></el-table-column>
        <el-table-column prop="option_C" label="选项C" align="center"></el-table-column>
        <el-table-column prop="option_D" label="选项D" align="center"></el-table-column>
        <el-table-column prop="answer" label="正确答案" align="center"></el-table-column>
        <el-table-column label="操作" width="200px" align="center">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="getQuestionInfoById(scope.row.id)">编辑
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
    <el-dialog title="添加考题" :visible.sync="addDialogVisible" width="50%" @close="resetAddData">
      <el-form :model="addQuestionForm" :rules="addQuestionFormRules" ref="addQuestionFormRef" label-width="120px">
        <el-form-item label="内容" prop="content">
          <el-input v-model="addQuestionForm.content" placeholder="请输入考题内容" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="addQuestionType" placeholder="请选择考题类型">
            <el-option v-for="item in allType" :key="item.id" :value="item.id" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选项A" prop="option_A">
          <el-input v-model="addQuestionForm.option_A" placeholder="请输入选项A"></el-input>
        </el-form-item>
        <el-form-item label="选项B" prop="option_B">
          <el-input v-model="addQuestionForm.option_B" placeholder="请输入选项B"></el-input>
        </el-form-item>
        <el-form-item label="选项C" prop="option_C">
          <el-input v-model="addQuestionForm.option_C" placeholder="请输入选项C"></el-input>
        </el-form-item>
        <el-form-item label="选项D" prop="option_D">
          <el-input v-model="addQuestionForm.option_D" placeholder="请输入选项D"></el-input>
        </el-form-item>
        <el-form-item label="正确答案" prop="answer">
          <el-input v-model="addQuestionForm.answer" placeholder="请输入正确答案" style="width:140px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="resetAddData">重置</el-button>
        <el-button type="primary" @click="addQuestion">确定</el-button>
      </span>
      <span style="color: red">
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注意：多选题的正确答案用英文逗号隔开,
          判断题仅需输入正确答案即可：A代表正确,B代表错误
      </span>
    </el-dialog>
    <!--    dialog编辑弹窗-->
    <el-dialog title="添加考题" :visible.sync="editDialogVisible" width="50%" @close="resetEditData">
      <el-form :model="editQuestionForm" :rules="editQuestionFormRules" ref="editQuestionFormRef" label-width="120px">
        <el-form-item label="内容" prop="content">
          <el-input v-model="editQuestionForm.content" placeholder="请输入课程名称" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="editQuestionType" placeholder="请选择课程等级">
            <el-option v-for="item in allType" :key="item.id" :value="item.id" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选项A" prop="option_A">
          <el-input v-model="editQuestionForm.option_A" placeholder="请输入选项A"></el-input>
        </el-form-item>
        <el-form-item label="选项B" prop="option_B">
          <el-input v-model="editQuestionForm.option_B" placeholder="请输入选项B"></el-input>
        </el-form-item>
        <el-form-item label="选项C" prop="option_C">
          <el-input v-model="editQuestionForm.option_C" placeholder="请输入选项C"></el-input>
        </el-form-item>
        <el-form-item label="选项D" prop="option_D">
          <el-input v-model="editQuestionForm.option_D" placeholder="请输入选项D"></el-input>
        </el-form-item>
        <el-form-item label="正确答案" prop="answer">
          <el-input v-model="editQuestionForm.answer" placeholder="请输入正确答案" style="width:140px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="resetEditData">重置</el-button>
        <el-button type="primary" @click="editQuestion">确定</el-button>
      </span>
      <span style="color: red">
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注意：多选题的正确答案用英文逗号隔开,
          判断题仅需输入正确答案即可：A代表正确,B代表错误
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
      this.getQuestionList()
    },
    data () {
      return {
        queryParams: {
          query: '',
          limit: 10,
          page: 1
        },
        questionList: [],
        totalCount: 0,
        addDialogVisible: false,
        editDialogVisible: false,
        beforeAvatarUpload: false,
        handleAvatarSuccess: false,
        imageUrl: '',
        addQuestionForm: {
          content: '',
          option_A: '',
          option_B: '',
          option_C: '',
          option_D: '',
          type: '',
          answer: ''
        },
        editQuestionForm: {},
        uploadUrl: '',
        uploadDialogVisible: false,
        allType: [{'name': '单选', 'id': 0}, {'name': '多选', 'id': 1}, {'name': '判断', 'id': 2}],
        addQuestionType: '',
        editQuestionType: '',
        addQuestionFormRules: {
          'content': [
            {required: true, message: '请输入题目内容', trigger: 'blur'}
          ],
          'answer': [
            {required: true, message: '请输入正确答案', trigger: 'blur'}
          ]
        },
        editQuestionFormRules: {
          'content': [
            {required: true, message: '请输入题目内容', trigger: 'blur'}
          ],
          'answer': [
            {required: true, message: '请输入正确答案', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      resetAddData () {
        if (this.addDialogVisible) {
          this.$refs.addQuestionFormRef.resetFields()
        }
      },
      resetEditData () {
        if (this.editDialogVisible) {
          this.$refs.editQuestionFormRef.resetFields()
        }
      },
      async getQuestionList () {
        const {data: res} = await this.$http.get('question/list', {'params': this.queryParams})
        this.verifyLogin(res)
        if (res.status !== 200) {
          this.$message.error(res.msg)
          return false
        }
        this.questionList = res.result.data
        this.totalCount = res.result.totalCount
      },
      handleSizeChange (newLimit) {
        this.queryParams.limit = newLimit
        this.getQuestionList()
      },
      handleCurrentChange (newPage) {
        this.queryParams.page = newPage
        this.getQuestionList()
      },
      addQuestion () {
        this.$refs.addQuestionFormRef.validate(async valid => {
          this.addQuestionForm.type = this.addQuestionType
          if (!valid) {
            return false
          }
          const {data: res} = await this.$http.post('question/add', this.addQuestionForm)
          this.verifyLogin(res)
          if (res.status !== 200) {
            this.$message.error(res.msg)
            return false
          }
          this.addDialogVisible = false
          this.getQuestionList()
          this.$message.success(res.msg)
        })
      },
      async getQuestionInfoById (id) {
        const {data: res} = await this.$http.get('question/id', {params: {id: id}})
        this.verifyLogin(res)
        if (res.status !== 200) {
          this.$message.error(res.msg)
          return false
        }
        this.editQuestionForm = res.result
        this.editQuestionType = this.editQuestionForm.type
        this.editDialogVisible = true
      },
      editQuestion () {
        this.$refs.editQuestionFormRef.validate(async valid => {
          this.editQuestionForm.type = this.editQuestionType
          if (!valid) {
            return false
          }
          const {data: res} = await this.$http.post('question/edit', this.editQuestionForm)
          this.verifyLogin(res)
          if (res.status !== 200) {
            this.$message.error(res.msg)
            return false
          }
          this.editDialogVisible = false
          this.getQuestionList()
          this.$message.success(res.msg)
        })
      },
      async del (id) {
        const result = await this.$confirm('此操作将永久删除该考题, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(error => error)
        if (result !== 'confirm') {
          this.$message.info('已取消删除')
          return false
        }
        const {data: res} = await this.$http.post('question/del', {id: id})
        this.verifyLogin(res)
        if (res.status !== 200) {
          this.$message.error(res.msg)
          return false
        }
        this.getQuestionList()
        this.$message.success(res.msg)
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
      getQuestionInfo () {
        this.addQuestionForm = {}
        this.addQuestionType = ''
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
