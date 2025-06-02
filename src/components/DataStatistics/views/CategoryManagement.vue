<!-- 文件路径: src/views/CategoryManagement.vue -->
<template>
  <div class="category-management fade-in">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>分类管理</h1>
      <p class="page-description">管理菜品和套餐分类，可进行新增、修改、删除等操作</p>
    </div>

    <!-- 搜索和筛选区域 -->
    <SearchFilter @search="onSearch" @reset="onReset">
      <!-- 搜索输入：分类名称 -->
      <div class="search-input">
        <label>分类名称</label>
        <input type="text" v-model="categoryFilter.name" placeholder="请输入分类名称">
      </div>
      <!-- 搜索输入：分类类型 -->
      <div class="search-input">
        <label>分类类型</label>
        <select v-model="categoryFilter.type">
          <option value="">全部类型</option>
          <option value="1">菜品分类</option>
          <option value="2">套餐分类</option>
        </select>
      </div>
      <!-- 搜索输入：状态 -->
      <div class="search-input">
        <label>状态</label>
        <select v-model="categoryFilter.status">
          <option value="">全部状态</option>
          <option value="1">启用</option>
          <option value="0">禁用</option>
        </select>
      </div>
    </SearchFilter>

    <!-- 操作按钮区域 -->
    <div class="action-buttons">
      <button class="btn btn-primary" @click="showAddDialog">
        <i class="icon-plus"></i> 新增分类
      </button>
      <button class="btn btn-export" @click="exportData">
        <i class="icon-download"></i> 导出数据
      </button>
    </div>

    <!-- 分类表格展示 -->
    <div class="card">
      <table class="category-table">
        <thead>
        <tr>
          <th>序号</th>
          <th>分类名称</th>
          <th>分类类型</th>
          <th>分类描述</th>
          <th>排序</th>
          <th>状态</th>
          <th>操作时间</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(category, index) in filteredCategories" :key="category.id">
          <td>{{ index + 1 }}</td>
          <td>{{ category.name }}</td>
          <td>{{ getTypeName(category.type) }}</td>
          <td>{{ category.description || '无描述' }}</td>
          <td>{{ category.sort }}</td>
          <td>
              <span :class="['status-badge', category.status === '1' ? 'status-on' : 'status-off']">
                {{ category.status === '1' ? '启用' : '禁用' }}
              </span>
          </td>
          <td>{{ formatTime(category.operationTime) }}</td>
          <td class="action-buttons">
            <button class="btn btn-edit" @click="showEditDialog(category)">
              <i class="icon-edit"></i> 修改
            </button>
            <button class="btn btn-delete" @click="confirmDelete(category.id)">
              <i class="icon-delete"></i> 删除
            </button>
            <button
                v-if="category.status === '1'"
                class="btn btn-disable"
                @click="toggleStatus(category.id, '0')"
            >
              <i class="icon-disable"></i> 禁用
            </button>
            <button
                v-else
                class="btn btn-enable"
                @click="toggleStatus(category.id, '1')"
            >
              <i class="icon-enable"></i> 启用
            </button>
          </td>
        </tr>
        <tr v-if="filteredCategories.length === 0">
          <td colspan="8" class="no-data">暂无数据</td>
        </tr>
        </tbody>
      </table>

      <!-- 分页组件 -->
      <div class="pagination" v-if="filteredCategories.length > 0">
        <button class="btn" :disabled="currentPage === 1" @click="prevPage">
          <i class="icon-arrow-left"></i> 上一页
        </button>
        <span class="page-info">第 {{ currentPage }} 页 / 共 {{ totalPages }} 页</span>
        <button class="btn" :disabled="currentPage === totalPages" @click="nextPage">
          下一页 <i class="icon-arrow-right"></i>
        </button>
      </div>
    </div>

    <!-- 新增/编辑分类对话框 -->
    <div class="modal" v-if="showDialog">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ isEditing ? '修改分类' : '新增分类' }}</h3>
          <button class="btn-close" @click="closeDialog">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitForm">
            <div class="form-group">
              <label>分类名称 <span class="required">*</span></label>
              <input
                  type="text"
                  v-model="currentCategory.name"
                  placeholder="请输入分类名称"
                  required
              >
            </div>
            <div class="form-group">
              <label>分类类型 <span class="required">*</span></label>
              <select v-model="currentCategory.type" required>
                <option value="1">菜品分类</option>
                <option value="2">套餐分类</option>
              </select>
            </div>
            <div class="form-group">
              <label>分类描述</label>
              <textarea
                  v-model="currentCategory.description"
                  placeholder="请输入分类描述（可选）"
                  rows="3"
              ></textarea>
            </div>
            <div class="form-group">
              <label>排序值 <span class="required">*</span></label>
              <input
                  type="number"
                  v-model="currentCategory.sort"
                  placeholder="请输入排序值"
                  required
                  min="1"
              >
            </div>
            <div class="form-group">
              <label>状态 <span class="required">*</span></label>
              <select v-model="currentCategory.status" required>
                <option value="1">启用</option>
                <option value="0">禁用</option>
              </select>
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn-cancel" @click="closeDialog">取消</button>
              <button type="submit" class="btn btn-submit">
                {{ isEditing ? '保存修改' : '确认新增' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 删除确认对话框 -->
    <div class="modal" v-if="showDeleteConfirm">
      <div class="modal-content confirm-dialog">
        <div class="modal-header">
          <h3>确认删除</h3>
        </div>
        <div class="modal-body">
          <p>确定要删除该分类吗？此操作不可恢复！</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-cancel" @click="showDeleteConfirm = false">取消</button>
          <button class="btn btn-delete" @click="deleteCategory">确认删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchFilter from '../components/SearchFilter.vue';

export default {
  name: 'CategoryManagement',
  components: { SearchFilter },
  data() {
    return {
      // 分类数据
      categories: [
        {
          id: 1,
          name: '热销菜品',
          type: '1',
          description: '最受欢迎的热销菜品分类',
          sort: 1,
          status: '1',
          operationTime: '2023-05-15 11:11:00'
        },
        {
          id: 2,
          name: '凉菜',
          type: '1',
          description: '各类凉拌菜品',
          sort: 2,
          status: '1',
          operationTime: '2023-05-15 10:30:00'
        },
        {
          id: 3,
          name: '套餐分类',
          type: '2',
          description: '各种优惠套餐',
          sort: 3,
          status: '0',
          operationTime: '2023-05-14 09:15:00'
        },
        {
          id: 4,
          name: '饮料',
          type: '1',
          description: '各种饮品和酒水',
          sort: 4,
          status: '1',
          operationTime: '2023-05-14 14:20:00'
        }
      ],
      // 筛选条件
      categoryFilter: {
        name: '',
        type: '',
        status: ''
      },
      // 当前操作分类
      currentCategory: {
        id: null,
        name: '',
        type: '1',
        description: '',
        sort: '',
        status: '1'
      },
      // 对话框控制
      showDialog: false,
      isEditing: false,
      showDeleteConfirm: false,
      deleteId: null,
      // 分页
      currentPage: 1,
      pageSize: 10
    };
  },
  computed: {
    // 过滤后的分类数据
    filteredCategories() {
      let filtered = this.categories.filter(cat => {
        return (!this.categoryFilter.name || cat.name.includes(this.categoryFilter.name)) &&
            (!this.categoryFilter.type || cat.type === this.categoryFilter.type) &&
            (!this.categoryFilter.status || cat.status === this.categoryFilter.status);
      });
      // 分页处理
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return filtered.slice(start, end);
    },
    // 总页数
    totalPages() {
      const filteredCount = this.categories.filter(cat => {
        return (!this.categoryFilter.name || cat.name.includes(this.categoryFilter.name)) &&
            (!this.categoryFilter.type || cat.type === this.categoryFilter.type) &&
            (!this.categoryFilter.status || cat.status === this.categoryFilter.status);
      }).length;
      return Math.ceil(filteredCount / this.pageSize);
    }
  },
  methods: {
    // 获取分类类型名称
    getTypeName(type) {
      return type === '1' ? '菜品分类' : '套餐分类';
    },
    // 格式化时间
    formatTime(time) {
      if (!time) return '';
      return time.split(' ')[0];
    },
    // 搜索操作
    onSearch() {
      this.currentPage = 1; // 搜索时重置到第一页
    },
    // 重置搜索条件
    onReset() {
      this.categoryFilter = {
        name: '',
        type: '',
        status: ''
      };
      this.currentPage = 1;
    },
    // 显示新增对话框
    showAddDialog() {
      this.currentCategory = {
        id: null,
        name: '',
        type: '1',
        description: '',
        sort: this.getNextSortValue(),
        status: '1'
      };
      this.isEditing = false;
      this.showDialog = true;
    },
    // 显示编辑对话框
    showEditDialog(category) {
      this.currentCategory = { ...category };
      this.isEditing = true;
      this.showDialog = true;
    },
    // 关闭对话框
    closeDialog() {
      this.showDialog = false;
    },
    // 提交表单
    submitForm() {
      if (this.isEditing) {
        // 更新分类
        const index = this.categories.findIndex(c => c.id === this.currentCategory.id);
        if (index !== -1) {
          this.categories.splice(index, 1, {
            ...this.currentCategory,
            operationTime: new Date().toLocaleString('zh-CN', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            }).replace(/\//g, '-')
          });
        }
      } else {
        // 新增分类
        const newId = Math.max(...this.categories.map(c => c.id)) + 1;
        this.categories.push({
          ...this.currentCategory,
          id: newId,
          operationTime: new Date().toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          }).replace(/\//g, '-')
        });
      }
      this.showDialog = false;
      this.$message.success(this.isEditing ? '修改成功!' : '新增成功!');
    },
    // 获取下一个排序值
    getNextSortValue() {
      if (this.categories.length === 0) return 1;
      return Math.max(...this.categories.map(c => c.sort)) + 1;
    },
    // 确认删除
    confirmDelete(id) {
      this.deleteId = id;
      this.showDeleteConfirm = true;
    },
    // 执行删除
    deleteCategory() {
      this.categories = this.categories.filter(c => c.id !== this.deleteId);
      this.showDeleteConfirm = false;
      this.$message.success('删除成功!');
    },
    // 切换状态
    toggleStatus(id, status) {
      const category = this.categories.find(c => c.id === id);
      if (category) {
        category.status = status;
        category.operationTime = new Date().toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }).replace(/\//g, '-');
        this.$message.success(status === '1' ? '已启用分类!' : '已禁用分类!');
      }
    },
    // 导出数据
    exportData() {
      // 这里应该是导出逻辑，简单模拟
      this.$message.info('导出功能将在实际项目中实现');
    },
    // 上一页
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    // 下一页
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    }
  }
};
</script>

<!-- 引入现有的样式文件 -->
<style scoped src="../DataStatistics.css"></style>


