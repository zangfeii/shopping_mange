<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
       <!-- 搜索框 -->
       <el-row :gutter='20'>
         <!-- gutter 列之间的距离 spam 输入框的长度 -->
         <el-col :span='9'>
           <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear='getUserList'>
             <el-button slot="append" icon="el-icon-search" @click='getUserList'></el-button>
           </el-input>
         </el-col>

         <el-col :span='4'>
           <el-button type='primary' @click="dialogVisible = true">添加用户</el-button>
         </el-col>
       </el-row>

         <!-- 添加用户弹窗 -->
       <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close='addUserClose'>
         <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
           <el-form-item label="用户名" prop="username">
             <el-input v-model="addForm.username"></el-input>
           </el-form-item>

            <el-form-item label ="密码" prop = "password" >
             <el-input v-model="addForm.password" type ='password' show-password></el-input>
           </el-form-item>
           
           <el-form-item label="确认密码" prop="checkPassword">
             <el-input v-model="addForm.checkPassword" type ='password' show-password></el-input>
           </el-form-item>

            <el-form-item label="邮箱" prop="email">
             <el-input v-model="addForm.email"></el-input>
           </el-form-item>

            <el-form-item label="电话号码" prop="mobile">
             <el-input v-model="addForm.mobile"></el-input>
           </el-form-item>
         </el-form>
         <span slot="footer" class="dialog-footer">
           <el-button @click="dialogVisible = false">取 消</el-button>
           <el-button type="primary" @click="addUser">确 定</el-button>
         </span>
       </el-dialog>

       <!-- 修改用户信息 -->
       <el-dialog title="修改用户信息" :visible.sync="updatedialogVisible" width="50%" @close='updateClose'>
          <el-form :model="updateInfo" :rules="updateFormRules" ref="updateFormRef" label-width="100px">
            <el-form-item label="用户名">
              <el-input v-model="updateInfo.username" disabled></el-input>
            </el-form-item>

            <el-form-item label="邮箱" prop = 'email'>
              <el-input v-model="updateInfo.email"></el-input>
            </el-form-item>

            <el-form-item label="电话号码" prop = 'mobile'>
              <el-input v-model="updateInfo.mobile"></el-input>
            </el-form-item>
          </el-form>
         <span slot="footer" class="dialog-footer">
           <el-button @click="updatedialogVisible = false">取 消</el-button>
           <el-button type="primary" @click="updataInfo">确 定</el-button>
         </span>
       </el-dialog>

       <!-- 用户列表区 -->
       <el-table :data='userlist' border stripe>
         <el-table-column type='index'></el-table-column>
         <el-table-column label='姓名' prop='username'></el-table-column>
         <el-table-column label='邮箱' prop='email'></el-table-column>
         <el-table-column label='电话' prop='mobile'></el-table-column>
         <el-table-column label='角色' prop='role_name'></el-table-column>
         <el-table-column label='状态' prop='mg_state'>
           <template slot-scope='scope' >
                <!-- scope.row当前行的数据 -->
               <!-- {{scope.row}} -->
               <el-switch v-model="scope.row.mg_state" @change='userStateChange(scope.row)' active-color="#13ce66" inactive-color="#ff4949">               </el-switch>
           </template>
           <!-- <el-switch v-model='userlist.mg_state' active-color="#13ce66" inactive-color="#ff4949"></el-switch> -->
         </el-table-column>

         <el-table-column label='操作' width='180px'>
           <template slot-scope="scope">
             <el-tooltip  effect="dark" content="修改" placement="top" >
               <el-button type="primary" icon="el-icon-edit" size='mini' @click="updata(scope.row.id) "></el-button>
             </el-tooltip>

             <el-tooltip class="item" effect="dark" content="删除" placement="top">
               <el-button type="danger" icon="el-icon-delete" size='mini' @click="del(scope.row.id)"></el-button>
             </el-tooltip>
             
             <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
               <el-button type="warning" icon="el-icon-setting" size='mini' @click="setRole(scope.row)"></el-button>
            </el-tooltip>
           </template>
         </el-table-column>
       </el-table>
       
      <!-- 分配角色弹窗 -->
      
      <el-dialog title="角色分配" :visible.sync="setRoledialogVisible" width="50%" @close="setRoleClose">
        <div>
          <p>当前用户:{{userIn.username}}</p>
          <p>当前用户角色:{{userIn.role_name}}</p>
          <p>分配新的角色:
            <el-select v-model="setRoleId" placeholder="请选择">
              <el-option v-for="item in roleLists" :key="item.id" :label="item.roleName"
               :value="item.id">
              </el-option>
            </el-select>
          </p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRoledialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveRoleRight">确 定</el-button>
       </span>
      </el-dialog>

           <!-- 页码显示 -->
       <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
       </el-pagination>

     </el-card>

  </div>
