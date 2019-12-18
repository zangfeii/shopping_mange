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
    <el-aside :width="isCollapse ? '64px':'200px'">
      <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <!-- unique-opened保证该导航栏只打开一个子菜单  默认为false-->
        <!-- collapse-transitiond 是否开启折叠动画 -->
        <!-- router 开启路由模式 默认为false -->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409bff" unique-opened :collapse ='isCollapse' :collapse-transition='false' :router ='true' :default-active='activePath'>
           <!-- 一级菜单 -->
           <!-- index = '1' index值都相同 点击一个都会展开次级目录,需要指定不同的 -->
           <!-- index只能接受字符,不接受数字 需要转化 -->
          
        <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
               <!-- 一级菜单模板区域 -->
          <template slot="title">
               <!-- 图标 -->
            <i :class="iconObj[item.id]"></i>
               <!-- 文本 -->
            <span>{{item.authName}}</span>
          </template>
                 <!-- index是跳转上的那个路径 用当前请求的path合适 地址加斜线 -->
        <el-menu-item :index = "'/'+subItem.path" v-for = "subItem in item.children" :key="subItem.id" @click="saveNavSate('/'+subItem.path)">
           <template slot="title">
               <!-- 图标 -->
            <i class="el-icon-menu"></i>
               <!-- 文本 -->
            <span>{{subItem.authName}}</span>
          </template>
        </el-menu-item>
          
<!--            
           <el-submenu index="1-4">
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
       
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>


<script>


export default {   
    data() {
        return {
            menuList:[],
            iconObj:{
              // 一级菜单id
              '125':'el-icon-user-solid',
              '103':'el-icon-s-ticket',
              '101':'el-icon-s-goods',
              '102':'el-icon-s-order',
              '145':'el-icon-s-marketing'
            },
            // 是否折叠
            isCollapse:false,
            // 保存的激活链接地址
            activePath:''
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
         const {data:res} = await this.$http.get('menus');
         console.log("左侧数据获取:");
         console.log(res);
         if(res.meta.status !== 200)
           return this.$message.error(res.meta.msg)
        else this.menuList = res.data

      },
      // 点击折叠展开菜单
      toggleCollapse(){
        this. isCollapse = ! this.isCollapse
      },

      // 保存链接的激活状态到sessionStorage,及点击链接时使当前链接整体为蓝色
      saveNavSate(activePath){
           window.sessionStorage.setItem('activePath',activePath)
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

/* 解决 左侧栏当子菜单展开时 会有细小的突出部分 */
.el-menu{
  border-right: none;
}

.toggle-button{
  background:#4a5064;
  color: #eaedf1;
  font-size: 10xp;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.2em;
  /* 鼠标放上去成小手 */
  cursor: pointer;
}
</style>