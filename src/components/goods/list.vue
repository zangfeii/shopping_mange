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
             <el-button type='primary' @click="showAddGoodsDialog">添加商品</el-button>
         </el-col>
       </el-row>
       <!-- 商品列表 -->
       <el-table :data='goodList' max-height="600">
           <el-table-column type='index'></el-table-column>
           <el-table-column label='商品名称' prop='goods_name' width='750' ></el-table-column>
           <el-table-column label='商品价格(元)' prop='goods_price' ></el-table-column>
           <el-table-column label='商品重量' prop='goods_weight' ></el-table-column>
           <el-table-column label='创建时间' prop='add_time'  >
             <template slot-scope="scope">
               {{scope.row.add_time | dateFormat}}
             </template>
           </el-table-column>
           <el-table-column label='操作' >
             <template slot-scope="scope">
               <el-button type="primary" icon="el-icon-edit" size='mini' @click="editGoods(scope.row.goods_id)"></el-button>
               <el-button type="danger" icon="el-icon-delete" size='mini'></el-button>
             </template>  
           </el-table-column>
       </el-table>
          <!-- 页码       -->
             <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryGoodsList.pagenum"
             :page-sizes="[5, 10, 30, 40]" :page-size="queryGoodsList.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
           </el-pagination>
    </el-card>

    <!-- 添加商品Dialog -->
    <el-dialog title="添加商品" :visible.sync="addGoodsdialogVisible" width="50%">
      <!-- 添加商品的表单 -->
        <el-form :model="addGoodsList" :rules="addrules" ref="addruleFormRef" label-width="100px" class="demo-ruleForm">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="addGoodsList.goods_name"></el-input>
          </el-form-item>

           <el-form-item label="goods_cat" prop="goods_cat">
            <el-input v-model="addGoodsList.goods_name"></el-input>
          </el-form-item>

           <el-form-item label="价格" prop="goods_price">
            <el-input v-model="addGoodsList.goods_price"></el-input>
          </el-form-item>

           <el-form-item label="数量" prop="goods_number">
            <el-input v-model="addGoodsList.goods_number"></el-input>
          </el-form-item>

           <el-form-item label="重量" prop="goods_weight">
            <el-input v-model="addGoodsList.goods_weight"></el-input>
          </el-form-item>

          <el-form-item label="简单介绍" prop="goods_introduce">
            <el-input v-model="addGoodsList.goods_introduce"></el-input>
          </el-form-item>

           <!-- <el-form-item label="简单介绍" prop="goods_introduce">
            <el-input v-model="addGoodsList.goods_introduce"></el-input>
          </el-form-item>

           <el-form-item label="简单介绍" prop="goods_introduce">
            <el-input v-model="addGoodsList.goods_introduce"></el-input>
          </el-form-item> -->
        </el-form>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
</el-dialog>

   <!-- 查询商品Dialog -->
    <el-dialog title="修改商品" :visible.sync="editGoodsdialogVisible" width="50%">
      <!-- 查询商品的表单 -->
        <el-form :model="editGoodsList" :rules="editrules" ref="editruleFormRef" label-width="100px" class="demo-ruleForm">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="editGoodsList.goods_name"></el-input>
          </el-form-item>

           <el-form-item label="goods_cat" prop="goods_cat">
            <el-input v-model="editGoodsList.goods_cat"></el-input>
          </el-form-item>

           <el-form-item label="价格" prop="goods_price">
            <el-input v-model="editGoodsList.goods_price"></el-input>
          </el-form-item>

           <el-form-item label="数量" prop="goods_number">
            <el-input v-model="editGoodsList.goods_number"></el-input>
          </el-form-item>

           <el-form-item label="重量" prop="goods_weight">
            <el-input v-model="editGoodsList.goods_weight"></el-input>
          </el-form-item>

          <el-form-item label="简单介绍" prop="goods_introduce">
            <el-input v-model="editGoodsList.goods_introduce"></el-input>
          </el-form-item>

           <el-form-item label="简单介绍" prop="goods_introduce">
            <el-input v-model="editGoodsList.goods_introduce"></el-input>
          </el-form-item>

           <el-form-item label="简单介绍" prop="goods_introduce">
            <el-input v-model="editGoodsList.goods_introduce"></el-input>
          </el-form-item>
        </el-form>
      <span slot="footer">
        <el-button @click="editGoodsdialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="editGoodsdialogVisible = false">确 定</el-button>
  </span>
</el-dialog>
  </div>  
</template>

<script>
export default {
    data() {
        return {
          //商品列表
          queryGoodsList:{
            query:'',
            pagenum:1,
            pagesize:10
          },
          goodList:[],
          total:0,
          addGoodsdialogVisible:false,
          editGoodsdialogVisible:false,
          addGoodsList:{
            goods_name:'',
            goods_cat:'',
            goods_price :'',
            goods_number:'',
            goods_weight:'',
            goods_introduce:'',
            pics:[],
            attrs:[]
          },
          editGoodsList:{},
          addrules:{
            goods_name:[
                { required: true, message: '请输入活动名称', trigger: 'blur' }
            ],
             goods_cat:[
               { required: true, message: '请输入活动名称', trigger: 'blur' }
            ],
              goods_price :[
               { required: true, message: '请输入活动名称', trigger: 'blur' }
            ],
               goods_number:[
               { required: true, message: '请输入活动名称', trigger: 'blur' }
            ],
                goods_weight:[
               { required: true, message: '请输入活动名称', trigger: 'blur' }
            ]

          }
        }
    },
    created() {
        this.getGoodList()
    },
    methods: {
        //获取商品列表
        getGoodList(){
            var that = this
            this.$http.get('goods',{params:this.queryGoodsList}).then(function(result){
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
        },
        showAddGoodsDialog(){
          this.addGoodsdialogVisible = true
        },
        handleSizeChange(newsize){
           this.queryGoodsList.pagesize = newsize
           this.getGoodList()
           console.log('newsixe'+newsize);
        },
        handleCurrentChange(newPage){
          this.queryGoodsList.pagenum = newPage
          this.getGoodList()
          console.log('page'+newPage);
        },
        editGoods(goodId){
          this.editGoodsdialogVisible = true
          var that = this
          this.$http.get(`goods/${goodId}`).then(function(result){
            var res = result.data
            if(res.meta.status !== 200) {
              console.log(res);
              return that.$message.error('获取该商品信息失败')
            }
            that.editGoodsList = res.data
            console.log(res);
            that.$message.success('获取该商品的信息成功')
           
          })
        
        }

    },
}
</script>

<style>

</style>