// DataStatistics.js 公共函数与配置文件 - 苹果风格配置版

// 定义中继器模板对象，用于配置图表和数据模板
export const repeaterTemplates = {
  axhubLineConfig: "// 此处为中继器配置模板",  // 中继器配置模板
  axhubLineData: "// 此处为中继器数据模板",      // 中继器数据模板
  lineConfig: "// 配置模板",                    // 折线图配置模板
  lineData: "// 数据模板",                      // 折线图数据模板
  columnConfig: "// 柱状图配置模板",             // 柱状图配置模板
  columnData: "// 柱状图数据模板",               // 柱状图数据模板
  orderLineConfig: "// 订单统计折线图配置模板",    // 订单折线图配置模板
  orderLineData: "// 订单统计折线图数据模板"       // 订单折线图数据模板
};

// 定义订单状态配置
export const statusConfig = {
  order: {
    pending: { text: '待接单', class: 'status-pending' },   // 待接单配置
    delivering: { text: '待派送', class: 'status-pending' },  // 待派送配置
    completed: { text: '已完成', class: 'status-on' },        // 已完成配置
    canceled: { text: '已取消', class: 'status-off' }         // 已取消配置
  }
  // 可扩展其他类型状态配置
};

// 格式化货币数值函数
export function formatCurrency(value) {
  // 保留两位小数，并添加人民币符号
  return `¥${Number(value).toFixed(2)}`;
}

// 格式化百分比函数
export function formatPercentage(value) {
  // 将小数转换为百分比字符串，保留1位小数
  return `${(value * 100).toFixed(1)}%`;
}
