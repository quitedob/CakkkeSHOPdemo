<!-- 文件路径：OrderManagement.vue -->
<template>
  <div class="order-management fade-in"><!-- 订单管理主容器 -->
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>订单管理</h1>
    </div>

    <!-- 搜索和筛选区域 -->
    <!-- 修改：增加 @reset="onReset" 事件绑定 -->
    <SearchFilter @search="onSearch" @reset="onReset"><!-- 使用搜索筛选组件 -->
      <!-- 搜索输入：订单号 -->
      <div class="search-input">
        <label>订单号</label>
        <input type="text" v-model="orderFilter.orderNo" placeholder="请输入订单号">
      </div>
      <!-- 搜索输入：订单状态 -->
      <div class="search-input">
        <label>订单状态</label>
        <select v-model="orderFilter.status">
          <option value="">全部状态</option>
          <option value="pending">待接单</option>
          <option value="delivering">待派送</option>
          <option value="completed">已完成</option>
          <option value="canceled">已取消</option>
        </select>
      </div>
      <!-- 搜索输入：日期范围 -->
      <div class="search-input">
        <label>日期范围</label>
        <input type="date" v-model="orderFilter.startDate" placeholder="开始日期">
        <span>至</span>
        <input type="date" v-model="orderFilter.endDate" placeholder="结束日期">
      </div>
    </SearchFilter>

    <!-- 订单表格展示区域 -->
    <div class="card">
      <table class="order-table">
        <thead>
        <tr>
          <th>订单号</th>
          <th>当天订单号</th>
          <th>订单菜品</th>
          <th>订单类型</th>
          <th>地址</th>
          <th>实收金额</th>
          <th>项目状态</th>
          <th>项目附加</th>
          <th>支付方式</th>
          <th>支付时间</th>
          <th>配送地址</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <!-- 遍历过滤后的订单数据 -->
        <tr v-for="(order, index) in filteredOrders" :key="index">
          <td>{{ order.orderNo }}</td> <!-- 显示订单号 -->
          <td>{{ order.todayOrderNo }}</td> <!-- 显示当天订单号 -->
          <td>{{ order.dishes.join(', ') }}</td> <!-- 显示订单菜品 -->
          <td>{{ order.orderType }}</td> <!-- 显示订单类型（自提或外卖） -->
          <td>{{ order.address }}</td> <!-- 显示地址 -->
          <td>{{ order.amount }}</td> <!-- 显示实收金额 -->
          <td>
              <span :class="['status-badge', getStatusClass(order.status)]">
                {{ getStatusText(order.status) }}
              </span>
          </td> <!-- 显示项目状态 -->
          <!-- 调用 mapDeliveryInfo 方法映射配送信息 -->
          <td>{{ mapDeliveryInfo(order.deliveryInfo) }}</td>
          <td>{{ order.paymentMethod }}</td> <!-- 显示支付方式 -->
          <td>{{ order.paymentTime }}</td> <!-- 显示支付时间 -->
          <td>{{ order.deliveryAddress }}</td> <!-- 显示配送地址 -->
          <td>
            <button class="btn btn-edit">查看</button>
            <button v-if="order.status === 'pending'" class="btn" style="background-color: rgba(52, 199, 89, 0.1); color: var(--secondary-color);">
              接单
            </button>
            <button v-if="order.status === 'delivering'" class="btn" style="background-color: rgba(0, 113, 227, 0.1); color: var(--primary-color);">
              派送
            </button>
          </td> <!-- 操作按钮 -->
        </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页组件 -->
    <div class="pagination">
      <div>共 {{ totalOrders }} 条记录</div>
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
import SearchFilter from '../components/SearchFilter.vue'; // 导入搜索筛选组件

