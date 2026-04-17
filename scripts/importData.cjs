const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../Data.xlsx');
const workbook = XLSX.readFile(filePath);

function getSheetData(sheetName) {
  const worksheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(worksheet);
}

function excelSerialToDate(serial) {
  const date = new Date((serial - 25569) * 86400 * 1000);
  return date.toISOString().split('T')[0] + ' ' + date.toTimeString().split(' ')[0];
}

function jsonStringify(obj) {
  return JSON.stringify(obj, null, 2);
}

const productsData = getSheetData('Products Data');
const inventoryData = getSheetData('Store Inventory');
const ordersData = getSheetData('Inbound Orders');

const storeNames = [...new Set(inventoryData.map(item => item.store_name))];

const alerts = inventoryData
  .filter(item => item.current_stock <= item.safety_stock)
  .slice(0, 10)
  .map((item, index) => ({
    id: (index + 1).toString(),
    productName: item.product_name,
    location: item.store_name,
    currentStock: item.current_stock,
    safetyStock: item.safety_stock,
    status: item.current_stock === 0 ? 'OUT_OF_STOCK' : item.current_stock < item.safety_stock * 0.5 ? 'URGENT' : 'LOW_STOCK',
    severity: item.current_stock === 0 ? 'high' : item.current_stock < item.safety_stock * 0.5 ? 'high' : 'medium',
    sku: item.product_id,
    category: productsData.find(p => p.product_id === item.product_id)?.category || 'Other',
    dailySales: Math.floor(Math.random() * 20) + 5,
    trend: Math.floor(Math.random() * 100) - 20
  }));

const stores = storeNames.map((storeName, index) => {
  const storeAlerts = alerts.filter(a => a.location === storeName);
  return {
    id: (index + 1).toString(),
    name: storeName,
    sales: Math.floor(Math.random() * 300000) + 150000,
    rank: 0,
    stockHealth: Math.floor(Math.random() * 30) + 70,
    alerts: storeAlerts.length,
    manager: ['David Chen', 'Emily Wong', 'Michael Lee', 'Sarah Chan', 'James Liu'][index % 5],
    address: ['香港铜锣湾', '香港尖沙咀', '香港旺角', '香港中环', '香港沙田'][index % 5]
  };
});

stores.sort((a, b) => b.sales - a.sales);
stores.forEach((store, index) => {
  store.rank = index + 1;
});

const products = productsData.map((item, index) => {
  const inventory = inventoryData.find(i => i.product_id === item.product_id);
  const safetyStock = inventory ? inventory.safety_stock : Math.floor(Math.random() * 30) + 20;
  const maxStock = inventory ? inventory.max_stock : safetyStock * 2;
  const currentStock = inventory ? Math.min(inventory.current_stock, maxStock) : 0;
  const status = currentStock === 0 ? 'out' : currentStock < safetyStock ? 'low' : 'normal';

  const days = ['04-10', '04-11', '04-12', '04-13', '04-14', '04-15', '04-16'];
  const salesHistory = days.map(day => ({
    date: day,
    sales: Math.floor(Math.random() * 20) + 5
  }));
  const price = Math.floor(Math.random() * 200) + 10;
  const priceHistory = days.map((day, i) => ({
    date: day,
    price: price + Math.floor(Math.random() * 10) - 5
  }));

  const storeNames = ['Tsim Sha Tsui', 'Mong Kok', 'Causeway Bay'];
  const storeIndex = storeNames.indexOf(inventory?.store_name || 'Causeway Bay');
  const storeId = (storeIndex >= 0 ? storeIndex : 2) + 1 + '';

  return {
    id: (index + 1).toString(),
    name: item.product_name,
    sku: item.product_id,
    storeName: inventory ? inventory.store_name : 'Causeway Bay',
    category: item.category,
    currentStock,
    safetyStock,
    maxStock,
    price,
    storeId: storeId,
    status,
    dailySales24h: Math.floor(Math.random() * 15) + 3,
    salesHistory,
    priceHistory
  };
});

const purchaseOrdersData = ordersData.filter(item => item.order_type === 'Purchase');

