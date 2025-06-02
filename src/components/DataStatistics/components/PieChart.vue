<!-- src/components/PieChart.vue -->
<template>
  <!-- 定义一个画布，用于绘制饼图 -->
  <canvas ref="chartCanvas" class="pie-chart-canvas"></canvas>

</template>

<script>
// 导入 Chart.js 和所有注册组件
import { Chart, registerables } from 'chart.js';

export default {
  name: 'PieChart', // 组件名称
  props: {
    data: { // 图表数据对象
      type: Object,
      required: true
    },
    options: { // 图表配置选项，非必填，默认为空对象
      type: Object,
      default: () => ({})
    }
  },
  mounted() {
    // 注册 Chart.js 所有组件
    Chart.register(...registerables); // 注册所有 Chart.js 组件
    this.renderChart(); // 渲染饼图
  },
  watch: {
    // 监听 data 对象的变化，深度监听数据更新
    data: {
      deep: true,
      handler() {
        this.renderChart(); // 数据变化时重新渲染图表
      }
    }
  },
  methods: {
    // 渲染图表方法
    renderChart() {
      // 如果已有图表实例，则先销毁
      if (this.chart) {
        this.chart.destroy(); // 销毁旧的图表实例
      }
      // 获取 canvas 画布的2d上下文
      const ctx = this.$refs.chartCanvas.getContext('2d'); // 获取绘图上下文
      // 创建新的 Chart 实例，配置图表类型为 'pie'
      this.chart = new Chart(ctx, {
        type: 'pie', // 图表类型为饼图
        data: this.data, // 传入图表数据
        options: this.options // 传入图表配置选项
      });
    }
  },
  beforeUnmount() {
    // 组件卸载前销毁图表实例，释放资源
    if (this.chart) {
      this.chart.destroy(); // 销毁图表实例
    }
  }
};
</script>

<!-- 引入外部样式，不在此处编写 style 部分 -->
<style scoped src="../DataStatistics.css"></style>
