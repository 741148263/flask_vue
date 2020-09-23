<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <hr />
        <el-card>
            <el-row :gutter="30">
                <el-col :span="2">
                    <el-button type="primary" icon="el-icon-circle-plus">新增角色</el-button>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <el-table :data="roleList" border style="width: 100%">
                    <el-table-column type="expand">
                      <template slot-scope="scope">
                        <el-row :class="['bottom',index === 0?'top':'']" v-for="(power,index) in scope.row.menus" :key="power.id">
                            <el-col>
                              <el-tag><span>一级权限：</span></el-tag>
                              <i class="el-icon-caret-right"></i>
                              <el-tag type="danger" closable @click="remove_menu(scope.row,power)">{{power.name}}</el-tag>
                              <el-tag><span>二级权限：</span></el-tag>
                              <i class="el-icon-right"></i>
                              <span v-for="child in power.children" :key="child"><el-tag type="success" closable @click="remove_menu(scope.row,child)">{{child.name}}</el-tag></span>
                            </el-col>
                        </el-row>
                      </template>
                    </el-table-column>
                    <el-table-column type="index"></el-table-column>
                    <el-table-column prop="id" label="ID" width="100px"></el-table-column>
                    <el-table-column prop="name" label="角色名"></el-table-column>
                    <el-table-column prop="desc" label="角色描述"></el-table-column>
                    <el-table-column label="操作" width="450px">
                        <template slot-scope="scope">
                            <el-button size="mini" type="success" icon="el-icon-edit">修改角色</el-button>
                            <el-button size="mini" type="danger" icon="el-icon-delete">删除角色</el-button>
                            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showMenuDialog(scope.row)">分配权限</el-button>
                        </template>
                    </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
        </el-card>
        <!-- 分配权限对话框 -->
        <el-dialog title="分配权限" :visible.sync="menuDialogVisible" width="30%" :before-close="handleClose">
          <el-tree ref="TreeREF" :data="menuList" :props="menuProps" show-checkbox :default-checked-keys="keyList" node-key="id" :default-expanded-keys="keyList"></el-tree>
          <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose()">取 消</el-button>
            <el-button type="primary" @click="editMenu()">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data () {
    return {
      roleList: [],
      menuDialogVisible: false,
      menuProps: {
        label: 'name',
        children: 'children'
      },
      menuList: [],
      keyList: [],
      rid: 0
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { data: res } = await this.$axios.get('/role')
      if (res.status !== 200) return this.$msg.error(res.msg)
      this.roleList = res.data
    },
    remove_menu(row, m) {
      this.$confirm('此操作将永久删除的权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$axios.get(`/del_menu/${row.id}/${m.id}/`)
        if (res.status !== 200) return this.$msg.error(res.msg)
        this.$msg({
          type: 'success',
          message: res.msg
        })
        row.menus = res.data
      }).catch(() => {
        this.$msg({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    showMenuDialog(row) {
      this.rid = row.id
      this.getMenuList()
      this.menuDialogVisible = true
      this.getKeyList(row.menus)
    },
    // 树的数据响应
    async getMenuList() {
      const { data: res } = await this.$axios.get('/menu')
      if (res.status !== 200) return this.$msg.error(res.msg)
      this.menuList = res.data
    },
    handleClose() {
      this.keyList = []
      this.menuDialogVisible = false
    },
    getKeyList(menu) {
      menu.forEach(item => {
        item.children.forEach(i => {
          this.keyList.push(i.id)
        })
      })
    },
    async editMenu() {
      const mids = [
        // 获取权限id列表
        ...this.$refs.TreeREF.getCheckedKeys(),
        ...this.$refs.TreeREF.getHalfCheckedKeys()
      ]
      const midsStr = mids.join(',')
      const { data: res } = await this.$axios.post(`/set_menu/${this.rid}/`, this.$qs.stringify({ mids: midsStr }))
      if (res.status !== 200) return this.$msg.error(res.msg)
      this.getRoleList()
      this.$msg.success(res.msg)
      this.handleClose()
    }
  }
}
</script>

<style lang="less" scoped>
  .top {
    border-top: 1px solid green;
  }
  .bottom {
    border-bottom: 1px solid green;
  }
  .el-tag {
    margin: 10px;
  }
</style>
