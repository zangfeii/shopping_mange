<template>  
   <el-container class="home-container">
       
    <el-header>
        <div>
          <img src="" alt="">
          <span>后台管理</span>
        </div>  
      <el-button type="info" @click="loginout">退出</el-button>
    </el-header>
  <el-container>
    <el-aside width="200px">
        <!-- 侧边栏菜单区域 -->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#ffd04b">
           <!-- 一级菜单 -->
        <el-submenu index="1">
             <!-- 一级菜单模板区域 -->
            <template slot="title">
               <!-- 图标 -->
          <i class="el-icon-location"></i>
          <!-- 文本 -->
          <span>导航一</span>
        </template>
               <el-menu-item index="1-4-1">选项1</el-menu-item>
            <!-- <el-submenu index="1-4">
                <template slot="title">选项4</template>
              <el-menu-item index="1-4-1">选项1</el-menu-item>
            </el-submenu> -->
        </el-submenu>

        <!-- <el-menu-item index="2">
            <i class="el-icon-menu"></i>
            <span slot="title">导航二</span>
        </el-menu-item>



        <el-menu-item index="3" disabled>
            <i class="el-icon-document"></i>
            <span slot="title">导航三</span>
        </el-menu-item>
        
        <el-menu-item index="4">
            <i class="el-icon-setting"></i>
            <span slot="title">导航四</span>
        </el-menu-item> -->
    </el-menu>
    </el-aside>
    <el-main>Main</el-main>
  </el-container>
</el-container>
</template>


<script>
export default {   
    data() {
        return {
            menuList:[]
        }
    },
  created() {
    //   生命周期函数,页面打开就获取数据
      this.getMenuList()
  },
    
  methods: {
      loginout(){
          //退出,先清空taken 
          window.sessionStorage.clear();
          this.$router.push('/login')
      },
    //   获取左侧菜单的数据
     async getMenuList(){
         const res = await this.$http.get('menus');
         console.log("左侧数据获取:");
         console.log(res);
         if(res.data.data.mteta.status !== 200)
           return this.$message.error(res.data.meta.msg)
        else this.menuList = res.data.data

      }
  }
}
</script>

<style>


.home-container{
    height: 100%;
}

.el-header{
    background:#373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    font-size: 20px;
}

.el-header div{
    display: flex;
    align-content: center;
    margin-left: 30px;
}

.el-aside{
    background:#333744;
}

.el-main{
    background:#eaedf1;
}
</style>