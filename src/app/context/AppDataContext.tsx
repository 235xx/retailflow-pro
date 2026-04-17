import { createContext, useContext, useState, ReactNode } from 'react';
import { mockTopAlerts, mockReturnOrders } from '../data/mockData';

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
}

const AppDataContext = createContext<AppDataContextType>({
  alerts: [],
  addAlert: () => {},
  storeAlertCount: () => 0,
  reportedInboundItems: {},
  addReportedInboundItems: () => {},
  returnOrders: [],
  updateReturnOrderStatus: () => {},
});

let alertIdCounter = mockTopAlerts.length + 1;

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<AlertItem[]>(mockTopAlerts as AlertItem[]);
  const [reportedInboundItems, setReportedInboundItems] = useState<Record<string, Set<string>>>({});
  const [returnOrders, setReturnOrders] = useState<ReturnOrderState[]>(
    mockReturnOrders as ReturnOrderState[]
  );

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
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  return useContext(AppDataContext);
}
