// src/components/DataStatistics/router.js 路由配置文件 - 苹果风格项目配置

import Vue from 'vue';                      // 引入 Vue 库
import Router from 'vue-router';            // 引入 Vue Router 库
import Dashboard from '../views/Dashboard.vue';            // 导入工作台视图组件
import OrderManagement from '../views/OrderManagement.vue';  // 导入订单管理视图组件
import CategoryManagement from '../views/CategoryManagement.vue';  // 导入分类管理视图组件
import DishManagement from '../views/DishManagement.vue';    // 导入菜品管理视图组件
import Statistics from '../views/Statistics.vue';            // 导入数据统计视图组件
import RechargeManagement from '../views/RechargeManagement.vue';
import CouponManagement from '../views/CouponManagement.vue';

Vue.use(Router); // 注册 Vue Router 插件

// 创建并导出路由实例
export default new Router({
    mode: 'history',  // 使用 history 模式，去除 hash
    routes: [
        {
            path: '/recharge',
            name: 'recharge',
            component: RechargeManagement
        },
        {
            path: '/coupon',
            name: 'coupon',
            component: CouponManagement
        },
        {
            path: '/',            // 根路径
            redirect: '/dashboard' // 重定向到工作台视图
        },
        {
            path: '/dashboard',   // 工作台路径
            name: 'dashboard',    // 路由名称
            component: Dashboard  // 指定组件
        },
        {
            path: '/order',       // 订单管理路径
            name: 'order',        // 路由名称
            component: OrderManagement // 指定组件
        },
        {
            path: '/category',    // 分类管理路径
            name: 'category',     // 路由名称
            component: CategoryManagement // 指定组件
        },
        {
            path: '/dish',        // 菜品管理路径
            name: 'dish',         // 路由名称
            component: DishManagement // 指定组件
        },
        {
            path: '/statistics',  // 数据统计路径
            name: 'statistics',   // 路由名称
            component: Statistics // 指定组件
        }
    ]
});
