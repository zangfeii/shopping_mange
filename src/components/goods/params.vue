<template>
  <div>
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>  

    <!-- 卡片视图  -->
    <el-card>
      <el-alert  :closable="false"  show-icon title="注意:只允许修改第三等级分类的参数" type='warning'></el-alert>
      <!-- 选择商品分类 -->
      <el-row  class="row1">
          <el-col>
            <span>选择商品分类:    </span>
            <el-cascader v-model="selectCatekeys" :options="cateList" :props="cascderPropSeting"
            @change="handleChange"></el-cascader>
          </el-col>
      </el-row>

      <!-- tab页签区域 -->
        <el-tabs v-model="activeName" @tab-click="handTableClick">
          <el-tab-pane label="动态参数" name="many">
            <el-button type='primary' size='mini' :disabled='isBtnDisable' @click="addPropsdialogVisible =true">添加参数</el-button>
             <!-- 动态参数的表格 -->
             <el-table :data="manyData" border stripe>
                 <el-table-column type='expand'></el-table-column>
                 <el-table-column type='index'></el-table-column>
                 <el-table-column label='参数名称' prop='attr_name'></el-table-column>
                 <el-table-column label='操作'>
                   <template slot-scope="scope">
                     <el-button type='primary' icon='el-icon-edit' size='mini' @click="updateEditDialog(scope.row.attr_id)">修改</el-button>        
                     <el-button type='danger' icon='el-icon-delete' size='mini' @click="deleteParams(scope.row.attr_id)">删除</el-button>        
                   </template>
                 </el-table-column>
             </el-table>
          </el-tab-pane>
          <el-tab-pane label="静态属性" name="only">
            <el-button type='primary' size='mini' :disabled='isBtnDisable'  @click="addPropsdialogVisible = true">添加属性</el-button>
            <!-- 静态属性的表格 -->
            <el-table :data="onlyData" border stripe>
                 <el-table-column type='expand'></el-table-column>
                 <el-table-column type='index'></el-table-column>
                 <el-table-column label='属性名称' prop='attr_name'></el-table-column>
                 <el-table-column label='操作'>
                   <template slot-scope="scope">
                     <el-button type='primary' icon='el-icon-edit' size='mini' @click="updateEditDialog(scope.row.attr_id)">修改</el-button>        
                     <el-button type='danger' icon='el-icon-delete' size='mini' @click="deleteParams(scope.row.attr_id)">删除</el-button>        
                   </template>
                 </el-table-column>
             </el-table>
          </el-tab-pane>
        </el-tabs>
    </el-card>

    <!-- 添加参数的对话框 -->
    <el-dialog :title="'添加'+titleText" :visible.sync="addPropsdialogVisible" width="50%"
    @close="handleClose">
      <el-form :model="addForm" :rules="addrules" ref="addruleFormRef" label-width="100px">
        <el-form-item :label="titleText+':'" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
     </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addPropsdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数的对话框 -->
      <el-dialog :title="'添加'+titleText" :visible.sync="updatePropsdialogVisible" width="50%"
    @close="updateHandleClose">
      <el-form :model="updateForm" :rules="updaterules" ref="updateruleFormRef" label-width="100px">
        <el-form-item :label="titleText+':'" prop="attr_name">
          <el-input v-model="updateForm.attr_name"></el-input>
        </el-form-item>
     </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updatePropsdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
      return {
         cateList:[] ,
         //级联选择器的配置对象
         cascderPropSeting:{
             expandTrigger: 'hover',
             checkStrictly: true,
             //axios获取的值的值
             value:'cat_id',
             label:'cat_name',
             //父子节点嵌套恶属性
             children:'children'
         },
         //自己选中的类的值
         selectCatekeys:[],
         //默认Tab标签被激活的标签
         activeName:'many',
         manyData:[],
         onlyData:[],
         addPropsdialogVisible:false,
         updatePropsdialogVisible:false,
         //添加属性或者参数的数据对象
         addForm:{
             attr_name:''
         },
         //修改属性或者参数的数据对象
         updateForm:{
             attr_name:''
         },
         //验证规则
         addrules:{
             attr_name:[
                 { required: true, message: '请输入参数名称', trigger: 'blur' }
             ]
         },
         updaterules:{
              attr_name:[
                 { required: true, message: '请输入参数名称', trigger: 'blur' }
             ]
         }

      }
  },
  created() {
      this.getList()
  },
  computed: {
      isBtnDisable(){
        //   检测添加按钮是否被禁用
          if(this.selectCatekeys.length !== 3)
            return true
          else return false
      },
      //当前选中的id
      cateId(){
           if(this.selectCatekeys.length ===3)
             return this.selectCatekeys[2]
           else return null
      },
      //动态计算添加参数或属性的文本
      titleText(){
         if(this.activeName === 'many')
           return '动态参数'
        else 
           return '静态属性'
      }
  },
  methods: {
      getList(){
          var that = this
          this.$http.get('categories').then(function(result){
              var res = result.data
              if(res.meta.status !== 200)
                return  that.$message.error('获取商品分类失败')
             console.log(res.data);
             that.cateList = res.data
             that.$message.success('获取商品分类成功')
             
          })
      },
      //选择不同的分类 级联选择框变化,触发这个函数
      handleChange(){
         this.getParamsData()
      },

      //获取要添加的参数参数列表
      getParamsData(){
         //判断是否选中的是三级分类,只能修改三级分类的参数
         if(this.selectCatekeys.length !== 3){
             this.selectCatekeys = []
             return
         }
         console.log(this.selectCatekeys);
         var that = this 
         this.$http.get(`categories/${that.cateId}/attributes`,{params:{sel:that.activeName}}).then(function(result){
             var res = result.data
            
             if(res.meta.status !== 200)
               return that.$message.error('获取该分类分级参数失败')
            console.log(res.data);
            //判断获取的是动态参数还是静态参数
            if(that.activeName ==='many'){
                that.manyData = res.data
            } else{
                that.onlyData = res.data
            }
         })

      },
    //   tab标签点击处理函数
      handTableClick(){
        console.log(this.activeName);
        this.getParamsData()
      },
      //添加参数成功后关闭的函数
      handleClose(){
          this.$refs.addruleFormRef.resetFields()
      },
    //   修改参数成功后关闭的函数
      updateHandleClose(){
           this.$refs.updateruleFormRef.resetFields()
      },
      addParams(){
          this.$refs.addruleFormRef.validate(valid =>{
              if(!valid) return
              var that = this
              this.$http.post(`categories/${this.cateId}/attributes`,{
                  attr_name:this.addForm.attr_name,
                  attr_sel:this.activeName
              }).then(function(result){
                  var res = result.data
                  console.log(res);
                  if(res.meta.status !==201)
                    return that.$message.error('添加参数失败')
                 that.$message.success('添加参数成功')
                 that.addPropsdialogVisible = false
                 that.getParamsData()
              })
          })
      },
      //修改编辑参数
      updateEditDialog(attr_id){
        this.updatePropsdialogVisible = true
        var that = this 
        this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`,{
            params:{attr_sel:this.activeName}
        }).then(function(result){
            var res = result.data
            console.log(res)
            if(res.meta.status !== 200)
              return that.$message.error('获取当前参数失败')
            that.updateForm = res.data
            
        })
      },
      updateParams(){
        this.updatePropsdialogVisible = false
        this.$refs.updateruleFormRef.validate(valid =>{
            if(!valid) return
            var that = this
            this.$http.put(`categories/${this.cateId}/attributes/${this.updateForm.attr_id}`,{
                attr_name:this.updateForm.attr_name,
                attr_sel:this.activeName
            }).then(function(result){
                var res = result.data
                if(res.meta.status !==200){
                    console.log(res);
                    return that.$message.error('修改参数失败')
                }
                that.$message.success('修改参数成功')
                that.getParamsData()
            })
        })
      },
      //删除参数
     async deleteParams(attr_id){
      const result = await  this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }) 
        if(result !== 'confirm')
          return this.$message.error('取消删除')
        const res = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
        if(res.data.meta.status !==200 ){
            console.log(res);
            return this.$message.error('删除参数失败')
        }
        this.$message.success('删除参数成功')
        this.getParamsData()
      }

  },
}
</script>

<style>
  .row1{
      margin-top: 4px;
      /* padding: 12px; */
  }
</style>