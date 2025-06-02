<!-- 文件路径: src/views/CouponManagement.vue -->
<template>
  <div class="coupon-management fade-in">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>优惠券管理</h1>
    </div>

    <!-- 搜索和筛选区域 -->
    <SearchFilter @search="onSearch">
      <!-- 搜索输入：优惠券名称 -->
      <div class="search-input">
        <label>优惠券名称</label>
        <input type="text" v-model="couponFilter.name" placeholder="请输入优惠券名称">
      </div>
      <!-- 搜索输入：优惠券类型 -->
      <div class="search-input">
        <label>优惠券类型</label>
        <select v-model="couponFilter.type">
          <option value="">全部类型</option>
          <option value="1">满减券</option>
          <option value="2">折扣券</option>
          <option value="3">无门槛券</option>
        </select>
      </div>
      <!-- 搜索输入：状态 -->
      <div class="search-input">
        <label>状态</label>
        <select v-model="couponFilter.status">
          <option value="">全部状态</option>
          <option value="1">未开始</option>
          <option value="2">进行中</option>
          <option value="3">已结束</option>
          <option value="4">已停用</option>
        </select>
      </div>
    </SearchFilter>

    <!-- 新增优惠券按钮 -->
    <div style="text-align: right; margin-bottom: 15px;">
      <button class="btn" style="background-color: var(--primary-color); color: white;" @click="showAddCouponDialog">➕ 新增优惠券</button>
    </div>

    <!-- 优惠券数据概览卡片区域 -->
    <div class="card">
      <h2 style="margin-bottom: 20px; font-size: 18px;">优惠券统计</h2>
      <div class="data-overview" style="display: flex; gap: 15px; flex-wrap: wrap;">
        <DataCard title="总发放量" value="1,245" change="↑12.5% 同比上周" :positive="true" />
        <DataCard title="已使用" value="856" change="↑8.3% 同比上周" :positive="true" />
        <DataCard title="使用率" value="68.7%" change="↓1.2% 同比上周" :positive="false" />
        <DataCard title="带动销售额" value="¥45,678" change="↑15.5% 同比上周" :positive="true" />
      </div>
    </div>

    <!-- 优惠券表格 -->
    <div class="card">
      <table class="coupon-table">
        <thead>
          <tr>
            <th>优惠券ID</th>
            <th>优惠券名称</th>
            <th>类型</th>
            <th>面值</th>
            <th>使用条件</th>
            <th>发放量</th>
            <th>已使用</th>
            <th>有效期</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(coupon, index) in filteredCoupons" :key="index">
            <td>{{ coupon.id }}</td>
            <td>{{ coupon.name }}</td>
            <td>{{ coupon.type }}</td>
            <td>{{ coupon.value }}</td>
            <td>{{ coupon.condition }}</td>
            <td>{{ coupon.total }}</td>
            <td>{{ coupon.used }}</td>
            <td>{{ coupon.validity }}</td>
            <td>
              <span :class="['status-badge', getStatusClass(coupon.status)]">
                {{ coupon.status }}
              </span>
            </td>
            <td>
              <button class="btn btn-edit">编辑</button>
              <button class="btn btn-delete">删除</button>
              <button v-if="coupon.status !== '已结束' && coupon.status !== '已停用'" class="btn btn-disable">停用</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页组件 -->
    <div class="pagination">
      <div>共 {{ totalCoupons }} 条记录</div>
      <div class="page-numbers">
        <button @click="prevPage" :disabled="currentPage === 1">上一页</button>
        <button v-for="page in totalPages" :key="page" @click="goToPage(page)" :class="{active: currentPage === page}">
          {{ page }}
        </button>
        <button @click="nextPage" :disabled="currentPage === totalPages">下一页</button>
      </div>
    </div>

    <!-- 新增优惠券对话框 -->
    <div class="modal" v-if="showCouponDialog">
      <div class="modal-content">
        <div class="modal-header">
          <h3>新增优惠券</h3>
          <button class="btn-close" @click="closeCouponDialog">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitCouponForm">
            <div class="form-group">
              <label>优惠券名称</label>
              <input type="text" v-model="currentCoupon.name" placeholder="请输入优惠券名称" required>
            </div>
            <div class="form-group">
              <label>优惠券类型</label>
              <select v-model="currentCoupon.type" required>
                <option value="">请选择类型</option>
                <option value="满减券">满减券</option>
                <option value="折扣券">折扣券</option>
                <option value="无门槛券">无门槛券</option>
              </select>
            </div>
            <div class="form-group">
              <label>优惠券面值</label>
              <input type="text" v-model="currentCoupon.value" placeholder="请输入优惠券面值" required>
            </div>
            <div class="form-group">
              <label>使用条件</label>
              <input type="text" v-model="currentCoupon.condition" placeholder="请输入使用条件" required>
            </div>
            <div class="form-group">
              <label>有效期</label>
              <input type="text" v-model="currentCoupon.validity" placeholder="请输入有效期" required>
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn-cancel" @click="closeCouponDialog">取消</button>
              <button type="submit" class="btn btn-submit">确认新增</button>
            </div>
          </form>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import SearchFilter from '../components/SearchFilter.vue';
