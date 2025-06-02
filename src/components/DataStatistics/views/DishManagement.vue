<!-- 文件路径: src/views/DishManagement.vue -->
<template>
  <div class="dish-management fade-in">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>菜品管理</h1>
    </div>

    <!-- 搜索和筛选区域 -->
    <SearchFilter @search="onSearch">
      <!-- 搜索输入：菜品名称 -->
      <div class="search-input">
        <label>菜品名称</label>
        <input type="text" v-model="dishFilter.name" placeholder="请输入菜品名称">
      </div>
      <!-- 搜索输入：菜品分类 -->
      <div class="search-input">
        <label>菜品分类</label>
        <select v-model="dishFilter.category">
          <option value="">全部分类</option>
          <option v-for="cat in dishCategories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
        </select>
      </div>
      <!-- 搜索输入：售卖状态 -->
      <div class="search-input">
        <label>售卖状态</label>
        <select v-model="dishFilter.status">
          <option value="">全部状态</option>
          <option value="1">启售</option>
          <option value="0">停售</option>
        </select>
      </div>
    </SearchFilter>

    <!-- 新增菜品按钮 -->
    <div style="text-align: right; margin-bottom: 15px;">
      <!-- 修改：新增点击事件 @click 调用 showAddDishDialog -->
      <button class="btn" style="background-color: var(--primary-color); color: white;" @click="showAddDishDialog">➕ 新增菜品</button>
    </div>

    <!-- 菜品表格展示区域 -->
    <div class="card">
      <table class="dish-table">
        <thead>
        <tr>
          <th>菜品名称</th>
          <th>图片</th>
          <th>菜品分类</th>
          <th>商品描述</th>
          <th>售价</th>
          <th>库存数量</th>
          <th>额外添加选项</th>
          <th>尺寸</th>
          <th>售卖状态</th>
          <th>最后操作时间</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <!-- 循环展示过滤后的菜品数据 -->
        <tr v-for="(dish, index) in filteredDishes" :key="index">
          <td>{{ dish.name }}</td>
          <td><span class="dish-image">🟡️</span></td>
          <td>{{ dish.category }}</td>
          <td>{{ dish.description }}</td>
          <td>{{ dish.price }}</td>
          <td>{{ dish.stock }}</td>
          <td>{{ dish.extraOptions }}</td>
          <td>{{ dish.size }}</td>
          <td>
           <span :class="['status-badge', dish.status === '启售' ? 'status-on' : 'status-off']">
             {{ dish.status }}
           </span>
          </td>
          <td>{{ dish.lastOperationTime }}</td>
          <td>
            <button class="btn btn-edit">修改</button>
            <button class="btn btn-delete">删除</button>
            <button v-if="dish.status === '启售'" class="btn btn-disable">停售</button>
            <button v-else class="btn btn-enable">启售</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页组件 -->
    <div class="pagination">
      <div>共 {{ totalDishes }} 条记录</div>
      <div class="page-numbers">
        <button @click="prevDishPage" :disabled="currentDishPage === 1">上一页</button>
        <button v-for="page in totalDishPages" :key="page" @click="goToDishPage(page)" :class="{active: currentDishPage === page}">
          {{ page }}
        </button>
        <button @click="nextDishPage" :disabled="currentDishPage === totalDishPages">下一页</button>
      </div>
    </div>

    <!-- 新增菜品对话框 -->
    <div class="modal" v-if="showDishDialog">
      <div class="modal-content">
        <div class="modal-header">
          <h3>新增菜品</h3> <!-- 对话框标题 -->
          <button class="btn-close" @click="closeDishDialog">&times;</button> <!-- 关闭按钮 -->
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitDishForm"> <!-- 表单提交事件 -->
            <!-- 菜品名称输入 -->
            <div class="form-group">
              <label>菜品名称</label>
              <input type="text" v-model="currentDish.name" placeholder="请输入菜品名称" required>
            </div>
            <!-- 菜品分类输入 -->
            <div class="form-group">
              <label>菜品分类</label>
              <select v-model="currentDish.category" required>
                <option value="">请选择分类</option>
                <option v-for="cat in dishCategories" :key="cat.id" :value="cat.name">{{ cat.name }}</option>
              </select>
            </div>
            <!-- 商品描述输入 -->
            <div class="form-group">
              <label>商品描述</label>
              <textarea v-model="currentDish.description" placeholder="请输入描述"></textarea>
            </div>
            <!-- 售价输入 -->
            <div class="form-group">
              <label>售价</label>
              <input type="text" v-model="currentDish.price" placeholder="请输入售价" required>
            </div>
            <!-- 提交与取消按钮 -->
            <div class="form-actions">
              <button type="button" class="btn btn-cancel" @click="closeDishDialog">取消</button>
              <button type="submit" class="btn btn-submit">确认新增</button>
            </div>
          </form>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import SearchFilter from '../components/SearchFilter.vue'; // 导入搜索筛选组件

