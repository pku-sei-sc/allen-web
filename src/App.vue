<template>
  <div id="app">
    <el-container class="container">
      <el-aside class="aside">
        <!--<img src="./assets/logo.png">-->
        <el-menu>
          <el-menu-item>数据</el-menu-item>
          <el-menu-item>模型</el-menu-item>
          <el-menu-item>检测</el-menu-item>
        </el-menu>
      </el-aside>

      <el-main class="main">
        <router-view/>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
  .container {
    height: 500px;
    /*border: 1px solid #eee;*/
  }
  .aside {
    /*background: aqua;*/
    max-width: 150px;
  }
  .main {
    background: aliceblue;
  }
</style>
