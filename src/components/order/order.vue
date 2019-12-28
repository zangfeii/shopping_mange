<template>
  <div>
     <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>  
    
    <el-card>
      <el-row>
        <el-col>
          <el-input placeholder="请输入内容" v-model="input3" class="input-with-select">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        </el-col>
      </el-row>

      <el-table :data="orderData">
        <el-table-column type = 'index'></el-table-column>
        <el-table-column label = '订单列表' prop = 'order_number'></el-table-column>
        <el-table-column label = '订单价格' prop = 'order_price'></el-table-column>
        <el-table-column label = '是否付款'>
          <template slot-scope="scope">
            <el-tag v-if = "scope.order_pay !== 0" type="danger">未付款</el-tag>
            <el-tag v-else type="success">已付款</el-tag>
          </template>
        </el-table-column>

        <el-table-column label = '是否发货' prop = 'is_send'></el-table-column>
        
      </el-table>

      
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
       orderData:[],
       queryOrderList:{
         query : '',
         pagenum : 1,
         pagesize : 10
       },
       total: 0
    }
  },
  created() {
    this.getOrderList() 
  },
  methods: {
    getOrderList() {
      var that = this
      this.$http.get('orders',{params:this.queryOrderList}).then(function(result){
        const res = result.data
        if(res.meta.status !== 200){
          console.log(res);
          return that.$message.error('获取订单数据失败')
        }
        that.total = res.data.total
        that.orderData = res.data.goods
        console.log(res.data);
      })
    }
  },
}
</script>

<style>
 .input-with-select{
      width: 350px;
  }
</style>