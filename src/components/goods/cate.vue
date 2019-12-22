<template>
  <div>
    <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>   

   <!-- 卡片视图 -->
   <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addCate">添加分类</el-button>    
        </el-col>    
      </el-row> 

      <!-- 商品分类表格 -->
        <zk-table :data='cateList' :columns='columns' :selection-type='false' :expand-type='false'
        show-index index-text='#' border class="zkstyle">
          <template slot="isok" slot-scope="scope">
            <i class="el-icon-error" style="color:red" v-if="scope.row.cate_deleted === false"></i>
            <i class="el-icon-success" style="color:lightgreen" v-else></i>
          </template>

          <template slot='rante' slot-scope="scope">
              <el-tag size='mini' v-if="scope.row.cat_level === 0">一级</el-tag>    
              <el-tag size='mini' type='success' v-else-if="scope.row.cat_level === 1">二级</el-tag>    
              <el-tag size='mini' type='warning' v-else>三级</el-tag>    
          </template>

          <template slot="do" slot-scope="scope">
              <el-button type='primary' size='mini' icon='el-icon-edit'>编写</el-button>
              <el-button type='danger' size='mini' icon='el-icon-delete'>删除</el-button>
          </template>
        </zk-table>
      <!-- 分页 -->
      <!-- current-page当前渲染的页数 -->
       <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[3, 5, 10, 15]" :page-size="queryInfo.pagesize" 
        layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
   </el-card>

   <!-- 添加分类的弹窗 -->
     <el-dialog title="添加分类" :visible.sync="setRantedialogVisible" width="45%"  @close='closeCate'>
        <!-- 添加分类的表单 -->
       <el-form :model="addCateForm" :rules="addCaterules" ref="ruleForm" label-width="100px">
         <el-form-item label="分类名称:" prop="cat_name">
           <el-input v-model="addCateForm.cat_name"></el-input>
         </el-form-item>

         <el-form-item label="分类添加到:">
           <el-cascader v-model="selectCate" :options="parenCateLists" :props="caseProps"
            @change="cateChange" clearable ></el-cascader>
         </el-form-item>
       </el-form>

       <span slot="footer" class="dialog-footer">
         <el-button @click="setRantedialogVisible = false">取 消</el-button>
         <el-button type="primary" @click="add">确 定</el-button>
       </span>
    </el-dialog>

  </div>  
</template>

<script>
export default {
  data() {
      return {
          //商品分类诗句列表
         cateList:[],
         //查询条件参数
         queryInfo:{
             type :3,
             pagenum:1,
             pagesize:5
         },
         //保存获取到的父级分类数据
         parenCateLists:[],
         //添加分类的参数绑定
         addCateForm:{
             cat_name:"",
             //父级分类的id
             cat_pid:0,
            //默认添加的是一级分类
             cat_level:0
         },
        //  总数据条数
         total:0,
         addCaterules:{
             cat_name:[
                 { required: true, message: '请输入分类名称', trigger: 'blur' },
             ]
         },
         //配置级联选择器的配置
         caseProps:{
             expandTrigger: 'hover',
             checkStrictly: true,
             value:'cat_id',
             label:'cat_name',
             children:'children'
         },
        //  选中的分类
         selectCate:[],
         //为zk-table指定列的数据和列的名称
         columns:[{
           label:'分类名称',
           prop:'cat_name'
         },{
             //将当前列定义为模板列
             label:'是否有效',
             type:"template",
             template:'isok'
         },{
              //将当前列定义为模板列
             label:'等级',
             type:"template",
             template:'rante'
         },{
              //将当前列定义为模板列
             label:'操作',
             type:"template",
             template:'do'
         }],
         setRantedialogVisible:false
      }
  },
  created() {
      this.getCateLists()
  },
  methods: {
      getCateLists(){
          var that = this
        this.$http.get('categories',{params:this.queryInfo}).then(function(result){
            var res = result.data
            if(res.meta.status !==200){
              return that.$message.error('获取商品分类失败')
            }
            that.$message.success('获取商品分类成功')
            that.cateList = res.data.result
            that.total = res.data.total
            console.log(that.cateList)
        })
      },
      //监听pagesize改变事件,得到最新的
      handleSizeChange(newPageSizes){
        this.queryInfo.pagesize = newPageSizes
        this.getCateLists()
      },
      //当前页码值改变
      handleCurrentChange(newPage){
        this.queryInfo.pagenum = newPage
        this.getCateLists()
      },
      //添加分类分对话框
      addCate(){
          //获取父级分类的数据
        this.getParentCateList()
        this.setRantedialogVisible = true
      },
      //获得添加分类的父级
      getParentCateList(){
        var that = this
        this.$http('categories',{params:{type:2}}).then(function(result){
            var res = result.data
            if(res.meta.status !==200)
              return that.$message.error('获取父级分类数据失败')
            that.parenCateLists = res.data
            console.log(res.data);
        })
      },
      //选择要添加的分类的父级id 选择就触发
      cateChange(){
        //如果selectCate == 0 则没有选中父级的分类
        if(this.selectCate.length > 0){
             //赋值给最近的一个父类添加分类
            this.addCateForm.cat_pid = this.selectCate[this.selectCate.length-1]
            //为当前的分类赋值
            this.addCateForm.cat_level = this.selectCate.length
        } else{
            this.addCateForm.cat_pid = 0
            this,addCateForm.cat_level = 0
        }
      },
     closeCate(){
          this.$refs.ruleForm.resetFields()
          this.selectCate =[]
          this.addCateForm.cat_level = 0
          this.addCateForm.cat_pid = 0
        //   this.addCateForm.cat_name = ''
      },
      //点击按钮添加分类
      add(){
          var that = this
          this.$refs.ruleForm.validate(valid =>{
              if(!valid) return
              this.$http.post('categories',this.addCateForm).then(function(result){
                  var res = result.data
                  if(res.meta.status !==201){
                      return that.$message.error('添加分类失败')
                  }
                  that.$message.success('添加分类成功')
                  that.getCateLists()
                  that.setRantedialogVisible = false
              })
          })
         

      }
  },
}
</script>

<style>
  .zkstyle{
      margin-top: 15px;
  }
</style>