<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <hr />
    <el-card>
      <div>
        <el-row :gutter="30">
          <el-col :span="2">
            <el-button type="primary" icon="el-icon-circle-plus" @click="showAddcateDialog()">新增分类</el-button>
          </el-col>
        </el-row>
        <hr />
        <tree-table
          :data="category_list"
          :columns="columns"
          :selection-type="false"
          :show-row-hover="true"
          :expand-type="false"
          :show-index="true"
          :border="true"
        >
          <template slot="level" slot-scope="scope" class="tree-level">
            <el-tag v-if="scope.row.level === 1" type="primary">一级分类</el-tag>
            <el-tag v-else-if="scope.row.level === 2" type="warning">二级分类</el-tag>
            <el-tag v-else-if="scope.row.level === 3" type="danger">三级分类</el-tag>
          </template>
          <template slot="dosomethings">
            <el-button size="mini" type="success" icon="el-icon-edit" circle>修改分类</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" circle>删除分类</el-button>
          </template>
        </tree-table>
      </div>
      <el-dialog
      title="新增分类"
      :visible.sync="addCategoryDialogvisible"
      width="30%"
      :before-close="handleClose"
      >
      <el-form :model="addCateForm" :rules="addCateRules" ref="addCategoryRef">
        <el-form-item label="分类名称 " label-width="80px" prop="name">
          <el-input v-model="addCateForm.name"></el-input>
        </el-form-item>
        <el-form-item label="父类节点" label-width="80px" prop="pid">
          <!-- 级联选择器 -->
          <el-cascader
          v-model="seleceorKeys"
          :options="this.catePidList"
          :props="{ expandTrigger: 'hover', label: 'name', value: 'id', checkStrictly: true }"
          @change="changeSelecor"
          clearable
          :show-all-levels="false"></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleClose()">取 消</el-button>
          <el-button type="primary" @click="addCategory()">确 认</el-button>
      </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      category_list: [],
      columns: [
        { label: '分类名称', prop: 'name' },
        { label: '分类等级', type: 'template', template: 'level' },
        { label: '操作', type: 'template', template: 'dosomethings' },
      ],
      pnum: 1,
      psize: 10,
      total: 0,
      addCategoryDialogvisible: false,
      addCateRules: {
        name: [
          { required: true, message: '请输入商品分类名称', trigger: 'blur' }
        ],
        pid: [
          { required: true, message: '请选择商品类别', trigger: 'blur' }
        ]
      },
      addCateForm: {
        name: '',
        pid: 0,
        level: 1
      },
      catePidList: [],
      // 用于接受选择的节点的id与父节点的id
      seleceorKeys: []
    }
  },
  created() {
    this.get_category_list()
  },
  methods: {
    async get_category_list() {
      const { data: res } = await this.$axios.get('/category_list')
      if (res.status !== 200) return this.$msg.error(res.$msg)
      this.$msg.success(res.msg)
      this.category_list = res.data.data
    },
    showAddcateDialog() {
      this.addCategoryDialogvisible = true
      this.get_category_pid()
    },
    handleClose() {
      this.addCategoryDialogvisible = false
      this.$refs.addCategoryRef.resetFields()
      this.seleceorKeys = []
    },
    async get_category_pid() {
      const { data: res } = await this.$axios.get('/category_list', { params: { level: 2 } })
      if (res.status !== 200) return this.$msg.error(res.msg)
      this.$msg.success(res.msg)
      this.catePidList = res.data.data
    },
    changeSelecor() {
      // 如果表单中接受存储值的列表长度大于0，代表的就是已经选中了
      if (this.seleceorKeys.length > 0) {
        this.addCateForm.pid = this.seleceorKeys[this.seleceorKeys.length - 1]
        this.addCateForm.level = this.seleceorKeys.length + 1
      } else {
        this.addCateForm.pid = 0
        this.addCateForm.level = 1
      }
    },
    // 发送post请求，添加数据到数据库中！
    async addCategory() {
      const { data: res } = await this.$axios.post('/category', this.$qs.stringify(this.addCateForm))
      if (res.status !== 200) return this.$msg.error(res.msg)
      this.$msg.success(res.msg)
      this.get_category_list()
      this.handleClose()
    }
  },
}
</script>

<style lang="less" scoped>
.tree-level {
  margin-top: 15px;
}
</style>
