<!-- DataCard.vue 数据卡片组件 - 苹果风格美化版 -->
<template>
  <!-- 数据卡片外层容器 -->
  <div class="data-card">
    <!-- 卡片标题 -->
    <h3>{{ title }}</h3>
    <!-- 显示主要数值 -->
    <div class="value">{{ value }}</div>
    <!-- 显示数据变化情况，正负增长以不同样式展示 -->
    <div class="change" :class="{ negative: !positive }">{{ change }}</div>
  </div>
</template>

<script>
export default {
  name: 'DataCard', // 组件名称
  props: {
    title: { type: String, required: true },   // 卡片标题
    value: { type: String, required: true },     // 数据值
    change: { type: String, required: true },    // 数据变化描述
    positive: { type: Boolean, default: true }   // 是否为正增长，默认为正增长
  }
};
</script>
<style scoped src="../DataStatistics.css"></style>
