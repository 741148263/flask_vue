<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <hr>
    <el-card>
        <div>
            <el-row>
            <el-col>
                <el-table :data="powerList" border style="width: 100%">
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="id" label="ID"></el-table-column>
                <el-table-column prop="name" label="权限名称"></el-table-column>
                <el-table-column prop="path" label="权限路径"></el-table-column>
                <el-table-column prop="level" label="权限等级">
                    <!-- 插槽 -->
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.level == 1" :type="success" effect="dark">一级目录</el-tag>
                        <el-tag v-else :type="danger" effect="plain" >二级目录</el-tag>
                    </template>
                </el-table-column>
                </el-table>
            </el-col>
            </el-row>
        </div>
    </el-card>
    </div>
</template>

<script>
export default {
  data () {
    return {
      powerList: []
    }
  },
  created () {
    this.getMenuList()
  },
  methods: {
    async getMenuList () {
      const { data: res } = await this.$axios.get('/menu', { params: { type: 'list' } })
      console.log(res)
      if (res.status !== 200) return this.$msg.error(res.$msg)
      this.powerList = res.data
    }
  }
}
</script>>
