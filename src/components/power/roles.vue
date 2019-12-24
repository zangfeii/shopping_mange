<template>
    <div>
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
        <!-- 添加角色按钮区 先行 后列  行属性gutter 列之间的距离 -->
        <el-row>
            <el-col>
                <el-button type='primary' @click="addRoleDialog">添加角色</el-button>
            </el-col>
        </el-row>

        <!-- 角色列表 -->
        <el-table :data='roleList'>
            <!-- 展开列 -->
            <el-table-column type='expand'>
                <template slot-scope="scope">
                  <el-row :class="['rightBoton',index === 0 ? 'rightTop':'','vcenter']" v-for="(item,index) in scope.row.children" :key="item.id">
                      <!-- 一级权限 -->
                      <el-col :span='5'>
                          <el-tag closable @close='removeRightById(scope.row,item.id)' class="firstRightsClass">{{item.authName}}</el-tag>
                          <i class="el-icon-caret-right"></i>
                      </el-col>
                       <!-- 二三级权限 -->
                      <el-col :span='19'>
                          <el-row :class="[index ===0 ? '':'rightTop','vcenter']" v-for="(item1, index) in item.children" :key="item1.id">
                              <el-col :span='6'>
                                  <el-tag type=success closable @close='removeRightById(scope.row,item1.id)'>{{item1.authName}}</el-tag>
                                  <i class="el-icon-caret-right"></i>
                              </el-col>
                              <el-col :span='18'>
                                  <el-tag type='warning' closable @close='removeRightById(scope.row,item2.id)' v-for="item2 in item1.children" :key="item2.id">{{item2.authName}}</el-tag>
                              </el-col>
                          </el-row>
                      </el-col>
                  </el-row>
                </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type='index'></el-table-column>
            <el-table-column label='角色名称' prop='roleName'></el-table-column>
            <el-table-column label='角色描述' prop='roleDesc'></el-table-column>
            <el-table-column label='操作' width='300px'>
                <template slot-scope="scope">
                   <el-button size='mini' type="primary" icon="el-icon-edit" @click="ater(scope.row)">修改</el-button>
                   <el-button size='mini' type="danger" icon="el-icon-delete" @click="deleteRole(scope.row)">删除</el-button>
                   <el-button size='mini' type="warning" icon="el-icon-setting" @click="showRightDialog(scope.row)">分配权限</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
  
    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightdialogVisible"  width="50%" @close='outClaerRightList'>
      <!-- 树形控件 -->
        <el-tree :data='rightsList' ref='tree' show-checkbox :props="treeProps" node-key='id'  default-expand-all :default-checked-keys='defKeys'></el-tree> 

        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRights">确 定</el-button>
         </span>
    </el-dialog>

  <!-- 添加角色对话框 -->
  <el-dialog title="添加角色" :visible.sync="addRoledialogVisible" width="40%" @close='addRoleClose'>
  <!-- //添加角色form表单 -->
    <el-form :model="addRuleForm" :rules="addRules" ref="addRuleFormRef" label-width="100px">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="addRuleForm.roleName"></el-input>
      </el-form-item>

      <el-form-item label="角色描述" prop="roleDesc">
        <el-input v-model="addRuleForm.roleDesc"></el-input>
      </el-form-item>
    </el-form>
    <!-- Dialog的底部 -->
  <span slot="footer" class="dialog-footer">
    <el-button @click="addRoledialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addRole">确 定</el-button>
  </span>
</el-dialog>

