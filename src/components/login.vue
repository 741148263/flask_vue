<template>
    <div class="login_container">
        <div class="login_box">
            <div class="logo">
                <img src="../assets/logo.png" alt="">
            </div>
            <el-form ref="userReset" :rules="userRule" :model="userForm"  label-width="0px" class="form_style">
                <el-form-item prop="uname">
                    <el-input v-model="userForm.uname" prefix-icon="el-icon-user-solid" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item prop="pwd">
                    <el-input show-password v-model="userForm.pwd"  prefix-icon="el-icon-shopping-bag-2" placeholder="密码"></el-input>
                </el-form-item>
                <el-form-item class="btn">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      userForm: {
        uname: 'matao',
        pwd: '123456789'
      },
      userRule: {
        uname: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 6, message: '长度在2~6位', trigger: 'blur' }
        ],
        pwd: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  // 和导出数据同级，进行方法导出！
  methods: {
    resetForm () {
      // this为当前元素对象，对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
      this.$refs.userReset.resetFields()
    },
    login () {
      this.$refs.userReset.validate(async valid => {
        console.log(valid)
        if (!valid) return
        // console.log('下一步进行登录操作！')
        // 如果为true，则进行下一步的登录操作
        // 如果不使用qs转化为字符串，会跨域，造成请求地址错误，没有附带请求参数
        // 发送post请求，访问/user/login,第二个参数是将form表单内容转化为字符串
        // 发送的是一个阿贾克斯请求，需要等待返回结果async与awaite同步使用
        const { data: res } = await this.$axios.post('/user/login', this.$qs.stringify(this.userForm))
        // 判断后端返回json数据中的状态码，返回状态码等于200，表示登录成功！
        if (res.status === 200) {
          // console.log(res)
          // 处理返回的数据 1、登录成功后，获取到token，保存token，保存到sessionStorage中
          window.sessionStorage.setItem('token', res.data.token)
          // 登录成功！
          this.$msg.success(res.msg)
          // 跳转登录页面！
          this.$router.push('/home')
        } else {
          this.$msg.error(res.msg)
        }
      })
    }
  }
}
</script>

<style scoped lang='less'>
    .login_container {
        background-color: lightgray;
        height: 100%;
    }
    .login_box {
        height: 300px;
        width: 450px;
        border-radius: 10px;
        background-color: white;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
    }
    .logo {
        width: 150px;
        height: 70px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-270%);
        img {
            height: 100%;
            width: 100%;
        }
    }
    .form_style {
        width: 100%;
        padding: 0 10%;
        padding-bottom: 10px;
        box-shadow: hidden;
        position: absolute;
        bottom: 0;
        box-sizing: border-box;
    }
    .btn {
        display: flex;
        justify-content: flex-end;
    }
</style>