export default {
  name: 'DishManagement',  // 组件名称
  components: { SearchFilter },
  data() {
    return {
      // 示例菜品数据
      dishes: [
        {
          id: 2, // 蛋糕编号
          name: '巧克力蛋糕', // 蛋糕名称
          category: '经典蛋糕', // 蛋糕分类
          description: '浓郁巧克力风味', // 商品描述
          price: '¥68.00', // 蛋糕售价
          stock: 50, // 库存数量
          extraOptions: '加水果、加坚果', // 额外添加选项
          size: '中', // 蛋糕尺寸
          status: '停售', // 售卖状态
          lastOperationTime: '2023-05-15 11:11' // 最后操作时间
        },
        {
          id: 3,
          name: '草莓蛋糕',
          category: '水果蛋糕',
          description: '新鲜草莓与奶油结合',
          price: '¥78.00',
          stock: 30,
          extraOptions: '加奶油、加巧克力',
          size: '大',
          status: '启售',
          lastOperationTime: '2023-05-15 11:11'
        },
        {
          id: 4,
          name: '芝士蛋糕',
          category: '西式蛋糕',
          description: '绵密芝士口感',
          price: '¥88.00',
          stock: 20,
          extraOptions: '加水果',
          size: '中',
          status: '启售',
          lastOperationTime: '2023-05-15 11:11'
        },
        {
          id: 5,
          name: '抹茶蛋糕',
          category: '日式蛋糕',
          description: '清新抹茶香味',
          price: '¥75.00',
          stock: 40,
          extraOptions: '加红豆',
          size: '小',
          status: '启售',
          lastOperationTime: '2023-05-15 11:11'
        },
        {
          id: 6,
          name: '蓝莓蛋糕',
          category: '水果蛋糕',
          description: '蓝莓与奶油完美搭配',
          price: '¥80.00',
          stock: 35,
          extraOptions: '加蓝莓',
          size: '中',
          status: '启售',
          lastOperationTime: '2023-05-15 11:11'
        },
        {
          id: 7,
          name: '红丝绒蛋糕',
          category: '西式蛋糕',
          description: '经典红丝绒风味',
          price: '¥90.00',
          stock: 25,
          extraOptions: '加奶油芝士',
          size: '大',
          status: '停售',
          lastOperationTime: '2023-05-15 11:11'
        }
      ],
      dishCategories: [
        { id: 1, name: '热销菜品' },
        { id: 2, name: '特色菜品' },
        { id: 3, name: '川菜' },
        { id: 4, name: '家常菜' },
        { id: 5, name: '素菜' }
      ],
      // 筛选条件
      dishFilter: {
        name: '',       // 菜品名称过滤
        category: '',   // 菜品分类过滤
        status: ''      // 售卖状态过滤
      },
      currentDishPage: 1,  // 当前页码
      dishPageSize: 5,     // 每页显示数量

      // 新增菜品对话框相关数据
      showDishDialog: false, // 控制新增菜品对话框显示
      currentDish: {         // 当前菜品数据
        id: null,
        name: '',
        category: '',
        description: '',
        price: '',
        stock: 0,
        extraOptions: '',
        size: '',
        status: '启售',
        lastOperationTime: ''
      }
    };
  },
  computed: {
    // 根据过滤条件获取分页后的菜品数据
    filteredDishes() {
      let result = this.dishes.filter(dish => {
        return (!this.dishFilter.name || dish.name.includes(this.dishFilter.name)) &&
            (!this.dishFilter.category || dish.category === this.dishCategories.find(c => c.id == this.dishFilter.category)?.name) &&
            (!this.dishFilter.status ||
                (this.dishFilter.status === '1' && dish.status === '启售') ||
                (this.dishFilter.status === '0' && dish.status === '停售'));
      });
      const start = (this.currentDishPage - 1) * this.dishPageSize;
      return result.slice(start, start + this.dishPageSize);
    },
    // 总菜品数
    totalDishes() {
      return this.dishes.length;
    },
    // 总页数
    totalDishPages() {
      return Math.ceil(this.totalDishes / this.dishPageSize);
    }
  },
  methods: {
    // 搜索操作，重置页码
    onSearch() {
      this.currentDishPage = 1;
    },
    // 上一页
    prevDishPage() {
      if (this.currentDishPage > 1) this.currentDishPage--;
    },
    // 下一页
    nextDishPage() {
      if (this.currentDishPage < this.totalDishPages) this.currentDishPage++;
    },
    // 跳转到指定页码
    goToDishPage(page) {
      this.currentDishPage = page;
    },
    // 显示新增菜品对话框
    showAddDishDialog() {
      // 初始化当前菜品数据并显示对话框
      this.currentDish = {
        id: null,
        name: '',
        category: '',
        description: '',
        price: '',
        stock: 0,
        extraOptions: '',
        size: '',
        status: '启售',
        lastOperationTime: new Date().toLocaleString('zh-CN')
      };
      this.showDishDialog = true;
    },
    // 关闭新增菜品对话框
    closeDishDialog() {
      this.showDishDialog = false;
    },
    // 提交新增菜品表单
    submitDishForm() {
      // 生成新的菜品编号并添加到菜品列表中
      const newId = Math.max(...this.dishes.map(d => d.id)) + 1;
      this.dishes.push({
        ...this.currentDish,
        id: newId,
        lastOperationTime: new Date().toLocaleString('zh-CN')
      });
      this.$message && this.$message.success('新增菜品成功!'); // 弹出成功提示
      this.closeDishDialog(); // 关闭对话框
    }
  }
};
</script>

<style scoped src="../DataStatistics.css"></style>
