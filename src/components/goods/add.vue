<template>
  <div>
          <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品添加</el-breadcrumb-item>
    </el-breadcrumb>  

    <!-- 卡片视图 -->
      <el-card>
        <el-alert title="添加商品信息" type="info" center show-icon :closable='false'></el-alert>    
        <!-- 步骤条 -->
        <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
          <el-step title="基本信息"></el-step>
          <el-step title="商品参数"></el-step>
          <el-step title="商品属性"></el-step>
          <el-step title="商品图片"></el-step>
          <el-step title="商品内容"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>

        <el-form :model="addGoodruleForm" :rules="addGoodrules" ref="addGoodruleFormRef" label-width="100px" label-position='top'>
          <el-tabs v-model="activeIndex" :tab-position="tabPosition" :before-leave ='beforeTabLeave' @tab-click = 'tabClick'>
            <el-tab-pane label="基本信息" name = '0'>
              <el-form-item label = '商品名称' prop = 'goods_name'>
                <el-input v-model="addGoodruleForm.goods_name"></el-input>
              </el-form-item>

              <el-form-item label = '商品价格' prop = 'goods_price'>
                <el-input v-model="addGoodruleForm.goods_price" type='number'></el-input>
              </el-form-item>

              <el-form-item label = '商品重量' prop = 'goods_weight'>
                <el-input v-model="addGoodruleForm.goods_weight" type='number'></el-input>
              </el-form-item>

              <el-form-item label = '商品数量' prop = 'goods_number'>
                <el-input v-model="addGoodruleForm.goods_number" type='number'></el-input>
              </el-form-item>

              <el-form-item label = '商品分类' props = 'goods_cat'>
                <el-cascader v-model="addGoodruleForm.goods_cat" :options="cateList" :props="cateProps"
                @change="handleChange"></el-cascader>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品参数" name = '1'>
              <el-form-item :label = 'item.attr_name' v-for="item in manyTabData " :key="item.attr_id">
                <!-- 复选框 -->
                <el-checkbox-group v-model="item.attr_vals">
                  <el-checkbox border  :label='item1' v-for="(item1, index) in item.attr_vals" :key="index"></el-checkbox>
                </el-checkbox-group>  
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品属性" name = '2'>
              <el-form-item :label = 'item.attr_name' v-for="item in onlyTabData" :key="item.attr_id">
                <el-input v-model="item.attr_vals"> </el-input>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品图片" name = '3'>
                <!-- action图片上传的接口 -->
                <!-- on-preview预览图片 -->
              <el-upload :headers = 'headerObj' action="http://127.0.0.1:8888/api/private/v1/upload" :on-preview="handlePreview"
               :on-remove="handleRemove" list-type="picture" :on-success = 'upPicSucces'>
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-tab-pane>
            <el-tab-pane label="商品内容" name = '4'>
             <!-- 富文本编辑器 -->
               <quill-editor v-model="addGoodruleForm.good_introduce"></quill-editor>
               <el-button type = 'primary' class="btnAdd" @click="addGoods">添加商品</el-button>
            </el-tab-pane>
          </el-tabs>
        </el-form>
        <!-- 上传图片预览 -->
          <el-dialog title="提示" :visible.sync="picDialogVisible" width="80%">
            <img :src="showPic" alt="">
          </el-dialog>
      </el-card>
  </div>  
</template>