const purchaseOrders = purchaseOrdersData.map((item, index) => {
  const status = item.status;

  const supplier = productsData.find(p => p.product_id === item.product_id)?.supplier || 'Unknown';

  return {
    id: (index + 1).toString(),
    orderId: item.order_id,
    supplier: supplier,
    itemCount: 1,
    status: status,
    hasAlert: item.current_stock < item.safety_stock,
    date: excelSerialToDate(item.created_time).split(' ')[0],
    priority: index < 10 ? 'high' : index < 20 ? 'medium' : 'low',
    estimatedArrival: excelSerialToDate(item.expected_time).split(' ')[1],
    items: [{
      id: (index + 1).toString(),
      name: item.product_name,
      sku: item.product_id,
      expected: item.quantity,
      actual: status === 'Completed' ? item.quantity : Math.floor(item.quantity * 0.95),
      hasDiscrepancy: Math.random() > 0.7
    }]
  };
});

const returnOrders = ordersData
  .filter(item => item.order_type === 'Return')
  .map((item, index) => ({
    id: (index + 1).toString(),
    orderId: item.order_id,
    storeId: storeNames.indexOf(item.store_name) + 1 + '',
    storeName: item.store_name,
    itemCount: 1,
    status: item.status,
    date: excelSerialToDate(item.created_time).split(' ')[0],
    items: [{
      id: (index + 1).toString(),
      name: item.product_name,
      sku: item.product_id,
      quantity: item.quantity,
      reason: ['packaging_damaged', 'quality_issue', 'expired', 'customer_return', 'shipping_damage', 'other'][index % 6],
      condition: ['slightly_damaged', 'severely_damaged', 'expired', 'good', 'slightly_damaged', 'severely_damaged'][index % 6]
    }]
  }));

