<template>
  <div class="data-statistics-container">
    <!-- Header -->
    <div class="header">
      <div class="logo">CakeShOOp</div>
      <div class="user-info">
        <span class="username">Admin</span>
        <div class="business-status">
          <span>营业中</span>
        </div>
      </div>
    </div>

    <!-- Sidebar -->
    <div class="sidebar">
      <h2>数据分析</h2>
      <ul>
        <li @click="navigateTo('dashboard')" :class="{ active: $route.name === 'dashboard' }">
          <a><span class="icon">📊</span> 工作台</a>
        </li>
        <li @click="navigateTo('order')" :class="{ active: $route.name === 'order' }">
          <a><span class="icon">📦</span> 订单管理</a>
        </li>
        <li @click="navigateTo('category')" :class="{ active: $route.name === 'category' }">
          <a><span class="icon">🗂️</span> 分类管理</a>
        </li>
        <li @click="navigateTo('dish')" :class="{ active: $route.name === 'dish' }">
          <a><span class="icon">🍲</span> 菜品管理</a>
        </li>
        <!-- 在sidebar的ul中添加两个新的导航项 -->
        <li @click="navigateTo('recharge')" :class="{ active: $route.name === 'recharge' }">
          <a><span class="icon">💳</span> 充值管理</a>
        </li>
        <li @click="navigateTo('coupon')" :class="{ active: $route.name === 'coupon' }">
          <a><span class="icon">🎫</span> 优惠券管理</a>
        </li>
        <li @click="navigateTo('statistics')" :class="{ active: $route.name === 'statistics' }">
          <a><span class="icon">📈</span> 数据统计</a>
        </li>

      </ul>
    </div>

    <!-- Main Content -->
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'DataStatistics',
  methods: {
    navigateTo(routeName) {
      this.$router.push({ name: routeName });
    }
  }
};
</script>

<style scoped src="./DataStatistics.css"></style>