<script>
import _ from 'lodash'
export default {
  data() {
    return {
      activeIndex:'0',
      tabPosition:'left',
      addGoodruleForm:{
          goods_name:'',
          goods_price:0,
          goods_weight:0,
          goods_number:0,
          //商品所属的分类数组
          goods_cat:[],
          //图片地址
          pics:[],
        //   商品详情
          good_introduce:'',
          attrs:[]
      },
       //   图片上传的Header请求头
      headerObj:{
         Authorization : window.sessionStorage.getItem('token')
      },
      showPic:'',
      picDialogVisible:false,
      manyTabData:[],
      onlyTabData:[],
      cateList:[],
      //级联选择器的配置
      cateProps:{
         expandTrigger: 'hover',
         //看到的选择器内容
         label:'cat_name',
         //选中的值
         value:'cat_id',
         //父子节点嵌套方式
         children:'children'

      },
      addGoodrules:{
          goods_name:[
            {required:true,message:'请输入商品名称',tirgger:"blur"}
          ],
          goods_price:[
            {required:true,message:'请输入商品价格',tirgger:"blur"},
          ],
          goods_weight:[
            {required:true,message:'请输入商品重量',tirgger:"blur"},
          ],
          goods_number:[
            {required:true,message:'请输入商品数量',tirgger:"blur"},
          ],
          goods_cat:[
            {required:true,message:'请选择商品分类',tirgger:"blur"},
          ]
      }
    }
  },
  created() {
    this.getCateList()
  },
  computed: {
    cateId(){
      if(this.addGoodruleForm.goods_cat.length === 3){
        return this.addGoodruleForm.goods_cat[2] 
      }
      return null   
    }
  },
  methods: {
      //获取所有商品分裂数据
    getCateList(){
      var that = this 
      this.$http.get('categories').then(function(result){
        const res = result.data
        if(res.meta.status !== 200)
          return that.$message.error('获取商品分类数据失败')
        that.cateList = res.data
        console.log(res.data);
      })
    },
    //级联选择器变化,触发
    handleChange(){
      if(this.addGoodruleForm.goods_cat.length !== 3)
        this.addGoodruleForm.goods_cat.length === []
    },

    beforeTabLeave(activeName,oldActiveName){
    //   console.log('即将离开的Tab是'+oldActiveName);
    //   console.log('即将进入的Tab是'+activeName);
    if(oldActiveName === '0' && this.addGoodruleForm.goods_cat.length !== 3){
      this.$message.error('请先选择商品分类')
      return false
      }
    },
    // tab标签点击事件
    tabClick(){
    //   console.log(this.activeIndex);
    if(this.activeIndex === '1'){
    // 是否访问的是动态参数面板
      var  that = this
      this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:'many'}}).then(function(result){
        const res = result.data 
        if(res.meta.status !== 200){
          return that.$message.error('获取动态参数失败')
        }
        // console.log(res.data);
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? []:
            item.attr_vals.split(' ')
        })
        console.log(res.data);
        that.manyTabData = res.data
      })
     } else if(this.activeIndex === '2'){
         var  that = this
      this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:'only'}}).then(function(result){
        const res = result.data 
        if(res.meta.status !== 200){
          return that.$message.error('获取动态参数失败')
        }
        // console.log(res.data);
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? []:
            item.attr_vals.split(' ')
        })
        console.log(res.data);
        that.onlyTabData = res.data
      })
     }
    },
    //处理图片上传后预览
    handlePreview(file){
      this.showPic = file.response.data.url
      this.picDialogVisible = true
    },
    //处理图拍了移除的操作
    handleRemove(file){
      const filePath = file.response.data.tmp_path
      const index =  this.addGoodruleForm.pics.findIndex(x =>{
          x.pic ===filePath
      })
      this.addGoodruleForm.pics.splice(index,1)
    },
    //图片上传成功的监听
      upPicSucces(response){
    //    console.log(response);
      const picInfo = {pic:response.data.tmp_path}
      this.addGoodruleForm.pics.push(picInfo)
      console.log(this.addGoodruleForm);
     },
    //  添加商品
     addGoods(){
       this.$refs.addGoodruleFormRef.validate(valid =>{
         if(!valid) return this.$message('还有信息为填写')
        //  拷贝 两个对象数据一样 因为这里添加商品 good_cat 保存的数组  提交需要的是字符串  不能直接转化 报错
        const form =  _.cloneDeep(this.addGoodruleForm)
        form.goods_cat = form.goods_cat.join(',')
        console.log(form);
        //处理动态参数
        this.manyTabData.forEach(item =>{
          const newInfo = {
              attr_id:item.attr_id,
              attr_value:item.attr_vals.join(' ')
          }
          this.addGoodruleForm.attrs.push(newInfo)
        })
        //处理静态属性
        this.onlyTabData.forEach(item =>{
          const newInfo = {
             attr_id:item.attr_id,
              attr_value:item.attr_vals
          }
          this.addGoodruleForm.attrs.push(newInfo)
        })
         form.attrs = this.addGoodruleForm.attrs
         console.log(form);
         var that = this 
         this.$http.post('goods',form).then(function(result){
            const res = result.data
            if(res.meta.status !== 201){
              return that.$message.error('添加商品失败')
            }
              
            that.$message.success('添加商品成功')
            that.$router.push('/goods')
         })
       })
     }


  },

  
}
</script>

<style>
  .el-steps{
      margin :20px auto;
  }
  .el-checkbox{
      margin :0 5px 0 0 !important;
  }
  .ql-editor{
      min-height: 300px;
  }
  .btnAdd{
      margin-top: 15px;
  }
</style>