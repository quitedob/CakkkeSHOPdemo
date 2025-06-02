<!-- SearchFilter.vue 搜索筛选组件 - 苹果风格美化版 -->
<template>
  <!-- 搜索筛选外层容器 -->
  <div class="search-filter">
    <!-- 插槽区域，可自定义搜索输入控件 -->
    <slot></slot>
    <!-- 默认搜索按钮，点击后触发 search 事件 -->
    <button class="search-btn" @click="$emit('search')">搜索</button>
  </div>
</template>

<script>
export default {
  name: 'SearchFilter' // 组件名称
};
</script>

<style scoped src="../DataStatistics.css"></style>