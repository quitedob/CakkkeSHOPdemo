<template>
  <div class="statistics fade-in">
    <div class="page-header">
      <h1>数据洞察</h1>
    </div>

    <!-- 数据概览卡片 -->
    <div class="card">
      <h2>关键指标</h2>
      <div class="data-overview">
        <DataCard
            title="总销售额"
            value="¥45,678"
            change="↑12.5% 同比上周"
            :positive="true" />
        <DataCard
            title="订单总数"
            value="1,245"
            change="↑8.3% 同比上周"
            :positive="true" />
        <DataCard
            title="客单价"
            value="¥89.50"
            change="↑5.2% 同比上周"
            :positive="true" />
        <DataCard
            title="新客户"
            value="156"
            change="↓2.1% 同比上周"
            :positive="false" />
      </div>
    </div>

    <!-- 销售趋势图表 -->
    <div class="card">
      <div class="flex justify-between items-center mb-4">
        <h2>销售趋势</h2>
        <select v-model="timeRange" class="time-selector">
          <option value="7">最近7天</option>
          <option value="30">最近30天</option>
          <option value="90">最近90天</option>
        </select>
      </div>
      <div class="chart-container">
        <LineChart :data="salesData" :options="chartOptions" />
      </div>
    </div>

    <!-- 热销菜品TOP10 -->
    <div class="card">
      <h2>热销菜品TOP10</h2>
      <div class="table-container">
        <table class="hot-dish-table">
          <thead>
          <tr>
            <th>排名</th>
            <th>菜品名称</th>
            <th>分类</th>
            <th>销量</th>
            <th>销售额</th>
            <th>毛利率</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(dish, index) in topDishes" :key="dish.id">
            <td>{{ index + 1 }}</td>
            <td class="font-medium">{{ dish.name }}</td>
            <td>{{ dish.category }}</td>
            <td>{{ dish.sales }}</td>
            <td class="font-medium">{{ dish.revenue }}</td>
            <td :class="{'text-green-500': dish.profitMargin > 0.6, 'text-orange-500': dish.profitMargin <= 0.6}">
              {{ (dish.profitMargin * 100).toFixed(1) }}%
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 时段分析 -->
    <div class="card">
      <h2>时段分析</h2>
      <div class="chart-container">
        <BarChart :data="hourlyData" :options="barOptions" />
      </div>
    </div>
  </div>
</template>

<script>
import DataCard from '../components/DataCard.vue';
import LineChart from '../components/LineChart.vue';
import BarChart from '../components/BarChart.vue';

export default {
  name: 'Statistics',
  components: { DataCard, LineChart, BarChart },
  data() {
    return {
      timeRange: '7',
      salesData: {
        labels: ['1日', '2日', '3日', '4日', '5日', '6日', '7日'],
        datasets: [
          {
            label: '销售额',
            data: [4500, 5200, 4800, 6200, 5800, 6500, 7200],
            borderColor: '#0071e3',
            backgroundColor: 'rgba(0, 113, 227, 0.1)',
            tension: 0.3,
            fill: true
          }
        ]
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      },
      topDishes: [
        { id: 1, name: '北京烤鸭', category: '特色菜', sales: 156, revenue: '¥30,888', profitMargin: 0.65 },
        { id: 2, name: '宫保鸡丁', category: '川菜', sales: 134, revenue: '¥25,600', profitMargin: 0.58 },
        { id: 3, name: '麻婆豆腐', category: '川菜', sales: 120, revenue: '¥18,000', profitMargin: 0.72 },
        { id: 4, name: '红烧肉', category: '家常菜', sales: 98, revenue: '¥19,600', profitMargin: 0.62 },
        { id: 5, name: '清蒸鲈鱼', category: '海鲜', sales: 87, revenue: '¥26,100', profitMargin: 0.68 }
      ],
      hourlyData: {
        labels: ['8-10', '10-12', '12-14', '14-16', '16-18', '18-20', '20-22'],
        datasets: [
          {
            label: '订单量',
            data: [45, 120, 185, 65, 90, 210, 150],
            backgroundColor: 'rgba(0, 113, 227, 0.7)'
          }
        ]
      },
      barOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    };
  },
  watch: {
    timeRange(newVal) {
      this.updateChartData(newVal);
    }
  },
  methods: {
    updateChartData(range) {
      // 这里可以根据实际需求从API获取数据
      const days = parseInt(range);
      const newLabels = [];
      const newData = [];

      for (let i = days; i > 0; i--) {
        newLabels.push(`${i}日前`);
        newData.push(Math.floor(Math.random() * 5000) + 3000);
      }

      this.salesData = {
        labels: newLabels.reverse(),
        datasets: [{
          ...this.salesData.datasets[0],
          data: newData.reverse()
        }]
      };
    }
  }
};
</script>

<style scoped src="../DataStatistics.css"></style>