<template>
  <div id="app">
    <el-container class="container">
      <el-aside class="aside">
        <!--<img src="./assets/logo.png">-->
        <el-menu @select="handleSelect">
          <el-menu-item index="/data">数据</el-menu-item>
          <el-menu-item index="/model">模型</el-menu-item>
          <!--<el-menu-item index="/infer">推断</el-menu-item>-->
          <!--<el-menu-item index="/detect">检测</el-menu-item>-->
          <el-menu-item index="/ad">推断and检测</el-menu-item>
          <el-menu-item index="/show">展示</el-menu-item>

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
  name: 'App',
  methods: {
    handleSelect (key, keyPath) {
      this.$router.push(key)
    }
  }
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
    /*height: 500px;*/
    /*border: 1px solid #eee;*/
  }
  .aside {
    /*background: aqua;*/
    max-width: 150px;
    position: fixed;
  }
  .main {
    background: aliceblue;
    margin-left: 150px;
  }
</style>
