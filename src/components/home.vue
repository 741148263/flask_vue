<template>
    <el-container class="home-container">
        <el-header>
            <div>
                <img src="../assets/logo.png">
                <span>电子商务后台管理系统</span>
            </div>
            <span style="font-size:20px;line-height:35px;margin-left:550px">当前登录用户：<el-tag type="danger">游客登录</el-tag></span>
            <!-- <el-button type="primary" plain @click="test">测试</el-button> -->
            <el-button type="primary" plain @click="lagout">退出</el-button>
        </el-header>
            <el-container>
                <el-aside width="180px">
                    <el-menu
                      :default-active="activePath"
                      class="el-menu-vertical-demo"
                      @open="handleOpen"
                      @close="handleClose"
                      background-color="#A4BDD6"
                      text-color="blue"
                      active-text-color="green"
                      unique-opened
                      router>
                      <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
                        <template slot="title">
                          <i :class="iconObj[item.id+' ']"></i>
                          <span>{{ item.name }}</span>
                        </template>
                        <el-menu-item :index="subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveActivePath">
                          <template slot="title">
                            <i :class="iconObj[subItem.id+' ']"></i>
                            <span>{{ subItem.name }}</span>
                            </template>
                        </el-menu-item>
                      </el-submenu>
                    </el-menu>
                </el-aside>
                <el-main><router-view></router-view></el-main>
            </el-container>
    </el-container>
</template>

<script>
export default {
  data () {
    return {
      menuList: [],
      iconObj: {
        '2 ': 'el-icon-user-solid',
        '3 ': 'el-icon-s-tools',
        '4 ': 'el-icon-s-shop',
        '5 ': 'el-icon-s-order',
        '6 ': 'el-icon-s-data',
        '11 ': 'el-icon-user',
        '21 ': 'el-icon-setting',
        '22 ': 'el-icon-setting',
        '31 ': 'el-icon-goods',
        '32 ': 'el-icon-goods',
        '33 ': 'el-icon-goods',
        '41 ': 'el-icon-circle-plus-outline',
        '42 ': 'el-icon-remove-outline',
        '43 ': 'el-icon-notebook-2'
      },
      activePath: window.sessionStorage.getItem('activePath')
    }
  },
  // 在进入页面的时候，就发送请求，获取菜单数据，当页面加载完成的时候，菜单会出现咋侧栏
  created () {
    this.getMenuList()
  },
  methods: {
    lagout () {
      // 退出功能，首选需要清楚sessionstorage，其次，需要进行指定页面跳转，这里以登录窗口为例
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // test () {
    //   // 发送一个请求，用来测试token
    //   const { date: res } = this.$axios.get('/user/test')
    //   console.log(res)
    // },
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },
    // 使用异步，必须是async与await同时出现
    async getMenuList () {
      // 发送获取菜单数据请求，异步，必须等待后端数据发送完成，才能进行打印
      const { data: res } = await this.$axios.get('/menu')
      this.menuList = res.data
    },
    saveActivePath (ap) {
      // 记录历史，将激活状态保存在本地浏览器中，在每一次重新加载页面的时候，从浏览器本地中取出activePath的值，赋值给data中的activePaht即可
      window.sessionStorage.setItem('activePath', ap.index)
      this.activePath = ap.index
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
    height: 100%;
}
.el-header {
    // 充满
    display: flex;
    background-color: #409EFF;
    // 上下居中
    align-items: center;
    // 按钮放在最右侧
    justify-content: space-between;
    color: #fff;
    font-size: 30px;
    img {
        height: 55px;
        width: 80px;
    }
    div {
        display: flex;
        align-items: center;
    }
}
.el-aside {
    background-color: #A4BDD6;
}
.el-main {
    background-color: gray;
}
</style>
