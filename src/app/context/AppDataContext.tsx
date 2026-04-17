import { createContext, useContext, useState, ReactNode } from 'react';
import { mockTopAlerts, mockReturnOrders, mockInboundOrders, mockProducts } from '../data/mockData';

export interface AlertItem {
  id: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  store: string;
  status: string;
  storeId: string;
  productId: string;
  reportedAt?: string;
}

export interface ReturnOrderState {
  id: string;
  orderId: string;
  storeId: string;
  storeName: string;
  itemCount: number;
  status: 'Pending' | 'Completed';
  date: string;
  items: typeof mockReturnOrders[0]['items'];
}

export interface InboundOrderState {
  id: string;
  orderId: string;
  supplier: string;
  itemCount: number;
  status: 'Pending' | 'Partially Received' | 'Completed';
  hasAlert: boolean;
  date: string;
  items: typeof mockInboundOrders[0]['items'];
  priority?: 'high' | 'medium' | 'low';
  estimatedArrival?: string;
}

export interface ProductState {
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
  dailySales24h?: number;
}

interface AppDataContextType {
  alerts: AlertItem[];
  addAlert: (alert: Omit<AlertItem, 'id'>) => void;
  storeAlertCount: (storeId: string) => number;
  // reported inbound items: orderId → Set of reported itemIds
  reportedInboundItems: Record<string, Set<string>>;
  addReportedInboundItems: (orderId: string, itemIds: string[]) => void;
  // return orders
  returnOrders: ReturnOrderState[];
  updateReturnOrderStatus: (orderId: string, status: ReturnOrderState['status']) => void;
  // inbound orders
  inboundOrders: InboundOrderState[];
  updateInboundOrderStatus: (orderId: string, status: InboundOrderState['status']) => void;
  // products/inventory
  products: ProductState[];
  addToInventory: (sku: string, quantity: number) => void;
}

const AppDataContext = createContext<AppDataContextType>({
  alerts: [],
  addAlert: () => { },
  storeAlertCount: () => 0,
  reportedInboundItems: {},
  addReportedInboundItems: () => { },
  returnOrders: [],
  updateReturnOrderStatus: () => { },
  inboundOrders: [],
  updateInboundOrderStatus: () => { },
  products: [],
  addToInventory: () => { },
});

let alertIdCounter = mockTopAlerts.length + 1;

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<AlertItem[]>(mockTopAlerts as AlertItem[]);
  const [reportedInboundItems, setReportedInboundItems] = useState<Record<string, Set<string>>>({});
  const [returnOrders, setReturnOrders] = useState<ReturnOrderState[]>(
    mockReturnOrders as ReturnOrderState[]
  );
  const [inboundOrders, setInboundOrders] = useState<InboundOrderState[]>(
    mockInboundOrders as InboundOrderState[]
  );
  const [products, setProducts] = useState<ProductState[]>(mockProducts as ProductState[]);

  const addAlert = (alert: Omit<AlertItem, 'id'>) => {
    const newAlert: AlertItem = {
      ...alert,
      id: String(alertIdCounter++),
      reportedAt: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  const storeAlertCount = (storeId: string) =>
    alerts.filter(a => a.storeId === storeId).length;

  const addReportedInboundItems = (orderId: string, itemIds: string[]) => {
    setReportedInboundItems(prev => {
      const current = new Set(prev[orderId] ?? []);
      itemIds.forEach(id => current.add(id));
      return { ...prev, [orderId]: current };
    });
  };

  const updateReturnOrderStatus = (orderId: string, status: ReturnOrderState['status']) => {
    setReturnOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const updateInboundOrderStatus = (orderId: string, status: InboundOrderState['status']) => {
    setInboundOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const addToInventory = (sku: string, quantity: number) => {
    setProducts(prev =>
      prev.map(p =>
        p.sku === sku
          ? {
            ...p,
            currentStock: p.currentStock + quantity,
            status:
              p.currentStock + quantity <= p.safetyStock
                ? 'low'
                : p.currentStock + quantity <= 0
                  ? 'out'
                  : 'normal',
          }
          : p
      )
    );
  };

  return (
    <AppDataContext.Provider
      value={{
        alerts,
        addAlert,
        storeAlertCount,
        reportedInboundItems,
        addReportedInboundItems,
        returnOrders,
        updateReturnOrderStatus,
        inboundOrders,
        updateInboundOrderStatus,
        products,
        addToInventory,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  return useContext(AppDataContext);
}
