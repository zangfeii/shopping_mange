<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>  

    <el-card>
      <div id = 'main' style =' width:600px;height:400px'>
        
      </div>
    </el-card>
    
  </div>  
</template>

<script>
var echarts = require('echarts');
import _ from 'lodash'
export default {
  data() {
    return {
        options: {
          title: {
            text: '用户来源'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#E9EEF3'
              }
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              boundaryGap: false
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ]
        } 
    }
  },
  //页面上的元素渲染完毕
  mounted() {
    var myChart = echarts.init(document.getElementById('main'));
    var that = this
    this.$http.get('reports/type/1').then(function(result){
      const res = result.data
      if(res.meta.status !== 200){
        return that.$message.error('获取这折线图数据失败')
      }
      const Result = _.merge(res.data,that.options)
       myChart.setOption(Result);
    })
    // var option = {
    //         title: {
    //             text: 'ECharts 入门示例'
    //         },
    //         tooltip: {},
    //         legend: {
    //             data:['销量']
    //         },
    //         xAxis: {
    //             data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
    //         },
    //         yAxis: {},
    //         series: [{
    //             name: '销量',
    //             type: 'bar',
    //             data: [5, 20, 36, 10, 10, 20]
    //         }]
    //     };
    
  },
}
</script>

<style>
  .el-breadcrumb{
    margin: 5px 0  0 5px;
  }
</style>