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

      <el-table :data="orderData" border  height="350" >
        <el-table-column type = 'index'></el-table-column>
        <el-table-column label = '订单列表' prop = 'order_number'></el-table-column>
        <el-table-column label = '订单价格' prop = 'order_price' width = '150'></el-table-column>
        <el-table-column label = '是否付款' width = '150'>
          <template slot-scope="scope">
            <el-tag v-if = "scope.row.pay_status !== '1'" type="danger" width = '150'>未付款</el-tag>
            <el-tag v-else type="success">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label = '是否发货' prop = 'is_send'></el-table-column>
        <el-table-column label = '下单时间' prop = 'create_time'>
          <template slot-scope="scope">
            {{scope.row.create_time | dateFormat}}  
          </template>
        </el-table-column>
        <el-table-column label = '操作'>
          <template slot-scope="scope">
            <el-button type = 'primary' icon = 'el-icon-edit' size = 'mini' @click = 'showUserAdress(scope)'></el-button>
            <el-button type = 'success' icon = 'el-icon-location' size = 'mini' @click = 'processs'></el-button>
          </template>
        </el-table-column>

      </el-table>
          <!-- 分页功能 -->
        <el-pagination  @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryOrderList.pagenum"
         :page-sizes="[5, 10, 15, 20]" :page-size="queryOrderList.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    
    <!-- 修改信息对话框 -->
    <el-dialog title="修改地址" :visible.sync="updateUserAddressdialogVisible" width="40%" @close = 'closeUpdateDialog'>
      <el-form :model="addAdressRuleForm" :rules="addAdressRules" ref="addAdressRuleFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader v-model="addAdressRuleForm.address1" :options="cityData" :props="cascaderProp"
          @change="handleChange">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addAdressRuleForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateUserAddressdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateUserAddressdialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 物流信息查看 -->
    <el-dialog title = '物流信息' :visible.sync="processsAddressdialogVisible" width = '40%'>
      <el-timeline :reverse="reverse">
        <el-timeline-item v-for="(activity, index) in processInfo" :key="index" :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata.js';
export default {
  data() {
    return {
       orderData:[],
       queryOrderList:{
         query : '',
         pagenum : 1,
         pagesize : 10
       },
       addAdressRuleForm:{
         address1: [],
         address2: ''
       },
       total: 0,
       updateUserAddressdialogVisible:false,
       processsAddressdialogVisible:false,
       addAdressRules:{
         address1:[
             { required: true, message: '请选择省市区县', trigger: 'blur' },
         ],
          address2:[
             { required: true, message: '请选择详细地址', trigger: 'blur' },
         ]
       },
       cityData,
       cascaderProp:{
          expandTrigger: 'hover',
          // children : 'children'
       },
       processInfo:[]
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
    },
    handleSizeChange(newSize){
      this.queryOrderList.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange(newPageNum){
      this.queryOrderList.pagenum = newPageNum
      this.getOrderList()
    },
    showUserAdress(row){
      this.updateUserAddressdialogVisible = true 
    },
    closeUpdateDialog(){
      this.$refs.addAdressRuleFormRef.resetFields();
    },
    processs(){
      var that =this
      this.$http.get('/kuaidi/1106975712662').then(function(result){
        var res = result.data
        if(res.meta.status !== 200){
          return that.$message.error('获取物流信息失败')
        }
        that.processInfo = res.data
        console.log(res.data);
      })
      this.processsAddressdialogVisible = true
    }

  },
}
</script>

<style>
 .input-with-select{
      width: 350px;
  }
</style>