import DataCard from '../components/DataCard.vue';

export default {
  name: 'CouponManagement',
  components: { SearchFilter, DataCard },
  data() {
    return {
      // 示例优惠券数据
      coupons: [
        {
          id: 'CP20240001',
          name: '新人福利',
          type: '无门槛券',
          value: '¥15',
          condition: '无门槛',
          total: 600,
          used: 400,
          validity: '2024-06-01 至 2024-06-30',
          status: '进行中'
        },
        {
          id: 'CP20240002',
          name: '满减优惠',
          type: '满减券',
          value: '¥25',
          condition: '满¥120可用',
          total: 400,
          used: 250,
          validity: '2024-06-05 至 2024-06-20',
          status: '进行中'
        },
        {
          id: 'CP20240003',
          name: '节日折扣',
          type: '折扣券',
          value: '7折',
          condition: '满¥80可用',
          total: 300,
          used: 290,
          validity: '2024-05-20 至 2024-05-30',
          status: '已结束'
        },
        {
          id: 'CP20240004',
          name: '会员专享',
          type: '满减券',
          value: '¥35',
          condition: '满¥200可用',
          total: 200,
          used: 100,
          validity: '2024-06-10 至 2024-06-25',
          status: '进行中'
        },
        {
          id: 'CP20240005',
          name: '生日特惠',
          type: '无门槛券',
          value: '¥20',
          condition: '无门槛',
          total: 150,
          used: 50,
          validity: '2024-07-01 至 2024-07-31',
          status: '未开始'
        }
      ],
      // 优惠券筛选条件
      couponFilter: {
        name: '',
        type: '',
        status: ''
      },
      currentPage: 1,
      pageSize: 10,
      // 新增优惠券对话框相关数据
      showCouponDialog: false,
      currentCoupon: {
        id: null,
        name: '',
        type: '',
        value: '',
        condition: '',
        validity: '',
        status: '未开始'
      }
    };
  },
  computed: {
    // 根据筛选条件过滤优惠券
    filteredCoupons() {
      return this.coupons.filter(coupon => {
        return (!this.couponFilter.name || coupon.name.includes(this.couponFilter.name)) &&
          (!this.couponFilter.type ||
            (this.couponFilter.type === '1' && coupon.type === '满减券') ||
            (this.couponFilter.type === '2' && coupon.type === '折扣券') ||
            (this.couponFilter.type === '3' && coupon.type === '无门槛券')) &&
          (!this.couponFilter.status ||
            (this.couponFilter.status === '1' && coupon.status === '未开始') ||
            (this.couponFilter.status === '2' && coupon.status === '进行中') ||
            (this.couponFilter.status === '3' && coupon.status === '已结束') ||
            (this.couponFilter.status === '4' && coupon.status === '已停用'));
      });
    },
    // 总优惠券数
    totalCoupons() {
      return this.filteredCoupons.length;
    },
    // 总页数
    totalPages() {
      return Math.ceil(this.totalCoupons / this.pageSize);
    }
  },
  methods: {
    // 根据状态返回对应的CSS类
    getStatusClass(status) {
      const classes = {
        '未开始': 'status-pending',
        '进行中': 'status-on',
        '已结束': 'status-off',
        '已停用': 'status-off'
      };
      return classes[status];
    },
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
    },
    // 显示新增优惠券对话框
    showAddCouponDialog() {
      this.currentCoupon = {
        id: null,
        name: '',
        type: '',
        value: '',
        condition: '',
        validity: '',
        status: '未开始'
      };
      this.showCouponDialog = true;
    },
    // 关闭新增优惠券对话框
    closeCouponDialog() {
      this.showCouponDialog = false;
    },
    // 提交新增优惠券表单
    submitCouponForm() {
      const newCoupon = { ...this.currentCoupon };
      newCoupon.id = 'CP' + Date.now();
      this.coupons.push(newCoupon);
      this.$message && this.$message.success('新增优惠券成功!');
      this.closeCouponDialog();
    }
  }
};
</script>

<style scoped src="../DataStatistics.css"></style>