export default {
  name: 'OrderManagement',  // 组件名称
  components: { SearchFilter },
  data() {
    return {
      // 示例订单数据（补充完整字段）
      orders: [
        {
          orderNo: 'ORD20230001', // 订单号
          todayOrderNo: 'TODAY001', // 当天订单号
          dishes: ['鱼香肉丝', '宫保鸡丁'], // 菜品列表
          orderType: '外卖', // 订单类型
          address: '北京市朝阳区建国路88号', // 地址
          amount: '¥68.00', // 实收金额
          status: 'completed', // 订单状态
          deliveryInfo: '{"receiver": "张三", "phone": "13800138000"}', // 配送信息（JSON格式字符串）
          paymentMethod: '微信支付', // 支付方式
          paymentTime: '2023-05-15 12:30', // 支付时间
          deliveryAddress: '北京市朝阳区建国路88号' // 配送地址
        },
        {
          orderNo: 'ORD20230002',
          todayOrderNo: 'TODAY002',
          dishes: ['红烧肉', '清炒时蔬'],
          orderType: '自提',
          address: '北京市海淀区中关村大街1号',
          amount: '¥98.00',
          status: 'delivering',
          deliveryInfo: '{"receiver": "李四", "phone": "13800138001"}',
          paymentMethod: '余额支付',
          paymentTime: '2023-05-15 13:15',
          deliveryAddress: '北京市海淀区中关村大街1号'
        },
        {
          orderNo: 'ORD20230003',
          todayOrderNo: 'TODAY003',
          dishes: ['水煮鱼'],
          orderType: '外卖',
          address: '北京市西城区西单北大街131号',
          amount: '¥58.00',
          status: 'pending',
          deliveryInfo: '{"receiver": "王五", "phone": "13800138002"}',
          paymentMethod: '微信支付',
          paymentTime: '2023-05-15 14:20',
          deliveryAddress: '北京市西城区西单北大街131号'
        },
        {
          orderNo: 'ORD20230004',
          todayOrderNo: 'TODAY004',
          dishes: ['麻婆豆腐', '米饭'],
          orderType: '自提',
          address: '北京市东城区东直门内大街',
          amount: '¥32.00',
          status: 'canceled',
          deliveryInfo: '{"receiver": "赵六", "phone": "13800138003"}',
          paymentMethod: '余额支付',
          paymentTime: '2023-05-15 11:45',
          deliveryAddress: '北京市东城区东直门内大街'
        },
        {
          orderNo: 'ORD20230005',
          todayOrderNo: 'TODAY005',
          dishes: ['北京烤鸭'],
          orderType: '外卖',
          address: '北京市朝阳区三里屯路19号',
          amount: '¥198.00',
          status: 'completed',
          deliveryInfo: '{"receiver": "钱七", "phone": "13800138004"}',
          paymentMethod: '微信支付',
          paymentTime: '2023-05-14 18:30',
          deliveryAddress: '北京市朝阳区三里屯路19号'
        }
      ],
      // 订单筛选条件
      orderFilter: {
        orderNo: '',      // 订单号过滤
        status: '',       // 订单状态过滤
        startDate: '',    // 开始日期过滤
        endDate: ''       // 结束日期过滤
      },
      currentPage: 1,   // 当前页码
      pageSize: 10      // 每页显示数量
    };
  },
  computed: {
    // 根据筛选条件过滤订单数据
    filteredOrders() {
      let result = this.orders;
      if (this.orderFilter.orderNo) {
        result = result.filter(order => order.orderNo.includes(this.orderFilter.orderNo));
      }
      if (this.orderFilter.status) {
        result = result.filter(order => order.status === this.orderFilter.status);
      }
      if (this.orderFilter.startDate && this.orderFilter.endDate) {
        result = result.filter(order => order.paymentTime >= this.orderFilter.startDate && order.paymentTime <= this.orderFilter.endDate);
      }
      return result;
    },
    // 总订单数
    totalOrders() {
      return this.filteredOrders.length;
    },
    // 总页数
    totalPages() {
      return Math.ceil(this.totalOrders / this.pageSize);
    }
  },
  methods: {
    // 映射配送信息，将后端传参映射为 {买家:"王五", 电话:"13800138002"} 格式
    mapDeliveryInfo(info) {
      try {
        const parsed = JSON.parse(info); // 解析 JSON 字符串
        return `{买家:"${parsed.receiver}", 电话:"${parsed.phone}"}`; // 返回映射后的字符串
      } catch (error) {
        return info; // 若解析失败则原样返回
      }
    },
    // 搜索操作，重置页码
    onSearch() {
      this.currentPage = 1;
    },
    // 新增：重置筛选条件方法
    onReset() {
      this.orderFilter.orderNo = '';
      this.orderFilter.status = '';
      this.orderFilter.startDate = '';
      this.orderFilter.endDate = '';
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
    // 根据订单状态返回对应的 CSS 类
    getStatusClass(status) {
      const config = {
        pending: 'status-pending',
        delivering: 'status-pending',
        completed: 'status-on',
        canceled: 'status-off'
      };
      return config[status];
    },
    // 根据订单状态返回对应的显示文本
    getStatusText(status) {
      const texts = {
        pending: '待接单',
        delivering: '待派送',
        completed: '已完成',
        canceled: '已取消'
      };
      return texts[status];
    }
  }
};
</script>
<!-- style 部分引用外部样式文件，不再补写 -->
<style scoped src="../DataStatistics.css"></style>
