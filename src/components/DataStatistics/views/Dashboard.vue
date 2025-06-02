<template>
  <div class="dashboard fade-in">
    <!-- 页面标题和营业状态切换 -->
    <div class="page-header">
      <div class="header-content">
        <h1>工作台</h1>
        <div class="business-status-toggle">
          <span class="status-label">营业状态:</span>
          <label class="switch">
            <input type="checkbox" v-model="isOpen" @change="toggleBusinessStatus">
            <span class="slider round"></span>
          </label>
          <span class="status-text">{{ isOpen ? '营业中' : '已打烊' }}</span>
        </div>
      </div>
      <p class="welcome-message">您好，{{ currentTime }}！今日有{{ newOrdersCount }}笔新订单待处理</p>
    </div>

    <!-- 今日数据概览卡片区域 -->
    <div class="card">
      <h2>今日关键指标</h2>
      <div class="data-overview">
        <DataCard
            title="今日营业额"
            :value="formatCurrency(todayData.turnover)"
            :change="getChangeText(todayData.turnoverChange)"
            :positive="todayData.turnoverChange >= 0"
            icon="💰"
        />
        <DataCard
            title="有效订单"
            :value="todayData.orderCount"
            :change="getChangeText(todayData.orderCountChange)"
            :positive="todayData.orderCountChange >= 0"
            icon="📦"
        />
        <DataCard
            title="平均客单价"
            :value="formatCurrency(todayData.avgPrice)"
            :change="getChangeText(todayData.avgPriceChange)"
            :positive="todayData.avgPriceChange >= 0"
            icon="🧾"
        />
        <DataCard
            title="新增会员"
            :value="todayData.newMembers"
            :change="getChangeText(todayData.newMembersChange)"
            :positive="todayData.newMembersChange >= 0"
            icon="👥"
        />
        <DataCard
            title="蛋糕销量"
            :value="todayData.cakeSales"
            change="最畅销: 巧克力蛋糕"
            :positive="true"
            icon="🎂"
        />
      </div>
    </div>

    <!-- 双列布局：左侧订单状态，右侧库存预警 -->
    <div class="double-column">
      <!-- 订单状态概览卡片区域 -->
      <div class="card">
        <h2>订单状态</h2>
        <div class="order-status">
          <StatusCard
              v-for="status in orderStatuses"
              :key="status.id"
              :count="status.count"
              :label="status.label"
              :active="activeOrderTab === status.id"
              @click="setOrderTab(status.id)"
              :icon="status.icon"
          />
        </div>
        <div class="chart-container">
          <PieChart :data="orderStatusChartData" :options="pieChartOptions" />
        </div>
      </div>

      <!-- 库存预警区域 -->
      <div class="card stock-warning">
        <h2>库存预警 <span class="warning-count">{{ lowStockItems.length }}</span></h2>
        <div v-if="lowStockItems.length > 0" class="warning-list">
          <div v-for="item in lowStockItems" :key="item.id" class="warning-item">
            <span class="item-name">{{ item.name }}</span>
            <span class="item-stock" :class="{ 'critical': item.stock < 5 }">
              剩余 {{ item.stock }} {{ item.unit }}
            </span>
            <button class="btn btn-sm" @click="navigateToReplenish(item.id)">补货</button>
          </div>
        </div>
        <div v-else class="no-warning">
          <span class="icon">✅</span>
          <p>所有库存充足</p>
        </div>
      </div>
    </div>

    <!-- 销售趋势图表 -->
    <div class="card">
      <div class="chart-header">
        <h2>销售趋势</h2>
        <div class="time-range-selector">
          <button
              v-for="range in timeRanges"
              :key="range.value"
              @click="setTimeRange(range.value)"
              :class="{ active: currentTimeRange === range.value }"
          >
            {{ range.label }}
          </button>
        </div>
      </div>
      <div class="chart-container">
        <LineChart :data="salesChartData" :options="lineChartOptions" />
      </div>
    </div>

    <!-- 快捷操作和会员概览 -->
    <div class="double-column">
      <!-- 快捷操作卡片区域 -->
      <div class="card quick-actions">
        <h2>快捷操作</h2>
        <div class="action-grid">
          <button
              v-for="action in quickActions"
              :key="action.id"
              class="action-btn"
              @click="handleQuickAction(action.id)"
              :style="{ backgroundColor: action.color }"
          >
            <span class="action-icon">{{ action.icon }}</span>
            <span class="action-label">{{ action.label }}</span>
          </button>
        </div>
      </div>

      <!-- 会员概览区域 -->
      <div class="card member-overview">
        <h2>会员概览</h2>
        <div class="member-stats">
          <div class="stat-item">
            <div class="stat-value">{{ memberData.total }}</div>
            <div class="stat-label">总会员数</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ memberData.active }}</div>
            <div class="stat-label">活跃会员</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ formatCurrency(memberData.balance) }}</div>
            <div class="stat-label">会员总余额</div>
          </div>
        </div>
        <div class="chart-container">
          <BarChart :data="memberChartData" :options="memberChartOptions" />
        </div>
      </div>
    </div>

    <!-- 今日生日会员 -->
    <div class="card birthday-members">
      <h2>🎉 今日生日会员 ({{ birthdayMembers.length }})</h2>
      <div v-if="birthdayMembers.length > 0" class="member-list">
        <div v-for="member in birthdayMembers" :key="member.id" class="member-item">
          <div class="member-info">
            <span class="member-name">{{ member.name }}</span>
            <span class="member-phone">{{ member.phone }}</span>
            <span class="member-level">等级: {{ member.level }}</span>
          </div>
          <button class="btn btn-sm" @click="sendBirthdayCoupon(member.id)">发送优惠券</button>
        </div>
      </div>
      <div v-else class="no-birthday">
        今日没有会员生日
      </div>
    </div>
  </div>