</template>

<script>
export default {
  data() {   
    //  定义验证邮箱的规则
       var checkEmail = (rule,value,cb) =>{
         const regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
         if(regEmail.test(value)){
           return cb()
         }
         else cb(new Error("请输入合法的邮箱"))
       }

       //定义验证电话号码的规则
        var checkMobile = (rule,value,callback) =>{
          const regMobile =/^1[34578]\d{9}$$/
          if(regMobile.test(value)){
            return callback()
          }
          else callback(new Error("请输入合法的手机号"))
        };

        //  验证密码
         var checkpass1 = (rule ,value,callback) =>{
           if(value === ''){
             callback(new Error("请输入密码"))
           }else{
             if(value !== ''){
               this.$refs.addFormRef.validateField('checkPassword')
             }
             callback();
           }
         };

        //确认两次密码是否一致
        var checkPass  = (rule,value,callback) =>{
          if(value === ''){
            callback(new callback('请再次输入密码'))
          }
          
          else if(value !== this.addForm.password){
            callback(new Error("两次的密码不一致"))
          }
          else callback();
        };
    return {
      // 获取用户列表的参数对象
      queryInfo:{
        query:'',
        //当前页数
        pagenum:1,
        //每页获取的数据量
        pagesize:2
      },
      userlist:[],
      // 用户列表条数
      total:0,
      // 是否添加用户弹窗ru
      dialogVisible:false,
      //修改用户弹窗设置
      updatedialogVisible:false,
      // 添加的用户表单数据

      addForm:{
        username:"",
        password:'',
        email:"",
        mobile:'',
        checkPassword:''
      },
      //保存查询的用户信息
      updateInfo:{},
      //分配角色弹窗
      setRoledialogVisible:false,
      //分配角色弹窗的用信息
      userIn:{},
      //所有的角色列表
      roleLists:[],
      //已经选中的id值
      setRoleId:'',

      // 添加用户时的验证规则
      addFormRules:{
        username:[
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10个字符', trigger: 'blur' }
        ],
        password:[
           { validator:checkpass1, required: true,  trigger: 'blur' },
           { min: 6, max: 10, message: '长度在 6到 10个字符', trigger: 'blur' }
        ],
        checkPassword:[
            { validator:checkPass ,required:true,trigger:'blur' },
            { min: 6, max: 10, trigger: 'blur' }
        ],

        email:[
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            // { validator:checkEmail,trigger: 'blur'}
              { validator:checkEmail, trigger: 'blur' }
        ],
        mobile:[
            //  { required: true, message: '请输入电话号码', trigger: 'blur' },
                { validator:checkMobile,trigger: 'blur' },
                { required: true, message: '请输入电话号码', trigger: 'blur' }
                // { validator:checkEmail,trigger: 'blur'}
              // { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ]

      },
      //修改用户信息验证规则
      updateFormRules:{
        email:[
           { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator:checkEmail, trigger: 'blur' }
        ],
        mobile:[
           { validator:checkMobile,trigger: 'blur' },
           { required: true, message: '请输入电话号码', trigger: 'blur' }
        ]
      }

    }
     
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList(){
      const{data:res} = await this.$http.get('users',{params:this.queryInfo})
      console.log("获取管理员列表")
      console.log(res)
      if(res.meta.status !== 200) return this.message.error("获取用户列表失败")
      this.userlist = res.data.users;
      this.total = res.data.total
    },
    // 监听页数改变事件
    handleSizeChange(newSize){
        this.queryInfo.pagesize = newSize
        this.getUserList()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage){
      this.queryInfo.pagenum = newPage
      this.getUserList()

    },
    // 监听用户状态开关
   async userStateChange(userinfo){
       console.log(userinfo)
       const {data:res}  = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
       if(res.meta.status !== 200)
       {
         userinfo.mg_state =! userinfo.mg_state
         return this.$message.error("更新用户状态失败")
       }
        // this.message.success("sds")
   },
  //  监听添加用户框的关闭
   addUserClose(){
     this.$refs.addFormRef.resetFields();
   },
  //  点击按钮添加用户
   addUser(){
     this.$refs.addFormRef.validate( async valid=>{
      if(!valid) return
       const  {data:res} =  await this.$http.post('users', this.addForm)
       if(res.meta.status !== 201){
        //  console.log(res.meta.status)
         this.$message.error("添加用户失败")
       }
       else {
         this.$message.success("添加用户成功")
         this.dialogVisible = false
         this.getUserList()
       }
     })
   },
  async updata(id){
     this.updatedialogVisible = true
    const {data:res} = await this.$http.get('users/'+id)
    if(res.meta.status !== 200) 
      return this.$message.error("查询用户信息失败")
    this.updateInfo = res.data
   },

   //监听修改查询用户信息弹窗
   updateClose(){
    //  关闭弹窗重置窗口
     this.$refs.updateFormRef.resetFields()
   },
  //  修改用户信息
   updataInfo(){
        //预验证信息是否正确
     this.$refs.updateFormRef.validate( async valid =>{
       if(!valid) return
       const {data:res} = await this.$http.put('users/'+this.updateInfo.id,{email:this.updateInfo.email,mobile:this.updateInfo.mobile})
       if(res.meta.status !==200)
         return this.$message.error("修改用户信息失败")
       else{
         this.updatedialogVisible = false
         this.getUserList()
         this.$message.success("修改用户信息成功")
       }
     })
   },
   //删除用户
  async del(id){
       //弹窗提示用户是否删除  确认删除就返回comfirm 取消删除 就返回concel 并用catch 捕获传给res
    const res = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
          //捕获错误消息 并传给res
        }).catch(err =>{
            return err
        })

      if(res !== 'confirm'){
        return this.$message.info('已经取消删除')
      }
      const result = await this.$http.delete('users/'+id)
      if(result.data.meta.status !==200){
        return this.$message.info("删除用户失败")
      }
       this.$message.success("删除用户成功")
       this.getUserList()
   },

   //设置角色
   setRole(userIn){
      this.userIn = userIn
      //在展示对话框之前,获取所有凡人角色列表
      var that = this
      this.$http.get('roles').then(function(result){
        var res = result.data
        if(res.meta.status !==200)
          return that.$message.error("获取角色失败")
        that.roleLists = res.data

      })
      this.setRoledialogVisible = true
   },
   //点击按钮分配角色
  saveRoleRight(){
    if(!this.setRoleId){
      return this.$message.error('请选择要分配的角色')
      }
      var that = this
      this.$http.put(`users/${this.userIn.id}/role`,{rid:this.setRoleId}).then(function(result){
      var res = result.data
      if(res.meta.status !== 200)
        return that.$message.error('更新角色失败')
      that.$message.success('更新角色成功')
      that.getUserList()
      that.setRoledialogVisible = false
    })
    },

    //设置分配角色对话框关闭事件 
    setRoleClose(){
      this.setRoleId = ''
      this.userIn ={}
    }
      
  }
}
</script>

<style>
  .el-breadcrumb{
    margin-bottom: 15px;
  }
  .box-card{
    box-shadow:  0 1px 2px rgba(0,0,0, 0.5) !important;
  }
  .el-table{
    margin-top: 15px;
    font-size: 12px;
  }
  .el-pagination{
    margin-top: 15px;
  }
</style>