<!-- 修改角色 -->
  <el-dialog title="提示" :visible.sync="aterdialogVisible" width="40%">
     <el-form :model="queryRole" :rules="aterRules" ref="aterRuleFormRef" label-width="100px">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="queryRole.roleName"></el-input>
      </el-form-item>

      <el-form-item label="角色描述" prop="roleDesc">
        <el-input v-model="queryRole.roleDesc"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="aterdialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="modif">确 定</el-button>
    </span>
  </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
      return {
        //   接受角色列表数据
        roleList:[],
        //是否弹出分配权限对话框
        setRightdialogVisible:false,
        //权限数据
        rightsList:[],
        //树形控件的绑定对象
        treeProps:{
            label:'authName',
            children:'children'
        },
        //添加角色对象
        addRuleForm:{
          roleName:'',
          roleDesc:''
        },
        queryRole:{
          roleName:'',
          roleDesc:''
        },
        //添加角色的对话框弹出
        addRoledialogVisible:false,
        //修改角色的对话框
        aterdialogVisible:false,
        //默认选中的树节点的值的id数组
        defKeys:[],
        // 点击分配角色权限的角色id
        roleId:'',
        addRules:{
          roleName:[
             { required: true, message: '请输入角色名称', trigger: 'blur' }
          ],
          roleDesc:[
             { required: true, message: '请输入角色角色描述', trigger: 'blur' }
          ]
        },
        aterRules:{
           roleName:[
             { required: true, message: '请输入角色名称', trigger: 'blur' }
          ],
          roleDesc:[
             { required: true, message: '请输入角色角色描述', trigger: 'blur' }
          ]
        }
      }
  },
  created() {
      //获取角色列表
      this.getRolesList()
  },
  methods: {
      getRolesList(){
          var that = this
          this.$http.get('roles').then(function(res){
              console.log(res)
              const result = res.data
              if(result.meta.status ===200){
                  that.roleList = result.data
                  that.$message.success('成功获取角色列表')
              }   
          },function(err){})

      },
    //   根据id删除对应的权限
    async  removeRightById(role,rightId){
        //  点击分配角色权限的角色id
        var that = this
         //弹窗提示是否删除
        const result = await  this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err =>err)
            if(result !=='confirm')
              return this.$message.info('取消删除')
            const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
            if(res.meta.status !==200)
              return this.$message.error('删除权限失败')
            // this.getRolesList()  页面完整渲染不利于使用
            // 把服务器返回的最新信息赋值
            role.children = res.data
            this.$message.success('删除权限成功')
      },

    //   展示分配权限的的对话框
    async  showRightDialog(role){
        //   获取所有权限的数据
        this.roleId = role.id
        const {data:res} = await this.$http.get('rights/tree')
        if(res.meta.status !== 200)
          return this.$message.error("获取权限数据失败")
        this.rightsList = res.data
        console.log(this.rightsList)
        this.getLeafKey(role,this.defKeys)
        this.setRightdialogVisible = true
        console.log(role)
        console.log(this.defKeys)
      },

      //通过递归的形式,获取角色的三级权限的id 并保存到defKyes:[]
    getLeafKey(node,arr){
        //如果当前接节点不包含children属性 是三级节点
        if(!node.children){
            return arr.push(node.id)
        }
        node.children.forEach(item =>
        this.getLeafKey(item,arr))
    },
    // 监听分配对话框关闭事件,保证关闭对话,清空defKeys 避免造成多次点击,数组存储所有权限id
    outClaerRightList(){
        this.defKeys = []
    },

    // 为角色分配权限
  async allotRights(){
        //所有全选或者半选的id
        const key = [
            ...this.$refs.tree.getCheckedKeys(),
            ...this.$refs.tree.getHalfCheckedKeys()
        ]

        const idStr = key.join(',')
        console.log(key);
        const {data:res}  = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
        if(res.meta.status !== 200)
          return this.$message.error('更新权限失败')
        this.$message.success('分配权限成功')
        this.getRolesList()
        this.setRightdialogVisible = false
    },
    //添加角色对话框
    addRoleDialog(){
      this.addRoledialogVisible = true
    },
    // 添加角色后离开时的操作
    addRoleClose(){ 
      this.$refs.addRuleFormRef.resetFields();
    },
    //添加角色
    addRole(){
      this.$refs.addRuleFormRef.validate(async valid =>{
      if(!valid) return
      var that = this
      this.$http.post('roles',{
      roleName:this.addRuleForm.roleName,
      roleDesc:this.addRuleForm.roleDesc
    }).then(function(result){
      var res = result.data
      if(res.meta.status !== 201)
        return that.$message.error('创建'+that.addRuleForm.roleName+'角色失败')
      that.getRolesList()
      that.$message.success('创建'+that.addRuleForm.roleName+'角色成功')
      that.addRoledialogVisible = false
         })
      })
     
    },

   async deleteRole(role){
    const  result = await this.$confirm('此操作将永久删'+role.roleName+'角色', '是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        // console.log(role.data);
        if(result === 'cancel'){
          console.log(role.id);
         return this.$message.info('取消删除'+role.roleName+'角色')
        }   
        var that = this
        this.$http.delete(`roles/${role.id}`).then(function(result){
          const res = result.data
          if(res.meta.status !== 200){
            console.log(res);
            return that.$message.error('删除'+role.roleName+'角色失败')
          }
           
          that.getRolesList()
          that.$message.success('删除'+role.roleName+'角色成功')
        })
    },
    //修改前查询角色信息
    async  ater(role){
     this.aterdialogVisible = true
     const {data:res} = await this.$http.get(`roles/${role.id}`)
     if(res.meta.status !== 200)
       return 
     this.queryRole = res.data
    //  console.log(this.queryRole);
     
    },
    //修改信息
  async  modif(){
      this.$refs.aterRuleFormRef.validate(async valid =>{
        if(!valid) return
        const {data:res} = await this.$http.put(`roles/${this.queryRole.roleId}`,{
          roleName:this.queryRole.roleName,
          roleDesc:this.queryRole.roleDesc
        })
        
        if(res.meta.status !== 200){
          // console.log(this.queryRole.roleId);
          return this.$message.error('修改信失败')
        }
        this.$message.success('修改信息成功')
        this.getRolesList()
        this.aterdialogVisible = false

      })
     
    }
  },
}
</script>

<style>
  .firstRightsClass{
      margin: 7px;
  }
  .rightBoton{
     border-bottom: 1px solid #eeeeee;
  }
  .rightTop{
     border-top: 1px solid #eeeeee;
  }
  .vcenter{
      display: flex;
      align-items: center;
  }
</style>