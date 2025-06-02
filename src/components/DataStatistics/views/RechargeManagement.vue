<template>
  <div class="recharge-management fade-in">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>充值管理</h1>
    </div>

    <!-- 搜索和筛选区域 -->
    <SearchFilter @search="onSearch">
      <!-- 搜索输入：用户ID -->
      <div class="search-input">
        <label>用户ID</label>
        <input type="text" v-model="rechargeFilter.userId" placeholder="请输入用户ID">
      </div>
      <!-- 搜索输入：手机号 -->
      <div class="search-input">
        <label>手机号</label>
        <input type="text" v-model="rechargeFilter.phone" placeholder="请输入手机号">
      </div>
      <!-- 搜索输入：充值时间 -->
      <div class="search-input">
        <label>充值时间</label>
        <input type="date" v-model="rechargeFilter.startDate" placeholder="开始日期">
        <span>至</span>
        <input type="date" v-model="rechargeFilter.endDate" placeholder="结束日期">
      </div>
    </SearchFilter>

    <!-- 充值数据概览卡片区域 -->
    <div class="card">
      <h2 style="margin-bottom: 20px; font-size: 18px;">充值统计</h2>
      <div class="data-overview" style="display: flex; gap: 15px; flex-wrap: wrap;">
        <DataCard title="总充值金额" value="¥56,780" change="↑15.5% 同比上周" :positive="true" />
        <DataCard title="充值用户数" value="128" change="↑8.3% 同比上周" :positive="true" />
        <DataCard title="平均充值金额" value="¥443.59" change="↑6.7% 同比上周" :positive="true" />
        <DataCard title="最高单笔充值" value="¥2,000" change="-" :positive="true" />
      </div>
    </div>

    <!-- 充值记录表格 -->
    <div class="card">
      <table class="recharge-table">
        <thead>
        <tr>
          <th>充值ID</th>
          <th>用户ID</th>
          <th>手机号</th>
          <th>充值金额</th>
          <th>赠送金额</th>
          <th>充值方式</th>
          <th>充值时间</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(record, index) in filteredRecords" :key="index">
          <td>{{ record.id }}</td>
          <td>{{ record.userId }}</td>
          <td>{{ record.phone }}</td>
          <td>{{ record.amount }}</td>
          <td>{{ record.bonus }}</td>
          <td>{{ record.method }}</td>
          <td>{{ record.time }}</td>
          <td>
            <span :class="['status-badge', record.status === '成功' ? 'status-on' : record.status === '失败' ? 'status-off' : 'status-pending']">
              {{ record.status }}
            </span>
          </td>
          <td>
            <button class="btn btn-edit">详情</button>
            <button v-if="record.status === '待处理'" class="btn" style="background-color: rgba(52, 199, 89, 0.1); color: var(--secondary-color);">确认</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页组件 -->
    <div class="pagination">
      <div>共 {{ totalRecords }} 条记录</div>
      <div class="page-numbers">
        <button @click="prevPage" :disabled="currentPage === 1">上一页</button>
        <button v-for="page in totalPages" :key="page" @click="goToPage(page)" :class="{active: currentPage === page}">
          {{ page }}
        </button>
        <button @click="nextPage" :disabled="currentPage === totalPages">下一页</button>
      </div>
    </div>
  </div>
</template>

<script>
import SearchFilter from '../components/SearchFilter.vue';
import DataCard from '../components/DataCard.vue';

export default {
  name: 'RechargeManagement',
  components: { SearchFilter, DataCard },
  data() {
    return {
      // 示例充值记录数据
      rechargeRecords: [
        { id: 'RC20230001', userId: 'U1001', phone: '138****1234', amount: '¥500.00', bonus: '¥50.00', method: '微信支付', time: '2023-05-15 10:30', status: '成功' },
        { id: 'RC20230002', userId: 'U1002', phone: '139****5678', amount: '¥200.00', bonus: '¥20.00', method: '支付宝', time: '2023-05-15 11:45', status: '成功' },
        { id: 'RC20230003', userId: 'U1003', phone: '136****9012', amount: '¥1000.00', bonus: '¥100.00', method: '银行卡', time: '2023-05-15 14:20', status: '待处理' },
        { id: 'RC20230004', userId: 'U1004', phone: '135****3456', amount: '¥300.00', bonus: '¥30.00', method: '微信支付', time: '2023-05-15 16:10', status: '失败' },
        { id: 'RC20230005', userId: 'U1005', phone: '137****7890', amount: '¥2000.00', bonus: '¥200.00', method: '支付宝', time: '2023-05-14 18:30', status: '成功' }
      ],
      // 充值记录筛选条件
      rechargeFilter: {
        userId: '',
        phone: '',
        startDate: '',
        endDate: ''
      },
      currentPage: 1,
      pageSize: 10
    };
  },
  computed: {
    // 根据筛选条件过滤充值记录
    filteredRecords() {
      let result = this.rechargeRecords;
      if (this.rechargeFilter.userId) {
        result = result.filter(record => record.userId.includes(this.rechargeFilter.userId));
      }
      if (this.rechargeFilter.phone) {
        result = result.filter(record => record.phone.includes(this.rechargeFilter.phone));
      }
      if (this.rechargeFilter.startDate && this.rechargeFilter.endDate) {
        result = result.filter(record => record.time >= this.rechargeFilter.startDate && record.time <= this.rechargeFilter.endDate);
      }
      return result;
    },
    // 总记录数
    totalRecords() {
      return this.filteredRecords.length;
    },
    // 总页数
    totalPages() {
      return Math.ceil(this.totalRecords / this.pageSize);
    }
  },
  methods: {
    // 搜索操作，重置页码
    onSearch() {
      this.currentPage = 1;
    },
    // 上一页
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    // 下一页
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    // 跳转到指定页码
    goToPage(page) {
      this.currentPage = page;
    }
  }
};
</script>

<style scoped>
.recharge-table {
  width: 100%;
  border-collapse: collapse;
}

.recharge-table th,
.recharge-table td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.recharge-table th {
  background-color: rgba(0, 0, 0, 0.02);
  color: var(--text-secondary);
  font-weight: 500;
  font-size: 13px;
}

.recharge-table tr:last-child td {
  border-bottom: none;
}

.recharge-table tr:hover {
  background-color: rgba(0, 0, 0, 0.01);
}
</style>