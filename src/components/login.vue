<template>
  <div class="login_contaner">
    <div class="login_box">
        <!-- 头像区 -->
      <div class="avatar_box">
          <img src="../assets/logo.png" alt="">
      </div>

      <!-- 登陆表单区 -->
      <el-form ref="loginFromRef" :rules='loginFromRule' :model="loginForm" label-width="140px" class="login_form">
          <!-- 用户 -->
        <el-form-item label="用户" prop="username">
          <el-input v-model="loginForm.username"  prefix-icon="el-icon-user"></el-input>
        </el-form-item>

          <!-- 密码 -->
        <el-form-item label="密码" prop='password'>
          <el-input type="password" v-model="loginForm.password" prefix-icon="el-icon-goods" ></el-input>
        </el-form-item>

         <!-- 按钮 -->
        <el-form-item class="btns">
           <el-button type="primary" @click="login">登陆</el-button>
           <el-button @click="resiterFrom" type="info">重置</el-button>
        </el-form-item>

      </el-form>
    </div>
  </div>
  
</template>

<script>
export default {
data() {
    return {
        // 表单数据板绑定
        loginForm:{
            username:'zx',
            password:'123'
        },
       loginFromRule:{
        //    验证用户名是否正确
           username:[
                { required: true, message: '请输入登录名', trigger: 'blur' },
                { min: 3, max: 10, message: '长度在 3 到 10个字符', trigger: 'blur' }
           ],
        //    验证密码格式合法
           password:[  
               { required: true, message: '请输密码', trigger: 'blur' },
               { min: 6, max: 10, message: '长度在 6到 10个字符', trigger: 'blur' }]
       }
    }
},
methods: {
      resiterFrom(){
          this.$refs.loginFromRef.resetFields();
    },
      login(){
          this.$refs.loginFromRef.validate((valid => {
            if(!valid) return;
            this.axios("login",this.loginForm);
          }))
    }
}
}
</script>

<style scoped>
  .login_contaner{
      background:pink;
      height: 100%;
  }
  .login_box{
      width: 450px;
      height: 300px;
      background: #fff;
      border-radius: 7px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%)
  }

  .avatar_box{
      height: 130px;
      width: 130px;
      border: 1px solid #fff;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #dddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%,-50%)
  }

  img{
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background:skyblue;
  }

  .btns{
      display: flex;
      justify-content: flex-end;
  }
  .login_form{
      position: absolute;
      bottom: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

  }
</style>