<template>
  <div>
      <!-- 面包屑导航区域 -->
     <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
   
     <!-- 卡片视图 -->
      <el-card>
          <el-table :data='rightsList' border strip>
              <el-table-column type='index'></el-table-column>
              <el-table-column label='权限' prop='authName'></el-table-column>
              <el-table-column label='路径' prop='path'></el-table-column>
              <el-table-column label='权限等级' prop='level'>
                  <template slot-scope="scope">
                       <el-tag v-if="scope.row.level ==='0'">一级</el-tag>
                       <el-tag type='success' v-else-if="scope.row.level==='1'">二级</el-tag>
                       <el-tag type='warning' v-else>三级</el-tag>
                  </template>
              </el-table-column>
          </el-table>
      </el-card>
  </div>  
</template>

<script>
export default {
  name:"Rights",
  created() {
      this.getRightList()
  },
  data() {
      return {
        //   权限列表
          rightsList:[]
      }
  },
  methods: {
    getRightList(){
        //this改变了 需要重新定义
         var that = this
        this.$http.get('rights/list').then(function(res){
              const result = res.data
              if(result.meta.status ===200){
                  that.$message.success("获取权限列表成功")
                  that.rightsList = res.data.data
                  console.log(that.rightsList)
              }
             else return that.$message.error("获取权限列表失败")
        
        },function(err){}).catch(err => err)
    }
  },
}
</script>

<style>

</style>