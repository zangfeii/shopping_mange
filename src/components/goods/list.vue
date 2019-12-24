<template>
  <div>
      <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>  
    
    <el-card>
       <!-- 添加搜索商品 -->
       <el-row :gutter='20'>
         <el-col :span='8'>
            <el-input placeholder="请输入内容"  class="input-with-select">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
         </el-col>
         <el-col :span='3'>
             <el-button type='primary'>添加商品</el-button>
         </el-col>
       </el-row>
       <!-- 商品列表 -->
       <el-table :data='goodList'>
           <el-table-column type='index'></el-table-column>
           <el-table-column label='商品名称' prop='goods_name' width='450px'></el-table-column>
           <el-table-column label='商品价格(元)' prop='goods_price' width='120px'></el-table-column>
           <el-table-column label='商品重量' prop='goods_weight' width='120px'></el-table-column>
           <el-table-column label='创建时间' prop='add_time' wdith='190px'>
             <template slot-scope="scope">
               {{scope.row.add_time | dateFormat}}
             </template>
           </el-table-column>
           <el-table-column label='操作'>
             <template slot-scope="scope">
               <el-button type="primary" icon="el-icon-edit" size='mini'></el-button>
               <el-button type="danger" icon="el-icon-delete" size='mini'></el-button>
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
          //商品列表
          goodList:[],
          total:''
        }
    },
    created() {
        this.getGoodList()
    },
    methods: {
        //获取商品列表
        getGoodList(){
            var that = this
            this.$http.get('goods',{params:{
                query:'',
                pagenum:1,
                pagesize:13}
            }).then(function(result){
                const res = result.data
                if(res.meta.status !== 200){
                    console.log(res);
                    return that.$message.error('获取商品列表失败')
                }
                that.goodList = res.data.goods
                that.total = res.data.total
                console.log(res.data.goods);
                that.$message.success('获取商品列表成功')  
            })

        }
    },
}
</script>

<style>

</style>