<template>
    <div>
        <el-breadcrumb separator=">">
            <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
            </el-breadcrumb>
        </el-breadcrumb>
        <hr />
        <el-card>
            <el-row >
                <el-col :span='8'>
                    <el-input placeholder="请输入商品名称" v-model="goodname" clearable @clear="searchGood()">
                        <el-button slot="append" icon="el-icon-search" @click="searchGood()"></el-button>
                    </el-input>
                </el-col>
                <el-col :span='4'>
                    <el-button type="primary" icon="el-icon-plus" @click="pushAdd()">新增商品</el-button>
                </el-col>
            </el-row>
            <el-table border :data="tablegoodslist">
                <el-table-column type="index" label="ID"></el-table-column>
                <el-table-column prop="name" label="商品名称" width="500px"></el-table-column>
                <el-table-column prop="price" label="商品价格" width="100px"></el-table-column>
                <el-table-column prop="number" label="商品库存" width="100px"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" type="success" icon="el-icon-edit" @click="editGoods(scope.row)">编辑</el-button>
                        <el-button size="mini" type="danger" icon="el-icon-edit" @click="deleteGoods(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
export default {
  data() {
    return {
      tablegoodslist: [],
      goodname: ''
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$axios.get('/get_goods', { params: { name: this.goodname } })
      if (res.status !== 200) return this.$msg.error(res.msg)
      this.tablegoodslist = res.data
    },
    async searchGood() {
      const { data: res } = await this.$axios.get('/get_goods', { params: { name: this.goodname } })
      if (res.status !== 200) return this.$msg.error(res.msg)
      this.tablegoodslist = res.data
    },
    editGoods() {},
    async deleteGoods(row) {
      const { data: res } = await this.$axios.delete('goods_list', { params: { id: row.id } })
      if (res.status !== 200) return this.$msg.error(res.msg)
      this.$msg.success(res.msg)
      this.getGoodsList()
    },
    pushAdd() {
      this.$router.push('/add_good')
    }
  }
}
</script>

<style lang="less" scoped>
.el-button{
    margin-left: 10px;
}
.el-table {
    margin-top: 5px;
}
</style>
