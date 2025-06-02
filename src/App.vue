<template>
  <div id="app" class = "main">

    <!-- 主内容区域，基于路由动态加载页面 -->
    <main class ="main">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>

.main {
  background-color: white;
}

/* 全局样式 */
#app {
  background-color: #f5f5f5;
}


</style>
