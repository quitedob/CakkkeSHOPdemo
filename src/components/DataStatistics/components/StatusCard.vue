<!-- StatusCard.vue 订单状态卡片组件 - 苹果风格美化版 -->
<template>
  <!-- 状态卡片外层容器，点击时触发 click 事件 -->
  <div class="status-card" :class="{ active: active }" @click="$emit('click')">
    <!-- 显示状态数值 -->
    <div class="count">{{ count }}</div>
    <!-- 显示状态标签 -->
    <div class="label">{{ label }}</div>
  </div>
</template>

<script>
export default {
  name: 'StatusCard', // 组件名称
  props: {
    count: { type: [Number, String], required: true }, // 状态数值
    label: { type: String, required: true },             // 状态标签文本
    active: { type: Boolean, default: false }            // 是否处于激活状态
  }
};
</script>

<style scoped src="../DataStatistics.css"></style>