const transfers = alerts.slice(0, 5).map((alert, index) => ({
  id: `DISP-2026-${String(index + 1).padStart(3, '0')}`,
  productName: alert.productName,
  sku: alert.sku,
  fromStore: '中央仓库',
  toStore: alert.location,
  quantity: alert.safetyStock - alert.currentStock + Math.floor(Math.random() * 20),
  status: ['待审批', '执行中', '待审批', '已完成', '已拒绝'][index],
  urgency: alert.severity,
  requestedBy: stores.find(s => s.name === alert.location)?.manager || '张伟',
  requestedAt: `2026-04-16 ${String(Math.floor(Math.random() * 6) + 8).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
  reason: alert.currentStock === 0 ? '库存已清零，紧急补货' : '库存低于安全水位'
}));

const statuses = ['待处理', '修复中', '待处理', '已查看', '处理完毕', '待处理', '待处理', '已查看', '待处理', '修复中'];
const mockTopAlerts = alerts.map((alert, index) => ({
  id: (index + 1).toString(),
  severity: alert.severity,
  description: `${alert.productName}库存${alert.currentStock === 0 ? '已清零' : `不足 (${alert.currentStock}件)`}`,
  store: alert.location,
  status: statuses[index] || '待处理',
  storeId: storeNames.indexOf(alert.location) + 1 + '',
  productId: (index + 1).toString()
}));

const weeklyStoreData = stores.map(s => ({
  name: s.name,
  sales: Math.floor(s.sales / 1000),
  target: Math.floor(s.sales / 1000) + Math.floor(Math.random() * 50)
}));

const productStockMap = {};
productsData.forEach(product => {
  const inventory = inventoryData.find(i => i.product_id === product.product_id);
  productStockMap[product.product_id] = inventory ? inventory.current_stock : 0;
});

const categoryInventory = Object.entries(productStockMap).reduce((acc, [productId, stock]) => {
  const product = productsData.find(p => p.product_id === productId);
  if (product) {
    const category = product.category;
    acc[category] = (acc[category] || 0) + stock;
  }
  return acc;
}, {});
const totalInventory = Object.values(categoryInventory).reduce((sum, val) => sum + val, 0);
const inventoryDistribution = Object.entries(categoryInventory).map(([category, stock]) => ({
  category,
  value: stock
}));

const todaySales = stores.reduce((sum, s) => sum + s.sales, 0);
const inboundOrderCount = purchaseOrders.reduce((sum, o) => sum + o.itemCount, 0);
const returnOrderCount = returnOrders.reduce((sum, o) => sum + o.itemCount, 0);
const totalOrders = inboundOrderCount + returnOrderCount;
const customerTraffic = Math.round(totalOrders * 3.5);

const kpiData = [
  { label: '今日销售额', value: todaySales },
  { label: '订单数', value: totalOrders },
  { label: '客流量', value: customerTraffic },
  { label: '库存总量', value: totalInventory }
];

const output = `export interface Alert {
  id: string;
  productName: string;
  location: string;
  currentStock: number;
  safetyStock: number;
  status: 'LOW_STOCK' | 'OUT_OF_STOCK' | 'URGENT';
  severity: 'high' | 'medium' | 'low';
  sku: string;
  category: string;
  dailySales: number;
  trend: number;
}

export interface InboundOrder {
  id: string;
  orderId: string;
  supplier: string;
  itemCount: number;
  status: 'Pending' | 'Partially Received' | 'Completed';
  hasAlert: boolean;
  date: string;
  items: InboundItem[];
  priority?: 'high' | 'medium' | 'low';
  estimatedArrival?: string;
}

export interface InboundItem {
  id: string;
  name: string;
  sku: string;
  expected: number;
  actual: number;
  hasDiscrepancy: boolean;
}

export interface ReturnOrder {
  id: string;
  orderId: string;
  storeId: string;
  storeName: string;
  itemCount: number;
  status: 'Pending' | 'Completed';
  date: string;
  items: ReturnItem[];
}

export interface ReturnItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  reason: string;
  condition: '完好' | '轻微损坏' | '严重损坏' | '过期';
}

export interface Store {
  id: string;
  name: string;
  sales: number;
  rank: number;
  stockHealth: number;
  alerts: number;
  manager: string;
  address: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  storeName: string;
  category: string;
  currentStock: number;
  safetyStock: number;
  maxStock: number;
  price: number;
  storeId: string;
  status: 'normal' | 'low' | 'out';
  priceHistory?: { date: string; price: number }[];
  salesHistory?: { date: string; sales: number }[];
  dailySales24h?: number;
}

export interface Transfer {
  id: string;
  productName: string;
  sku: string;
  fromStore: string;
  toStore: string;
  quantity: number;
  status: '待审批' | '执行中' | '已完成' | '已拒绝';
  urgency: 'high' | 'medium' | 'low';
  requestedBy: string;
  requestedAt: string;
  reason: string;
}

export const mockAlerts: Alert[] = ${jsonStringify(alerts)};

export const mockInboundOrders: InboundOrder[] = ${jsonStringify(purchaseOrders)};

export const mockReturnOrders: ReturnOrder[] = ${jsonStringify(returnOrders)};

export const mockStores: Store[] = ${jsonStringify(stores)};

export const mockProducts: Product[] = ${jsonStringify(products)};

export const mockTransfers: Transfer[] = ${jsonStringify(transfers)};

export const mockTopAlerts = ${jsonStringify(mockTopAlerts)};

export const salesTrendData = [
  { day: '周一', value: 45, lastWeek: 38 },
  { day: '周二', value: 52, lastWeek: 45 },
  { day: '周三', value: 61, lastWeek: 50 },
  { day: '周四', value: 55, lastWeek: 52 },
  { day: '周五', value: 48, lastWeek: 44 },
  { day: '周六', value: 68, lastWeek: 60 },
  { day: '周日', value: 75, lastWeek: 65 },
];

export const weeklyStoreData = ${JSON.stringify(weeklyStoreData, null, 2)};

export const inventoryDistribution = ${JSON.stringify(inventoryDistribution, null, 2)};

export const dashboardKpiData = ${JSON.stringify(kpiData, null, 2)};
`;

const buffer = Buffer.from(output, 'utf8');
fs.writeFileSync(path.join(__dirname, '../src/app/data/mockData.ts'), buffer);
console.log('数据已成功导入到 src/app/data/mockData.ts');
console.log('门店列表:', stores.map(s => `${s.rank}. ${s.name} - ${s.sales}`).join('\n'));
