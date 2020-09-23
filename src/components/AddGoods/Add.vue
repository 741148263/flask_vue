<template>
    <div>
        <el-breadcrumb separator=">" separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>增加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <hr />
        <el-alert
            title="添加商品信息页"
            type="success"
            center
            show-icon
            close-text="知道了">
        </el-alert>
        <el-card>
            <!-- 其中的active之后减0代表的是更改数据类型，步骤条中的激活属性是数字，而标签页的更换的激活数据类型是字符串    · -->
            <el-steps :active="active-0" finish-status="success" align-center>
                <el-step title="商品基本信息"></el-step>
                <el-step title="商品静态参数"></el-step>
                <el-step title="商品动态参数"></el-step>
                <el-step title="商品图片信息"></el-step>
                <el-step title="商品内容信息"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <hr>
            <el-form :model="addForm" ref="addFormRef" :rules="addFormRules" label-position="top">
                <el-tabs :tab-position="tabPosition" v-model="active" style="background-color: lightgreen" :before-leave="leaveother">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" label-width="80px" prop="name">
                            <el-input v-model="addForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" label-width="80px" prop="price">
                            <el-input v-model="addForm.price"></el-input>
                        </el-form-item>
                        <el-form-item label="商品库存" label-width="80px" prop="number">
                            <el-input v-model="addForm.number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品权重" label-width="80px" prop="weight">
                            <el-input v-model="addForm.weight"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" label-width="80px" prop="cid">
                            <el-cascader
                                v-model="selectkeys"
                                :options="cateIdList"
                                :props="{ expandTrigger: 'hover', label: 'name', value: 'id' }"
                                clearable
                                @change="changeselectkeys"
                                :show-all-levels=true
                                style="width: 770px"
                                >
                            </el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品静态参数" name="1">
                      <el-form-item :label="s.name" v-for="s in this.attr_static" :key="s.id">
                        <el-input v-model="s.value"></el-input>
                      </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品动态参数" name="2">
                      <el-form-item :label="s.name" v-for="s in this.attr_dynamic" :key="s.id">
                        <el-checkbox-group v-model="s.value">
                          <el-checkbox :label="val" v-for="(val, i) in s.value" :key="i" border></el-checkbox>
                        </el-checkbox-group>
                      </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                      <el-upload
                        class="upload-demo"
                        action="/uploads_img"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :file-list="fileList"
                        :on-success="handleSuccess"
                        list-type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip"><el-alert>只能上传jpg/png文件，且不超过500kb</el-alert></div>
                      </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                      <quill-editor v-model="addForm.introduce"></quill-editor>
                      <el-button type="primary" @click="addGoods()">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
        <el-dialog title="图片预览" :visible.sync="priviewDialogVisible" width="40%">
          <img :src="img_path" class="img_box">
          <el-button @click="priviewDialogVisible=false">取消</el-button>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data() {
    return {
      active: '0',
      tabPosition: 'left',
      addForm: {
        name: '',
        price: 0,
        number: 0,
        weight: 0,
        cid_one: 0,
        cid_two: 0,
        cid_three: 0,
        pics: [],
        introduce: '',
        attr_static: [],
        attr_dynamic: []
      },
      addFormRules: {
        name: [
          { required: true, message: '请输入商品名称', tigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入商品价格', tigger: 'blur' }
        ],
        number: [
          { required: true, message: '请输入商品库存数量', tigger: 'blur' }
        ],
        weight: [
          { required: true, message: '请输入商品权重', tigger: 'blur' }
        ]
      },
      cateIdList: [],
      selectkeys: [],
      attr_static: [],
      attr_dynamic: [],
      img_path: '',
      priviewDialogVisible: false,
      fileList: [],
      static_list: [],
      dynamic_list: []
    }
  },
  created() {
    this.getAttr_list()
  },
  methods: {
    async getAttr_list() {
      const { data: res } = await this.$axios.get('/category_list')
      if (res.status !== 200) return this.$msg.error(res.msg)
      this.cateIdList = res.data.data
    },
    changeselectkeys() {
      if (this.selectkeys.length < 3) return this.$msg.error('请选择三级分类')
      this.addForm.cid_one = this.selectkeys[0]
      this.addForm.cid_two = this.selectkeys[1]
      this.addForm.cid_three = this.selectkeys[2]
    },
    leaveother (activeName, oldActiveName) {
      if (this.selectkeys.length < 3) {
        this.$msg.error('请选择三级分类')
        return false
      }
      if (activeName === '1') this.get_Attr('static')
      if (activeName === '2') this.get_Attr('dynamic')
    },
    async get_Attr(_type) {
      const { data: res } = await this.$axios.get('/category/attr_list', { params: { cid: this.selectkeys[2], _type: _type } })
      if (res.status !== 200) return this.$msg.error(res.msg)
      if (_type === 'static') {
        this.attr_static = res.data
      } else {
        res.data.forEach(item => {
          item.value = item.value ? item.value.split(',') : []
        })
        this.attr_dynamic = res.data
      }
    },
    // 上传成功返回的响应
    handleSuccess(response) {
      this.addForm.pics.push(response.data.path)
    },
    handleRemove(file) {
      // 这就是我们要删除的文件
      console.log(file.response.data.path)
      // 新创建一个变量用于接收该文件路径在表单pics中的索引值，箭头代表的是该索引i对应的x的值的验证规则
      const i = this.addForm.pics.findIndex(x => x === file.response.data.path)
      // 删除表单中pics列表中的第i个元素
      this.addForm.pics.splice(i, 1)
    },
    handlePreview(file) {
      this.priviewDialogVisible = true
      this.img_path = file.response.data.path
    },
    addGoods() {
      // 循环遍历静态属性，从中取出id和值，并形成一个新的json
      this.attr_static.forEach(item => {
        this.static_list.push({ id: item.id, value: item.value })
      })
      this.attr_dynamic.forEach(item => {
        this.dynamic_list.push({ id: item.id, value: item.value.join(',') })
      })
      this.addForm.attr_static = JSON.stringify(this.static_list)
      this.addForm.attr_dynamic = JSON.stringify(this.dynamic_list)
      this.addForm.pics = JSON.stringify(this.addForm.pics)
      console.log(this.static_list)
      console.log(this.dynamic_list)
      this.saveGoods()
    },
    async saveGoods() {
      const { data: res } = await this.$axios.post('/goods', this.$qs.stringify(this.addForm))
      if (res.status !== 200) return this.$msg.error(res.msg)
      this.$msg.success(res.msg)
    }
  }
}
</script>

<style lang="less" scoped>
.el-form-item{
    margin-left: 30px;
    margin-right: 30px;
    margin-top: 20px;
}
.el-checkbox{
  // ！important强制替换
  margin: 0 30px 0 0!important;
}
.img_box {
  width: 100%;
}
</style>
