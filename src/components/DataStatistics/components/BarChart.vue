<template>
  <canvas ref="chartCanvas"></canvas>
</template>

<script>
import { Chart, registerables } from 'chart.js';

export default {
  name: 'BarChart',
  props: {
    data: Object,
    options: Object
  },
  mounted() {
    Chart.register(...registerables);
    this.renderChart();
  },
  watch: {
    data: {
      deep: true,
      handler() {
        this.renderChart();
      }
    }
  },
  methods: {
    renderChart() {
      if (this.chart) {
        this.chart.destroy();
      }

      const ctx = this.$refs.chartCanvas.getContext('2d');
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: this.data,
        options: this.options
      });
    }
  },
  beforeUnmount() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
};
</script>
<style scoped src="../DataStatistics.css"></style>