</template>

<script>
import DataCard from '../components/DataCard.vue';
import StatusCard from '../components/StatusCard.vue';
import LineChart from '../components/LineChart.vue';
import PieChart from '../components/PieChart.vue';
import BarChart from '../components/BarChart.vue';
import { formatCurrency } from '../DataStatistics.js';

export default {
  name: 'Dashboard',
  components: { DataCard, StatusCard, LineChart, PieChart, BarChart },
  data() {
    return {
      isOpen: true,
      currentTime: this.getCurrentTime(),
      currentTimeRange: 'week',
      todayData: {
        turnover: 12568,
        turnoverChange: 12.5,
        orderCount: 156,
        orderCountChange: 8.3,
        avgPrice: 80.56,
        avgPriceChange: 5.7,
        newMembers: 28,
        newMembersChange: 15.2,
        cakeSales: 89
      },
      newOrdersCount: 5,
      orderStatuses: [
        { id: 'pending', count: 12, label: '待接单', icon: '⏳' },
        { id: 'delivering', count: 8, label: '待派送', icon: '🚚' },
        { id: 'completed', count: 125, label: '已完成', icon: '✅' },
        { id: 'canceled', count: 11, label: '已取消', icon: '❌' },
        { id: 'all', count: 156, label: '全部订单', icon: '📋' }
      ],
      activeOrderTab: 'all',
      lowStockItems: [
        { id: 1, name: '淡奶油', stock: 3, unit: '盒' },
        { id: 2, name: '草莓', stock: 2, unit: '盒' },
        { id: 3, name: '巧克力粉', stock: 4, unit: '袋' }
      ],
      timeRanges: [
        { value: 'day', label: '今日' },
        { value: 'week', label: '本周' },
        { value: 'month', label: '本月' }
      ],
      quickActions: [
        { id: 'new-order', label: '快速接单', icon: '➕', color: 'rgba(0, 113, 227, 0.1)' },
        { id: 'new-product', label: '新增商品', icon: '🍰', color: 'rgba(52, 199, 89, 0.1)' },
        { id: 'inventory', label: '库存管理', icon: '📦', color: 'rgba(255, 149, 0, 0.1)' },
        { id: 'promotion', label: '创建活动', icon: '🎉', color: 'rgba(255, 59, 48, 0.1)' },
        { id: 'report', label: '查看报表', icon: '📊', color: 'rgba(175, 82, 222, 0.1)' },
        { id: 'member', label: '充值管理', icon: '👥', color: 'rgba(90, 200, 250, 0.1)' }
      ],
      memberData: {
        total: 1286,
        active: 856,
        balance: 56890
      },
      birthdayMembers: [
        { id: 1, name: '张小姐', phone: '138****1234', level: '黄金会员' },
        { id: 2, name: '李先生', phone: '139****5678', level: '普通会员' }
      ],
      orderStatusChartData: {
        labels: ['待接单', '待派送', '已完成', '已取消'],
        datasets: [{
          data: [12, 8, 125, 11],
          backgroundColor: [
            'rgba(255, 206, 86, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(255, 99, 132, 0.7)'
          ]
        }]
      },
      pieChartOptions: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right'
          }
        }
      },
      salesChartData: {
        labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        datasets: [
          {
            label: '蛋糕销售额',
            data: [4500, 5200, 4800, 6200, 5800, 8500, 9200],
            borderColor: '#0071e3',
            backgroundColor: 'rgba(0, 113, 227, 0.1)',
            tension: 0.3,
            fill: true
          }
        ]
      },
      lineChartOptions: {
        responsive: true,
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
      memberChartData: {
        labels: ['1月', '2月', '3月', '4月', '5月'],
        datasets: [
          {
            label: '新增会员',
            data: [120, 150, 180, 210, 240],
            backgroundColor: 'rgba(52, 199, 89, 0.7)'
          }
        ]
      },
      memberChartOptions: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        }
      }
    };
  },
  created() {
    // 模拟获取实时数据
    this.fetchRealTimeData();
    // 设置定时刷新
    this.refreshInterval = setInterval(this.fetchRealTimeData, 300000); // 每5分钟刷新一次
  },
  beforeUnmount() {
    clearInterval(this.refreshInterval);
  },
  methods: {
    formatCurrency,
    getCurrentTime() {
      const now = new Date();
      const hours = now.getHours();
      if (hours < 6) return '凌晨好';
      if (hours < 9) return '早上好';
      if (hours < 12) return '上午好';
      if (hours < 14) return '中午好';
      if (hours < 18) return '下午好';
      return '晚上好';
    },
    getChangeText(change) {
      return `${change >= 0 ? '↑' : '↓'}${Math.abs(change)}% 同比昨日`;
    },
    toggleBusinessStatus() {
      // 实际项目中这里应该调用API更改营业状态
      this.$message.success(`已${this.isOpen ? '开始' : '结束'}营业`);
    },
    setOrderTab(tab) {
      this.activeOrderTab = tab;
      // 实际项目中可以在这里加载对应状态的订单数据
    },
    setTimeRange(range) {
      this.currentTimeRange = range;
      // 实际项目中根据时间范围加载不同的数据
    },
    navigateToReplenish(id) {
      this.$router.push('/datastatistics/dish');
    },
    handleQuickAction(actionId) {
      switch(actionId) {
        case 'new-order':
          this.$router.push('/order');
          break;
        case 'new-product':
          this.$router.push('/datastatistics/dish');
          break;
        case 'inventory':
          this.$router.push('/datastatistics/dish');
          break;
        case 'promotion':
          this.$router.push('/promotion');
          break;
        case 'report':
          this.$router.push('/datastatistics/statistics');
          break;
        case 'member':
          this.$router.push('/datastatistics/recharge');
          break;
      }
    },
    sendBirthdayCoupon(memberId) {
      // 实际项目中调用API发送生日优惠券
      this.$message.success('生日优惠券已发送');
    },
    fetchRealTimeData() {
      // 实际项目中这里应该调用API获取实时数据
      console.log('Fetching real-time data...');
    }
  }
};
</script>

<style scoped src="../DataStatistics.css"></style>