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
       <el-dialog title="提示" :visible.sync="dialogVisible" width="50%">
         <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
           <el-form-item label="用户名" prop="username">
             <el-input v-model="addForm.username"></el-input>
           </el-form-item>

            <el-form-item label="密码" prop="password">
             <el-input v-model="addForm.password"></el-input>
           </el-form-item>

            <el-form-item label="邮箱" prop="email">
             <el-input v-model="addForm.email"></el-input>
           </el-form-item>

            <el-form-item label="电话号码" prop="mobile">
             <el-input v-model="addForm.mobile"></el-input>
           </el-form-item>

            <el-form-item label="用户名" prop="username">
             <el-input v-model="addForm.username"></el-input>
           </el-form-item>
         </el-form>

         <span slot="footer" class="dialog-footer">
           <el-button @click="dialogVisible = false">取 消</el-button>
           <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
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
           <template >
             <el-tooltip  effect="dark" content="修改" placement="top" >
               <el-button type="primary" icon="el-icon-edit" size='mini'></el-button>
             </el-tooltip>

             <el-tooltip class="item" effect="dark" content="删除" placement="top">
               <el-button type="danger" icon="el-icon-delete" size='mini'></el-button>
             </el-tooltip>
             
             <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
               <el-button type="warning" icon="el-icon-setting" size='mini'></el-button>
            </el-tooltip>
            
           </template>
         </el-table-column>
       </el-table>
       
       <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
       </el-pagination>

     </el-card>

  </div>
</template>

<script>
export default {
  data() {   
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
      // 添加的用户表单数据
      addForm:{
        username:"",
        password:'',
        email:"",
        mobile:''
      },

      // 添加用户时的验证规则
      addFormRules:{
        username:[
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10个字符', trigger: 'blur' }
        ],
        password:[
           { required: true, message: '请输密码', trigger: 'blur' },
           { min: 6, max: 10, message: '长度在 6到 10个字符', trigger: 'blur' }
        ],
        email:[
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            // { validator:checkEmail,trigger: 'blur'}
              { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        mobile:[
             { required: true, message: '电话号码', trigger: 'blur' },
             { validator:checkMobile,trigger: 'blur' }
        ]

      }

    }
      //定义验证邮箱的规则
      //  var checkEmail = (rule,value,cb) =>{
      //    const regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
      //    if(regEmail.test(value)){
      //      return cb()
      //    }
      //    else cb(new Error("请输入合法的邮箱"))
      //  }

       //定义验证电话号码的规则
        var checkMobile = (rule,value,cb) =>{
          const regMobile =/^1[34578]\d{9}$$/
          if(regMobile.test(value)){
            return cb()
          }
          else cb(new Error("请输入合法的手机号"))
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
         return this.message.error("更新用户状态失败")
       }
        // this.message.success("sds")
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