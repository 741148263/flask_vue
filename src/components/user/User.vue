<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <hr />
    <el-card>
      <div>
        <el-row :gutter="30">
          <el-col :span="8">
            <el-input placeholder="请输入用户名" v-model="queryInfo.name">
              <el-button slot="append" icon="el-icon-search" @click="seachUser"></el-button>
            </el-input>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" icon="el-icon-circle-plus" @click="dialogVisible = true">新增用户</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-table :data="userList" border style="width: 100%">
              <el-table-column type="index"></el-table-column>
              <el-table-column prop="id" label="ID"></el-table-column>
              <el-table-column prop="name" label="用户名"></el-table-column>
              <el-table-column prop="nick_name" label="昵称"></el-table-column>
              <el-table-column prop="email" label="邮箱"></el-table-column>
              <el-table-column prop="phone" label="手机号码"></el-table-column>
              <el-table-column prop="role_name" label="角色"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    circle
                    @click="handleEdit(scope.row)"
                  ></el-button>
                  <el-button
                    type="warning"
                    icon="el-icon-refresh"
                    circle
                    @click="resetUser(scope.row)"
                  ></el-button>
                  <el-button type="danger" icon="el-icon-delete" circle @click="showDel(scope.row)"></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-row>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="this.queryInfo.pnum"
            :page-sizes="[1, 2 ,5 , 10]"
            :page-size="this.queryInfo.psize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </el-row>
      </div>
    </el-card>
    <!-- 新增用户按钮的弹出框 -->
    <el-dialog title="新增用户" :visible.sync="dialogVisible" width="30%" :before-close="addFormClose">
      <el-form
        ref="addUserref"
        :rules="adduserRules"
        :model="addUserForm"
        label-width="80px"
        class="form_style"
      >
        <el-form-item prop="name" label="用户名">
          <el-input v-model="addUserForm.name" prefix-icon="el-icon-user-solid" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="pwd" label="密码">
          <el-input
            show-password
            v-model="addUserForm.pwd"
            prefix-icon="el-icon-shopping-bag-2"
            placeholder="密码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="real_pwd" label="确认密码">
          <el-input
            show-password
            v-model="addUserForm.real_pwd"
            prefix-icon="el-icon-shopping-bag-2"
            placeholder="确认密码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="nick_name" label="昵称">
          <el-input
            v-model="addUserForm.nick_name"
            prefix-icon="el-icon-s-promotion"
            placeholder="昵称"
          ></el-input>
        </el-form-item>
        <el-form-item prop="phone" label="手机号码">
          <el-input v-model="addUserForm.phone" prefix-icon="el-icon-mobile" placeholder="手机号码"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="addUserForm.email" prefix-icon="el-icon-message" placeholder="邮箱"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="addUserForm.role_name" placeholder="请选择角色">
            <el-option :label="r.name" :value="r.id" v-for="r in this.role_list" :key='r.id'></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addFormClose">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户的按钮弹出框 -->
    <el-dialog
      title="编辑用户"
      :visible.sync="EditdialogVisible"
      width="30%"
      :before-close="EditFormClose"
    >
      <el-form
        ref="EditUserref"
        :rules="EdituserRules"
        :model="EditUserForm"
        label-width="80px"
        class="form_style"
      >
        <el-form-item prop="name" label="用户名">
          <el-input
            v-model="EditUserForm.name"
            prefix-icon="el-icon-user-solid"
            placeholder="用户名"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item prop="nick_name" label="昵称">
          <el-input
            v-model="EditUserForm.nick_name"
            prefix-icon="el-icon-s-promotion"
            placeholder="昵称"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item prop="phone" label="手机号码">
          <el-input v-model="EditUserForm.phone" prefix-icon="el-icon-mobile" placeholder="手机号码">手机号码</el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="EditUserForm.email" prefix-icon="el-icon-message" placeholder="邮箱"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="EditUserForm.role_name" placeholder="请选择角色">
            <el-option :label="r.name" :value="r.id" v-for="r in this.role_list" :key='r.id'></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="EditFormClose">取 消</el-button>
        <el-button type="primary" @click="EditUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 删除用户的按钮弹出框 -->
    <el-dialog title="删除用户" :visible.sync="deldialogVisible" width="30%">
      <span>
        你确认要
        <font style="color:red">永久删除</font>
        <br />用户名：
        <font style="color:red">{{ this.delName }}</font>
        <br />昵称：
        <font style="color:red">{{ this.delNickName }}</font>
        <br />的用户全部信息吗？
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deldialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="delUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 重置密码 -->
    <el-dialog title="重置用户密码" :visible.sync="resetdialogVisible" width="30%">
      <span>
        你确认要
        <font style="color:red">重置</font>
        <br />用户名：
        <font style="color:red">{{ this.resetName }}</font>
        <br />昵称：
        <font style="color:red">{{ this.resetNickName }}</font>
        <br />的用户密码吗？
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleResetPassword()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    const validatorcheckpassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入确认密码'))
      } else if (value !== this.addUserForm.pwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    const validatorcheckphone = (rule, value, callback) => {
      const regphone = /^1[3456789]\d{9}$/
      if (regphone.test(value)) {
        return callback()
      }
      return callback(new Error('请输入有效的手机号码'))
    }
    const validatorcheckemail = (rule, value, callback) => {
      const regemail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (regemail.test(value)) {
        return callback()
      }
      callback(new Error('请输入正确的邮箱'))
    }
    return {
      userList: [],
      // pnum: 1,
      // psize: 1,
      queryInfo: {
        name: '',
        pnum: 1,
        psize: 10,
      },
      total: 0,
      dialogVisible: false,
      EditdialogVisible: false,
      deldialogVisible: false,
      resetdialogVisible: false,
      delName: '',
      delNickName: '',
      delID: 0,
      resetName: '',
      resetNickName: '',
      resetId: 0,
      role_list: [],
      addUserForm: {},
      EditUserForm: {},
      adduserRules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在2-5个字节', trigger: 'blur' },
        ],
        pwd: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        real_pwd: [{ validator: validatorcheckpassword, trigger: 'blur' }],
        nick_name: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
          { min: 5, max: 25, message: '昵称长度在5~25个字节', trigger: 'blur' },
        ],
        phone: [{ validator: validatorcheckphone, trigger: 'blur' }],
        email: [{ validator: validatorcheckemail, trigger: 'blur' }],
      },
      EdituserRules: {
        phone: [{ validator: validatorcheckphone, trigger: 'blur' }],
        email: [{ validator: validatorcheckemail, trigger: 'blur' }],
      },
    }
  },
  created() {
    this.getUserList()
    this.getRole()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$axios.get('/user/user_list', {
        params: this.queryInfo,
      })
      if (res.status !== 200) return this.$msg.error(res.msg)
      this.userList = res.data.user
      this.total = res.data.totalPage
    },
    handleSizeChange(val) {
      this.queryInfo.psize = val
      this.getUserList()
    },
    handleCurrentChange(val) {
      this.queryInfo.pnum = val
      this.getUserList()
    },
    seachUser() {
      this.queryInfo.pnum = 1
      this.getUserList()
    },
    // 重置表单
    addFormClose() {
      this.$refs.addUserref.resetFields()
      this.dialogVisible = false
    },
    addUser() {
      this.$refs.addUserref.validate(async (valid) => {
        if (!valid) return
        // 发送post请求
        const { data: res } = await this.$axios.post(
          '/user/user',
          this.$qs.stringify(this.addUserForm)
        )
        if (res.status !== 200) return this.$msg.error(res.msg)
        this.$msg.success(res.msg)
        this.$refs.addUserref.resetFields()
        this.dialogVisible = false
        this.getUserList()
      })
    },
    // 编辑图标按钮方法
    async handleEdit(row) {
      const { data: res } = await this.$axios.get('/user/user', {
        params: { id: row.id },
      })
      if (res.status !== 200) return this.$msg.error(res.msg)
      this.EditUserForm = res.data
      this.EditdialogVisible = true
    },
    EditFormClose() {
      this.$refs.EditUserref.resetFields()
      this.EditdialogVisible = false
    },
    EditUser() {
      this.$refs.EditUserref.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$axios.put(
          '/user/user',
          this.$qs.stringify(this.EditUserForm)
        )
        if (res.status !== 200) return this.$msg.error(res.msg)
        this.$msg.success(res.msg)
        this.EditdialogVisible = false
        this.getUserList()
      })
    },
    showDel(row) {
      this.delID = row.id
      this.delName = row.name
      this.delNickName = row.nick_name
      this.deldialogVisible = true
    },
    // 删除用户操作
    async delUser() {
      const { data: res } = await this.$axios.delete('/user/user', {
        params: { id: this.delID },
      })
      if (res.status !== 200) return this.$msg.error(res.msg)
      this.$msg.success(res.msg)
      this.deldialogVisible = false
      this.getUserList()
    },
    async handleResetPassword() {
      const { data: res } = await this.$axios.get('/user/reset', {
        params: { id: this.resetId },
      })
      if (res.status !== 200) return this.$msg.error(res.message)
      this.$msg.success(res.msg)
      this.resetdialogVisible = false
    },
    resetUser(row) {
      this.resetName = row.name
      this.resetNickName = row.nick_name
      this.resetId = row.id
      this.resetdialogVisible = true
    },
    async getRole() {
      const { data: res } = await this.$axios.get('/role')
      if (res.status !== 200) return this.$msg.error(res.msg)
      this.role_list = res.data
      console.log(this.role_list)
    }
  },
}
</script>>

<style scoped lang="less">
.el-table {
  margin-top: 10px;
  .el-row {
    text-align: center;
  }
}
</style>
