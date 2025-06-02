// 文件路径: router/index.js
// 该文件用于配置 Vue Router，实现页面跳转

// 引入 createRouter 和 createWebHistory 方法，用于创建路由实例
import { createRouter, createWebHistory } from 'vue-router'

// 导入登录页面组件
import login from '@/components/AuthLogin/AuthLogin.vue' // 请确认路径正确

// 导入数据统计主入口组件
import datastatistics from '@/components/DataStatistics/DataStatistics.vue'

// 导入数据统计模块下的各个视图组件
import Dashboard from '@/components/DataStatistics/views/Dashboard.vue'             // 工作台视图
import OrderManagement from '@/components/DataStatistics/views/OrderManagement.vue' // 订单管理视图
import CategoryManagement from '@/components/DataStatistics/views/CategoryManagement.vue' // 分类管理视图
import DishManagement from '@/components/DataStatistics/views/DishManagement.vue'     // 菜品管理视图
import Statistics from '@/components/DataStatistics/views/Statistics.vue'           // 数据统计视图
import RechargeManagement from '@/components/DataStatistics/views/RechargeManagement.vue';
import CouponManagement from '@/components/DataStatistics/views/CouponManagement.vue';
// 定义路由规则
const routes = [
    // 登录路由
    { path: '/login', component: login },
    // 数据统计模块主路由，包含子路由
    {
        path: '/datastatistics',
        component: datastatistics,
        // 嵌套路由配置：为各子模块设置路由名称，便于导航跳转
        children: [
            { path: 'dashboard', name: 'dashboard', component: Dashboard },             // 工作台
            { path: 'order', name: 'order', component: OrderManagement },               // 订单管理
            { path: 'category', name: 'category', component: CategoryManagement },        // 分类管理
            { path: 'dish', name: 'dish', component: DishManagement },                   // 菜品管理
            { path: 'statistics', name: 'statistics', component: Statistics },           // 数据统计
            { path: 'coupon', name: 'coupon', component: CouponManagement },           // 优惠券
            { path: 'recharge', name: 'recharge', component: RechargeManagement },           // 充值管理
            // 默认子路由，访问 /datastatistics 时重定向到工作台
            { path: '', redirect: { name: 'dashboard' } }
        ]
    },
    // 根路径重定向到数据统计模块
    { path: '/', redirect: '/datastatistics' }
]

// 创建路由实例，指定历史模式和路由规则
const router = createRouter({
    history: createWebHistory(),
    routes
})

// 导出路由实例
export default router
