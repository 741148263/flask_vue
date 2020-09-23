<template>
    <div>
        <el-breadcrumb separator=">">
            <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
            </el-breadcrumb>
        </el-breadcrumb>
        <hr />
        <el-card>
          <el-row>
              <el-alert
                title="注意：只能给三级菜单添加静态、动态属性！"
                type="warning"
                close-text="知道了"
                show-icon>
              </el-alert>
            <span>选择商品分类：</span>
            <!-- 级联选择器 -->
              <el-cascader
              v-model="selectkeys"
              :options="this.cateIdList"
              :props="{ expandTrigger: 'hover', label: 'name', value: 'id' }"
              clearable
              @change="changeselectkeys"
              :show-all-levels="true"
              >
              </el-cascader>
          </el-row>
          <el-row>
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="静态属性" name="static">
                  <el-button type="primary" size="mini" @click="showDialog()">新增{{ this.textLabel() }}属性</el-button>
                  <hr>
                  <el-table :data="staticAttr">
                    <el-table-column type="expand">
                      <template slot-scope="scope">
                        <el-row>
                          <el-col>
                            <el-tag>{{ scope.row.value }}</el-tag>
                          </el-col>
                        </el-row>
                      </template>
                    </el-table-column>
                    <el-table-column type="index" label="序号"></el-table-column>
                    <el-table-column prop="name" label="属性名称"></el-table-column>
                    <el-table-column label="操作">
                      <template>
                        <el-button type="success" size="mini">编辑</el-button>
                        <el-button type="danger" size="mini">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-tab-pane>
                <el-tab-pane label="动态属性" name="dynamic">
                  <el-button type="primary" size="mini" @click="showDialog()">新增{{ this.textLabel() }}属性</el-button>
                  <hr>
                  <el-table :data="dynamicAttr">
                    <el-table-column type="expand">
                      <template slot-scope="scope">
                        <el-tag closeable @click="removeAttribute(scope.row, i)" v-for="(v,i) in scope.row.value" :key="i">{{ v }}</el-tag>
                        <el-input
                        class="input-new-tag"
                        v-if="scope.row.inputVisible"
                        v-model="scope.row.inputValue"
                        ref="saveTaginputRef"
                        size="small"
                        @keyup.enter.native="handleInputConfirm(scope.row)"
                        @blur="handleInputConfirm(scope.row)"></el-input>
                        <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">添加新标签</el-button>
                      </template>
                    </el-table-column>
                    <el-table-column type="index" label="序号"></el-table-column>
                    <el-table-column prop="name" label="属性名称"></el-table-column>
                    <el-table-column label="操作">
                      <template>
                        <el-button type="success" size="mini">编辑</el-button>
                        <el-button type="danger" size="mini">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-tab-pane>
            </el-tabs>
          </el-row>
        </el-card>
        <!-- 新增属性对话框 -->
        <el-dialog
        :title= "'新增' + this.textLabel()"
        :visible.sync="AttrDialogvisible"
        width="40%"
        :before-close="handleClose">
          <el-form :model="addAttrForm" :rules="addAttrFormRules" ref="addAttrFormRef">
            <el-form-item label="属性名称" label-width="80px" prop="name"><el-input v-model="addAttrForm.name"></el-input></el-form-item>
            <el-form-item label="属性值" label-width="80px" prop="val"><el-input v-model="addAttrForm.val"></el-input></el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleClose()">取 消</el-button>
          <el-button type="primary" @click="addAttribute()">添 加</el-button>
      </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data() {
    return {
      cateIdList: [],
      selectkeys: [],
      activeName: 'static',
      dynamicAttr: [],
      staticAttr: [],
      // 这俩Flag参数用来控制请求次数，默认为false
      staticFlag: false,
      dynamicFlag: false,
      AttrDialogvisible: false,
      addAttrForm: {
        name: '',
        val: ''
      },
      addAttrFormRules: {
        name: [
          { required: true, message: '请输入属性名称', trigger: 'blur' }
        ],
        val: [
          { required: false, message: '请输入属性名称', trigger: 'blur' }
        ]
      },
      inputVisible: false,
      inputValue: ''
    }
  },
  created() {
    this.getAttr_list()
  },
  methods: {
    async getAttr_list() {
      const { data: res } = await this.$axios.get('/category_list')
      if (res.status !== 200) return this.$msg.error(res.msg)
      this.$msg.success(res.msg)
      this.cateIdList = res.data.data
    },
    // 标签点击事件
    handleClick(tab, event) {
      // 如果请求控制参数为false，则不会进行请求
      if (!this.staticFlag && this.activeName === 'static') return
      if (!this.dynamicFlag && this.activeName === 'dynamic') return
      if (this.selectkeys.length < 3) return
      this.getAttributeList()
    },
    async getAttributeList() {
      if (this.selectkeys.length < 3) return this.$msg.error('请选择三级分类')
      const { data: res } = await this.$axios.get('/category/attr_list', { params: { cid: this.selectkeys[2], _type: this.activeName } })
      if (res.status !== 200) return this.$msg.error(res.msg)
      if (this.activeName === 'static') {
        this.staticAttr = res.data
        this.staticFlag = false
      } else {
        // 将获取到的动态数据进行分割
        res.data.forEach(item => {
          // 这一行的意思就是说如果item有值的话，按照逗号分割，如果没有值的话，将空列表赋值给item的值
          item.value = item.value ? item.value.split(',') : []
          item.inputVisible = false
          item.inputValue = ''
        })
        this.dynamicAttr = res.data
        this.dynamicFlag = false
      }
    },
    // 优化数据填充，如果选项更改，那么意味着就可以进行重新发送请求，但是如果不更改，仅仅只是更改标签，那么还是会重新发送请求,对服务器造成压力，此处需要优化
    changeselectkeys() {
      this.staticFlag = true
      this.dynamicFlag = true
      if (this.selectkeys.length < 3) {
        this.staticAttr = []
        this.dynamicAttr = []
        return this.$msg.error('请选择三级分类')
      }
      this.getAttributeList()
    },
    handleClose() {
      this.AttrDialogvisible = false
      this.$refs.addAttrFormRef.resetFields()
    },
    showDialog() {
      if (this.selectkeys.length < 3) return this.$msg.error('请选择三级分类')
      this.AttrDialogvisible = true
    },
    // 试一试使用函数控制显示
    textLabel() {
      if (this.activeName === 'static') return '静态参数'
      else return '动态参数'
    },
    addAttribute() {
      this.$refs.addAttrFormRef.validate(async valid => {
        const { data: res } = await this.$axios.post('/category/attribute', this.$qs.stringify({ cid: this.selectkeys[2], _type: this.activeName, name: this.addAttrForm.name, val: this.addAttrForm.val }))
        if (res.status !== 200) return this.$msg.error(res.msg)
        this.$msg.success(res.msg)
        this.getAttributeList()
        this.handleClose()
      })
    },
    handleInputConfirm(row) {
      // 如果该行新加的数据可以保存的话,该行释义：如果该行index标签值法发生变动，去空格换购的长>0
      if (row.inputValue.trim().length === 0) {
        row.inputVisible = false
        row.inputValue = ''
      } else {
        row.value.push(row.inputValue.trim())
        this.saveAttribute(row)
        row.inputVisible = false
        row.inputValue = ''
      }
    },
    async saveAttribute(row) {
      // 参数设置必须严格按照后端接收参数的名称进行书写
      const { data: res } = await this.$axios.put('/category/attribute', this.$qs.stringify({ id: row.id, cid: row.cid, name: row.name, val: row.value.join(',') }))
      if (res.status !== 200) return this.$msg.error(res.msg)
      this.$msg.success(res.msg)
    },
    showInput(row) {
      row.inputVisible = true
      this.$nextTick(_ => {
        // 焦点
        this.$refs.saveTaginputRef.$refs.input.focus()
      })
    },
    removeAttribute(row, i) {
      // 从当前属性值列表中删除指定的元素，其中参数的意思分别是：i-就是删除第i个元素，1代表操作一个元素
      row.value.splice(i, 1)
      this.saveAttribute(row)
    }
  }
}
</script>

<style lang="less" scoped>
.el-tabs {
  margin-top: 10px;
}
.el-cascader{
  width: 450px;
}
.el-tag{
  margin-left:10px
}
.input-new-tag{
  width: 100px;
  margin-left: 10px;
}
.button-new-tag{
  width: 100px;
  margin: 10px;
}
</style>
