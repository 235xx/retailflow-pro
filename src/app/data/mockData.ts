export interface Alert {
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
  condition: 'Good' | 'Slightly Damaged' | 'Severely Damaged' | 'Expired';
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
  status: 'Pending Approval' | 'In Progress' | 'Completed' | 'Rejected';
  urgency: 'high' | 'medium' | 'low';
  requestedBy: string;
  requestedAt: string;
  reason: string;
}

export const mockAlerts: Alert[] = [
  {
    "id": "1",
    "productName": "Gold Infant Formula 900g",
    "location": "Causeway Bay",
    "currentStock": 8,
    "safetyStock": 20,
    "status": "URGENT",
    "severity": "high",
    "sku": "PROD-001",
    "category": "Baby Care",
    "dailySales": 15,
    "trend": 1
  },
  {
    "id": "2",
    "productName": "Baby Wipes 80 Sheets",
    "location": "Causeway Bay",
    "currentStock": 12,
    "safetyStock": 30,
    "status": "URGENT",
    "severity": "high",
    "sku": "PROD-003",
    "category": "Baby Care",
    "dailySales": 14,
    "trend": 69
  },
  {
    "id": "3",
    "productName": "Diet Coke 330ml*6",
    "location": "Causeway Bay",
    "currentStock": 3,
    "safetyStock": 20,
    "status": "URGENT",
    "severity": "high",
    "sku": "PROD-008",
    "category": "Beverages",
    "dailySales": 19,
    "trend": 71
  },
  {
    "id": "4",
    "productName": "Classic Potato Chips 160g",
    "location": "Causeway Bay",
    "currentStock": 5,
    "safetyStock": 25,
    "status": "URGENT",
    "severity": "high",
    "sku": "PROD-015",
    "category": "Snacks",
    "dailySales": 20,
    "trend": -18
  },
  {
    "id": "5",
    "productName": "Braised Beef Noodles 5pk",
    "location": "Causeway Bay",
    "currentStock": 18,
    "safetyStock": 20,
    "status": "LOW_STOCK",
    "severity": "medium",
    "sku": "PROD-018",
    "category": "Instant Food",
    "dailySales": 22,
    "trend": 37
  },
  {
    "id": "6",
    "productName": "Power Bank 20000mAh",
    "location": "Causeway Bay",
    "currentStock": 6,
    "safetyStock": 10,
    "status": "LOW_STOCK",
    "severity": "medium",
    "sku": "PROD-027",
    "category": "Electronics",
    "dailySales": 16,
    "trend": 15
  },
  {
    "id": "7",
    "productName": "Electric Toothbrush Heads 4pk",
    "location": "Causeway Bay",
    "currentStock": 9,
    "safetyStock": 12,
    "status": "LOW_STOCK",
    "severity": "medium",
    "sku": "PROD-030",
    "category": "Personal Care",
    "dailySales": 8,
    "trend": 4
  },
  {
    "id": "8",
    "productName": "Diapers XL 56pcs",
    "location": "Tsim Sha Tsui",
    "currentStock": 4,
    "safetyStock": 20,
    "status": "URGENT",
    "severity": "high",
    "sku": "PROD-004",
    "category": "Baby Care",
    "dailySales": 17,
    "trend": -10
  },
  {
    "id": "9",
    "productName": "Latte Coffee 270ml",
    "location": "Tsim Sha Tsui",
    "currentStock": 2,
    "safetyStock": 20,
    "status": "URGENT",
    "severity": "high",
    "sku": "PROD-011",
    "category": "Beverages",
    "dailySales": 13,
    "trend": 47
  },
  {
    "id": "10",
    "productName": "Mixed Nuts 200g",
    "location": "Tsim Sha Tsui",
    "currentStock": 7,
    "safetyStock": 20,
    "status": "URGENT",
    "severity": "high",
    "sku": "PROD-016",
    "category": "Snacks",
    "dailySales": 19,
    "trend": 60
  }
];

export const mockInboundOrders: InboundOrder[] = [
  {
    "id": "1",
    "orderId": "IN-20260412-001",
    "supplier": "Unilever",
    "itemCount": 1,
    "status": "Pending",
    "hasAlert": false,
    "date": "2026-04-12",
    "priority": "high",
    "estimatedArrival": "22:00:00",
    "items": [
      {
        "id": "1",
        "name": "Gold Infant Formula 900g",
        "sku": "PROD-001",
        "expected": 24,
        "actual": 22,
        "hasDiscrepancy": false
      }
    ]
  },
  {
    "id": "2",
    "orderId": "IN-20260412-002",
    "supplier": "Coca-Cola",
    "itemCount": 1,
    "status": "Pending",
    "hasAlert": false,
    "date": "2026-04-12",
    "priority": "high",
    "estimatedArrival": "22:29:59",
    "items": [
      {
        "id": "2",
        "name": "Diet Coke 330ml*6",
        "sku": "PROD-008",
        "expected": 48,
        "actual": 45,
        "hasDiscrepancy": false
      }
    ]
  },
  {
    "id": "3",
    "orderId": "IN-20260412-003",
    "supplier": "Kao",
    "itemCount": 1,
    "status": "Pending",
    "hasAlert": false,
    "date": "2026-04-12",
    "priority": "high",
    "estimatedArrival": "23:00:00",
    "items": [
      {
        "id": "3",
        "name": "Diapers XL 56pcs",
        "sku": "PROD-004",
        "expected": 36,
        "actual": 34,
        "hasDiscrepancy": false
      }
    ]
  },
  {
    "id": "4",
    "orderId": "IN-20260412-004",
    "supplier": "Starbucks",
    "itemCount": 1,
    "status": "Pending",
    "hasAlert": false,
    "date": "2026-04-12",
    "priority": "high",
    "estimatedArrival": "23:30:00",
    "items": [
      {
        "id": "4",
        "name": "Latte Coffee 270ml",
        "sku": "PROD-011",
        "expected": 60,
        "actual": 57,
        "hasDiscrepancy": false
      }
    ]
  },
  {
    "id": "5",
    "orderId": "IN-20260412-005",
    "supplier": "Huiyuan",
    "itemCount": 1,
    "status": "Pending",
    "hasAlert": false,
    "date": "2026-04-12",
    "priority": "high",
    "estimatedArrival": "23:59:59",
    "items": [
      {
        "id": "5",
        "name": "NFC Orange Juice 1L",
        "sku": "PROD-010",
        "expected": 40,
        "actual": 38,
        "hasDiscrepancy": false
      }
    ]
  },
  {
    "id": "6",
    "orderId": "IN-20260412-006",
    "supplier": "Shizu",
    "itemCount": 1,
    "status": "Pending",
    "hasAlert": false,
    "date": "2026-04-12",
    "priority": "high",
    "estimatedArrival": "00:30:00",
    "items": [
      {
        "id": "6",
        "name": "Hot & Sour Noodles 6pk",
        "sku": "PROD-019",
        "expected": 30,
        "actual": 28,
        "hasDiscrepancy": true
      }
    ]
  },
  {
    "id": "7",
    "orderId": "IN-20260412-007",
    "supplier": "Lay's",
    "itemCount": 1,
    "status": "Pending",
    "hasAlert": false,
    "date": "2026-04-12",
    "priority": "high",
    "estimatedArrival": "01:00:00",
    "items": [
      {
        "id": "7",
        "name": "Classic Potato Chips 160g",
        "sku": "PROD-015",
        "expected": 50,
        "actual": 47,
        "hasDiscrepancy": false
      }
    ]
  },
  {
    "id": "8",
    "orderId": "IN-20260411-001",
    "supplier": "Cotton Care",
    "itemCount": 1,
    "status": "Completed",
    "hasAlert": false,
    "date": "2026-04-11",
    "priority": "high",
    "estimatedArrival": "20:59:59",
    "items": [
      {
        "id": "8",
        "name": "Baby Wipes 80 Sheets",
        "sku": "PROD-003",
        "expected": 60,
        "actual": 60,
        "hasDiscrepancy": false
      }
    ]
  },
  {
    "id": "9",
    "orderId": "IN-20260411-002",
    "supplier": "Nongfu Spring",
    "itemCount": 1,
    "status": "Completed",
    "hasAlert": false,
    "date": "2026-04-11",
    "priority": "high",
    "estimatedArrival": "21:30:00",
    "items": [
      {
        "id": "9",
        "name": "Spring Water 550ml*12",
        "sku": "PROD-009",
        "expected": 80,
        "actual": 80,
        "hasDiscrepancy": true
      }
    ]
  },
  {
    "id": "10",
    "orderId": "IN-20260411-003",
    "supplier": "Swisse",
    "itemCount": 1,
    "status": "Completed",
    "hasAlert": false,
    "date": "2026-04-11",
    "priority": "high",
    "estimatedArrival": "22:00:00",
    "items": [
      {
        "id": "10",
        "name": "Milk Calcium Tablets 60ct",
        "sku": "PROD-005",
        "expected": 30,
        "actual": 30,
        "hasDiscrepancy": false
      }
    ]
  },
  {
    "id": "11",
    "orderId": "IN-20260411-004",
    "supplier": "TaoLi",
    "itemCount": 1,
    "status": "Completed",
    "hasAlert": false,
    "date": "2026-04-11",
    "priority": "medium",
    "estimatedArrival": "22:29:59",
    "items": [
      {
        "id": "11",
        "name": "Whole Wheat Toast 400g",
        "sku": "PROD-012",
        "expected": 20,
        "actual": 20,
        "hasDiscrepancy": false
      }
    ]
  },
  {
    "id": "12",
    "orderId": "IN-20260411-005",
    "supplier": "Mankattan",
    "itemCount": 1,
    "status": "Completed",
    "hasAlert": false,
    "date": "2026-04-11",
    "priority": "medium",
    "estimatedArrival": "23:00:00",
    "items": [
      {
        "id": "12",
        "name": "Fresh Milk Brioche 300g",
        "sku": "PROD-014",
        "expected": 18,
        "actual": 18,
        "hasDiscrepancy": true
      }
    ]
  },
  {
    "id": "13",
    "orderId": "IN-20260411-006",
    "supplier": "Royal Canin",
    "itemCount": 1,
    "status": "Completed",
    "hasAlert": false,
    "date": "2026-04-11",
    "priority": "medium",
    "estimatedArrival": "23:30:00",
    "items": [
      {
        "id": "13",
        "name": "Dry Dog Food 2kg",
        "sku": "PROD-024",
        "expected": 12,
        "actual": 12,
        "hasDiscrepancy": false
      }
    ]
  },
  {
    "id": "14",
    "orderId": "IN-20260410-001",
    "supplier": "Master Kong",
    "itemCount": 1,
    "status": "Completed",
    "hasAlert": false,
    "date": "2026-04-10",
    "priority": "medium",
    "estimatedArrival": "20:00:00",
    "items": [
      {
        "id": "14",
        "name": "Braised Beef Noodles 5pk",
        "sku": "PROD-018",
        "expected": 40,
        "actual": 40,
        "hasDiscrepancy": true
      }
    ]
  },
  {
    "id": "15",
    "orderId": "IN-20260410-002",
    "supplier": "Liby",
    "itemCount": 1,
    "status": "Completed",
    "hasAlert": false,
    "date": "2026-04-10",
    "priority": "medium",
    "estimatedArrival": "20:59:59",
    "items": [
      {
        "id": "15",
        "name": "Dishwashing Liquid 1.5kg",
        "sku": "PROD-022",
        "expected": 25,
        "actual": 25,
        "hasDiscrepancy": true
      }
    ]
  },
  {
    "id": "16",
    "orderId": "IN-20260410-003",
    "supplier": "Whiskas",
    "itemCount": 1,
    "status": "Completed",
    "hasAlert": false,
    "date": "2026-04-10",
    "priority": "medium",
    "estimatedArrival": "22:00:00",
    "items": [
      {
        "id": "16",
        "name": "Cat Wet Food 85g*6",
        "sku": "PROD-025",
        "expected": 36,
        "actual": 36,
        "hasDiscrepancy": true
      }
    ]
  },
  {
    "id": "17",
    "orderId": "IN-20260413-001",
    "supplier": "Heinz",
    "itemCount": 1,
    "status": "Pending",
    "hasAlert": false,
    "date": "2026-04-13",
    "priority": "medium",
    "estimatedArrival": "22:00:00",
    "items": [
      {
        "id": "17",
        "name": "Organic Rice Cereal 350g",
        "sku": "PROD-002",
        "expected": 30,
        "actual": 28,
        "hasDiscrepancy": false
      }
    ]
  },
  {
    "id": "18",
    "orderId": "IN-20260413-002",
    "supplier": "Redoxon",
    "itemCount": 1,
    "status": "Pending",
    "hasAlert": false,
    "date": "2026-04-13",
    "priority": "medium",
    "estimatedArrival": "22:29:59",
    "items": [
      {
        "id": "18",
        "name": "Vitamin C Effervescent 20ct",
        "sku": "PROD-006",
        "expected": 40,
        "actual": 38,
        "hasDiscrepancy": true
      }
    ]
  },
  {
    "id": "19",
    "orderId": "IN-20260413-003",
    "supplier": "Three Squirrels",
    "itemCount": 1,
    "status": "Pending",
    "hasAlert": false,
    "date": "2026-04-13",
    "priority": "medium",
    "estimatedArrival": "23:00:00",
    "items": [
      {
        "id": "19",
        "name": "Mixed Nuts 200g",
        "sku": "PROD-016",
        "expected": 50,
        "actual": 47,
        "hasDiscrepancy": false
      }
    ]
  },
  {
    "id": "20",
    "orderId": "IN-20260413-004",
    "supplier": "Blackmores",
    "itemCount": 1,
    "status": "Pending",
    "hasAlert": false,
    "date": "2026-04-13",
    "priority": "medium",
    "estimatedArrival": "23:30:00",
    "items": [
      {
        "id": "20",
        "name": "Deep Sea Fish Oil 200ct",
        "sku": "PROD-007",
        "expected": 20,
        "actual": 19,
        "hasDiscrepancy": false
      }
    ]
  },
  {
    "id": "21",
    "orderId": "IN-20260413-005",
    "supplier": "Dove",
    "itemCount": 1,
    "status": "Pending",
    "hasAlert": false,
    "date": "2026-04-13",
    "priority": "low",
    "estimatedArrival": "23:59:59",
    "items": [
      {
        "id": "21",
        "name": "Dark Chocolate 100g",
        "sku": "PROD-017",
        "expected": 35,
        "actual": 33,
        "hasDiscrepancy": true
      }
    ]
  },
  {
    "id": "22",
    "orderId": "IN-20260413-007",
    "supplier": "Vinda",
    "itemCount": 1,
    "status": "Pending",
    "hasAlert": false,
    "date": "2026-04-13",
    "priority": "low",
    "estimatedArrival": "01:00:00",
    "items": [
      {
        "id": "22",
        "name": "Kitchen Paper Towel 3 Rolls",
        "sku": "PROD-021",
        "expected": 20,
        "actual": 19,
        "hasDiscrepancy": true
      }
    ]
  },
  {
    "id": "23",
    "orderId": "IN-20260413-008",
    "supplier": "Haidilao",
    "itemCount": 1,
    "status": "Pending",
    "hasAlert": false,
    "date": "2026-04-13",
    "priority": "low",
    "estimatedArrival": "01:29:59",
    "items": [
      {
        "id": "23",
        "name": "Self-heating Rice 3pk",
        "sku": "PROD-020",
        "expected": 25,
        "actual": 23,
        "hasDiscrepancy": false
      }
    ]
  },
  {
    "id": "24",
    "orderId": "IN-20260413-009",
    "supplier": "pidan",
    "itemCount": 1,
    "status": "Pending",
    "hasAlert": false,
    "date": "2026-04-13",
    "priority": "low",
    "estimatedArrival": "02:00:00",
    "items": [
      {
        "id": "24",
        "name": "Tofu Cat Litter 6L",
        "sku": "PROD-026",
        "expected": 15,
        "actual": 14,
        "hasDiscrepancy": true
      }
    ]
  }
];

export const mockReturnOrders: ReturnOrder[] = [
  {
    "id": "1",
    "orderId": "IN-20260412-008",
    "storeId": "1",
    "storeName": "Causeway Bay",
    "itemCount": 1,
    "status": "Pending",
    "date": "2026-04-12",
    "items": [
      {
        "id": "1",
        "name": "Power Bank 20000mAh",
        "sku": "PROD-027",
        "quantity": 2,
        "reason": "packaging_damaged",
        "condition": "slightly_damaged"
      }
    ]
  },
  {
    "id": "2",
    "orderId": "IN-20260412-009",
    "storeId": "2",
    "storeName": "Tsim Sha Tsui",
    "itemCount": 1,
    "status": "Pending",
    "date": "2026-04-12",
    "items": [
      {
        "id": "2",
        "name": "TWS Earbuds",
        "sku": "PROD-029",
        "quantity": 1,
        "reason": "quality_issue",
        "condition": "severely_damaged"
      }
    ]
  },
  {
    "id": "3",
    "orderId": "IN-20260411-007",
    "storeId": "3",
    "storeName": "Mong Kok",
    "itemCount": 1,
    "status": "Completed",
    "date": "2026-04-11",
    "items": [
      {
        "id": "3",
        "name": "Hokkaido Milk Roll 200g",
        "sku": "PROD-013",
        "quantity": 3,
        "reason": "expired",
        "condition": "expired"
      }
    ]
  },
  {
    "id": "4",
    "orderId": "IN-20260410-004",
    "storeId": "1",
    "storeName": "Causeway Bay",
    "itemCount": 1,
    "status": "Completed",
    "date": "2026-04-10",
    "items": [
      {
        "id": "4",
        "name": "Electric Toothbrush Heads 4pk",
        "sku": "PROD-030",
        "quantity": 2,
        "reason": "customer_return",
        "condition": "good"
      }
    ]
  },
  {
    "id": "5",
    "orderId": "IN-20260413-006",
    "storeId": "2",
    "storeName": "Tsim Sha Tsui",
    "itemCount": 1,
    "status": "Pending",
    "date": "2026-04-13",
    "items": [
      {
        "id": "5",
        "name": "Type-C Cable 1.5m",
        "sku": "PROD-028",
        "quantity": 4,
        "reason": "shipping_damage",
        "condition": "slightly_damaged"
      }
    ]
  },
  {
    "id": "6",
    "orderId": "IN-20260413-010",
    "storeId": "1",
    "storeName": "Causeway Bay",
    "itemCount": 1,
    "status": "Pending",
    "date": "2026-04-13",
    "items": [
      {
        "id": "6",
        "name": "Laundry Pods 50ct",
        "sku": "PROD-023",
        "quantity": 1,
        "reason": "other",
        "condition": "severely_damaged"
      }
    ]
  }
];

export const mockStores: Store[] = [
  {
    "id": "1",
    "name": "Causeway Bay",
    "sales": 411570,
    "rank": 1,
    "stockHealth": 86,
    "alerts": 7,
    "manager": "David Chen",
    "address": "Causeway Bay, Hong Kong"
  },
  {
    "id": "2",
    "name": "Tsim Sha Tsui",
    "sales": 207311,
    "rank": 2,
    "stockHealth": 87,
    "alerts": 3,
    "manager": "Emily Wong",
    "address": "Tsim Sha Tsui, Hong Kong"
  },
  {
    "id": "3",
    "name": "Mong Kok",
    "sales": 179933,
    "rank": 3,
    "stockHealth": 95,
    "alerts": 0,
    "manager": "Michael Lee",
    "address": "Mong Kok, Hong Kong"
  }
];

export const mockProducts: Product[] = [
  {
    "id": "1",
    "name": "Gold Infant Formula 900g",
    "sku": "PROD-001",
    "storeName": "Causeway Bay",
    "category": "Baby Care",
    "currentStock": 8,
    "safetyStock": 20,
    "maxStock": 60,
    "price": 42,
    "storeId": "3",
    "status": "low",
    "dailySales24h": 17,
    "salesHistory": [
      {
        "date": "04-10",
        "sales": 6
      },
      {
        "date": "04-11",
        "sales": 9
      },
      {
        "date": "04-12",
        "sales": 12
      },
      {
        "date": "04-13",
        "sales": 6
      },
      {
        "date": "04-14",
        "sales": 6
      },
      {
        "date": "04-15",
        "sales": 8
      },
      {
        "date": "04-16",
        "sales": 5
      }
    ],
    "priceHistory": [
      {
        "date": "04-10",
        "price": 38
      },
      {
        "date": "04-11",
        "price": 44
      },
      {
        "date": "04-12",
        "price": 42
      },
      {
        "date": "04-13",
        "price": 43
      },
      {
        "date": "04-14",
        "price": 44
      },
      {
        "date": "04-15",
        "price": 37
      },
      {
        "date": "04-16",
        "price": 40
      }
    ]
  },
  {
    "id": "2",
    "name": "Organic Rice Cereal 350g",
    "sku": "PROD-002",
    "storeName": "Causeway Bay",
    "category": "Baby Care",
    "currentStock": 25,
    "safetyStock": 15,
    "maxStock": 50,
    "price": 52,
    "storeId": "3",
    "status": "normal",
    "dailySales24h": 11,
    "salesHistory": [
      {
        "date": "04-10",
        "sales": 13
      },
      {
        "date": "04-11",
        "sales": 11
      },
      {
        "date": "04-12",
        "sales": 22
      },
      {
        "date": "04-13",
        "sales": 16
      },
      {
        "date": "04-14",
        "sales": 7
      },
      {
        "date": "04-15",
        "sales": 14
      },
      {
        "date": "04-16",
        "sales": 22
      }
    ],
    "priceHistory": [
      {
        "date": "04-10",
        "price": 49
      },
      {
        "date": "04-11",
        "price": 53
      },
      {
        "date": "04-12",
        "price": 48
      },
      {
        "date": "04-13",
        "price": 56
      },
      {
        "date": "04-14",
        "price": 50
      },
      {
        "date": "04-15",
        "price": 56
      },
      {
        "date": "04-16",
        "price": 47
      }
    ]
  },
  {
    "id": "3",
    "name": "Baby Wipes 80 Sheets",
    "sku": "PROD-003",
    "storeName": "Causeway Bay",
    "category": "Baby Care",
    "currentStock": 12,
    "safetyStock": 30,
    "maxStock": 100,
    "price": 16,
    "storeId": "3",
    "status": "low",
    "dailySales24h": 6,
    "salesHistory": [
      {
        "date": "04-10",
        "sales": 12
      },
      {
        "date": "04-11",
        "sales": 22
      },
      {
        "date": "04-12",
        "sales": 19
      },
      {
        "date": "04-13",
        "sales": 9
      },
      {
        "date": "04-14",
        "sales": 5
      },
      {
        "date": "04-15",
        "sales": 14
      },
      {
        "date": "04-16",
        "sales": 22
      }
    ],
    "priceHistory": [
      {
        "date": "04-10",
        "price": 15
      },
      {
        "date": "04-11",
        "price": 12
      },
      {
        "date": "04-12",
        "price": 18
      },
      {
        "date": "04-13",
        "price": 19
      },
      {
        "date": "04-14",
        "price": 12
      },
      {
        "date": "04-15",
        "price": 18
      },
      {
        "date": "04-16",
        "price": 20
      }
    ]
  },
  {
    "id": "4",
    "name": "Diapers XL 56pcs",
    "sku": "PROD-004",
    "storeName": "Tsim Sha Tsui",
    "category": "Baby Care",
    "currentStock": 4,
    "safetyStock": 20,
    "maxStock": 60,
    "price": 176,
    "storeId": "1",
    "status": "low",
    "dailySales24h": 17,
    "salesHistory": [
      {
        "date": "04-10",
        "sales": 14
      },
      {
        "date": "04-11",
        "sales": 20
      },
      {
        "date": "04-12",
        "sales": 22
      },
      {
        "date": "04-13",
        "sales": 21
      },
      {
        "date": "04-14",
        "sales": 16
      },
      {
        "date": "04-15",
        "sales": 19
      },
      {
        "date": "04-16",
        "sales": 19
      }
    ],
    "priceHistory": [
      {
        "date": "04-10",
        "price": 178
      },
      {
        "date": "04-11",
        "price": 177
      },
      {
        "date": "04-12",
        "price": 175
      },
      {
        "date": "04-13",
        "price": 177
      },
      {
        "date": "04-14",
        "price": 174
      },
      {
        "date": "04-15",
        "price": 172
      },
      {
        "date": "04-16",
        "price": 180
      }
    ]
  },
  {
    "id": "5",
    "name": "Milk Calcium Tablets 60ct",
    "sku": "PROD-005",
    "storeName": "Tsim Sha Tsui",
    "category": "Supplements",
    "currentStock": 28,
    "safetyStock": 15,
    "maxStock": 50,
    "price": 85,
    "storeId": "1",
    "status": "normal",
    "dailySales24h": 15,
    "salesHistory": [
      {
        "date": "04-10",
        "sales": 12
      },
      {
        "date": "04-11",
        "sales": 7
      },
      {
        "date": "04-12",
        "sales": 17
      },
      {
        "date": "04-13",
        "sales": 7
      },
      {
        "date": "04-14",
        "sales": 7
      },
      {
        "date": "04-15",
        "sales": 16
      },
      {
        "date": "04-16",
        "sales": 21
      }
    ],
    "priceHistory": [
      {
        "date": "04-10",
        "price": 89
      },
      {
        "date": "04-11",
        "price": 84
      },
      {
        "date": "04-12",
        "price": 80
      },
      {
        "date": "04-13",
        "price": 87
      },
      {
        "date": "04-14",
        "price": 80
      },
      {
        "date": "04-15",
        "price": 86
      },
      {
        "date": "04-16",
        "price": 82
      }
    ]
  },
  {
    "id": "6",
    "name": "Vitamin C Effervescent 20ct",
    "sku": "PROD-006",
    "storeName": "Tsim Sha Tsui",
    "category": "Supplements",
    "currentStock": 19,
    "safetyStock": 15,
    "maxStock": 50,
    "price": 204,
    "storeId": "1",
    "status": "normal",
    "dailySales24h": 16,
    "salesHistory": [
      {
        "date": "04-10",
        "sales": 23
      },
      {
        "date": "04-11",
        "sales": 12
      },
      {
        "date": "04-12",
        "sales": 22
      },
      {
        "date": "04-13",
        "sales": 8
      },
      {
        "date": "04-14",
        "sales": 6
      },
      {
        "date": "04-15",
        "sales": 18
      },
      {
        "date": "04-16",
        "sales": 18
      }
    ],
    "priceHistory": [
      {
        "date": "04-10",
        "price": 204
      },
      {
        "date": "04-11",
        "price": 208
      },
      {
        "date": "04-12",
        "price": 201
      },
      {
        "date": "04-13",
        "price": 200
      },
      {
        "date": "04-14",
        "price": 204
      },
      {
        "date": "04-15",
        "price": 199
      },
      {
        "date": "04-16",
        "price": 208
      }
    ]
  },
  {
    "id": "7",
    "name": "Deep Sea Fish Oil 200ct",
    "sku": "PROD-007",
    "storeName": "Mong Kok",
    "category": "Supplements",
    "currentStock": 9,
    "safetyStock": 15,
    "maxStock": 50,
    "price": 42,
    "storeId": "2",
    "status": "low",
    "dailySales24h": 8,
    "salesHistory": [
      {
        "date": "04-10",
        "sales": 5
      },
      {
        "date": "04-11",
        "sales": 20
      },
      {
        "date": "04-12",
        "sales": 24
      },
      {
        "date": "04-13",
        "sales": 6
      },
      {
        "date": "04-14",
        "sales": 12
      },
      {
        "date": "04-15",
        "sales": 18
      },
      {
        "date": "04-16",
        "sales": 13
      }
    ],
    "priceHistory": [
      {
        "date": "04-10",
        "price": 38
      },
      {
        "date": "04-11",
        "price": 45
      },
      {
        "date": "04-12",
        "price": 39
      },
      {
        "date": "04-13",
        "price": 43
      },
      {
        "date": "04-14",
        "price": 41
      },
      {
        "date": "04-15",
        "price": 43
      },
      {
        "date": "04-16",
        "price": 37
      }
    ]
  },
  {
    "id": "8",
    "name": "Diet Coke 330ml*6",
    "sku": "PROD-008",
    "storeName": "Causeway Bay",
    "category": "Beverages",
    "currentStock": 3,
    "safetyStock": 20,
    "maxStock": 80,
    "price": 160,
    "storeId": "3",
    "status": "low",
    "dailySales24h": 10,
    "salesHistory": [
      {
        "date": "04-10",
        "sales": 11
      },
      {
        "date": "04-11",
        "sales": 13
      },
      {
        "date": "04-12",
        "sales": 12
      },
      {
        "date": "04-13",
        "sales": 24
      },
      {
        "date": "04-14",
        "sales": 12
      },
      {
        "date": "04-15",
        "sales": 21
      },
      {
        "date": "04-16",
        "sales": 16
      }
    ],
    "priceHistory": [
      {
        "date": "04-10",
        "price": 157
      },
      {
        "date": "04-11",
        "price": 163
      },
      {
        "date": "04-12",
        "price": 160
      },
      {
        "date": "04-13",
        "price": 164
      },
      {
        "date": "04-14",
        "price": 161
      },
      {
        "date": "04-15",
        "price": 161
      },
      {
        "date": "04-16",
        "price": 157
      }
    ]
  },
  {
    "id": "9",
    "name": "Spring Water 550ml*12",
    "sku": "PROD-009",
    "storeName": "Causeway Bay",
    "category": "Beverages",
    "currentStock": 45,
    "safetyStock": 30,
    "maxStock": 120,
    "price": 12,
    "storeId": "3",
    "status": "normal",
    "dailySales24h": 10,
    "salesHistory": [
      {
        "date": "04-10",
        "sales": 23
      },
      {
        "date": "04-11",
        "sales": 5
      },
      {
        "date": "04-12",
        "sales": 23
      },
      {
        "date": "04-13",
        "sales": 12
      },
      {
        "date": "04-14",
        "sales": 16
      },
      {
        "date": "04-15",
        "sales": 17
      },
      {
        "date": "04-16",
        "sales": 16
      }
    ],
    "priceHistory": [
      {
        "date": "04-10",
        "price": 14
      },
      {
        "date": "04-11",
        "price": 12
      },
      {
        "date": "04-12",
        "price": 12
      },
      {
        "date": "04-13",
        "price": 9
      },
      {
        "date": "04-14",
        "price": 12
      },
      {
        "date": "04-15",
        "price": 15
      },
      {
        "date": "04-16",
        "price": 12
      }
    ]
  },
  {
    "id": "10",
    "name": "NFC Orange Juice 1L",
    "sku": "PROD-010",
    "storeName": "Mong Kok",
    "category": "Beverages",
    "currentStock": 1,
    "safetyStock": 15,
    "maxStock": 50,
    "price": 68,
    "storeId": "2",
    "status": "low",
    "dailySales24h": 10,
    "salesHistory": [
      {
        "date": "04-10",
        "sales": 20
      },
      {
        "date": "04-11",
        "sales": 19
      },
      {
        "date": "04-12",
        "sales": 15
      },
      {
        "date": "04-13",
        "sales": 22
      },
      {
        "date": "04-14",
        "sales": 14
      },
      {
        "date": "04-15",
        "sales": 19
      },
      {
        "date": "04-16",
        "sales": 14
      }
    ],
    "priceHistory": [
      {
        "date": "04-10",
        "price": 67
      },
      {
        "date": "04-11",
        "price": 68
      },
      {
        "date": "04-12",
        "price": 67
      },
      {
        "date": "04-13",
        "price": 71
      },
      {
        "date": "04-14",
        "price": 71
      },
      {
        "date": "04-15",
        "price": 68
      },
      {
        "date": "04-16",
        "price": 66
      }
    ]
  },
  {
    "id": "11",
    "name": "Latte Coffee 270ml",
    "sku": "PROD-011",
    "storeName": "Tsim Sha Tsui",
    "category": "Beverages",
    "currentStock": 2,
    "safetyStock": 20,
    "maxStock": 60,
    "price": 131,
    "storeId": "1",
    "status": "low",
    "dailySales24h": 11,
    "salesHistory": [
      {
        "date": "04-10",
        "sales": 23
      },
      {
        "date": "04-11",
        "sales": 22
      },
      {
        "date": "04-12",
        "sales": 22
      },
      {
        "date": "04-13",
        "sales": 13
      },
      {
        "date": "04-14",
        "sales": 24
      },
      {
        "date": "04-15",
        "sales": 7
      },
      {
        "date": "04-16",
        "sales": 16
      }
    ],
    "priceHistory": [
      {
        "date": "04-10",
        "price": 127
      },
      {
        "date": "04-11",
        "price": 132
      },
      {
        "date": "04-12",
        "price": 131
      },
      {
        "date": "04-13",
        "price": 133
      },
      {
        "date": "04-14",
        "price": 132
      },
      {
        "date": "04-15",
        "price": 126
      },
      {
        "date": "04-16",
        "price": 127
      }
    ]
  },
  {
    "id": "12",
    "name": "Whole Wheat Toast 400g",
    "sku": "PROD-012",
    "storeName": "Tsim Sha Tsui",
    "category": "Bakery",
    "currentStock": 14,
    "safetyStock": 10,
    "maxStock": 30,
    "price": 117,
    "storeId": "1",
    "status": "normal",
    "dailySales24h": 7,
    "salesHistory": [
      {
        "date": "04-10",
        "sales": 10
      },
      {
        "date": "04-11",
        "sales": 7
      },
      {
        "date": "04-12",
        "sales": 7
      },
      {
        "date": "04-13",
        "sales": 8
      },
      {
        "date": "04-14",
        "sales": 5
      },
      {
        "date": "04-15",
        "sales": 12
      },
      {
        "date": "04-16",
        "sales": 16
      }
    ],
    "priceHistory": [
      {
        "date": "04-10",
        "price": 116
      },
      {
        "date": "04-11",
        "price": 120
      },
      {
        "date": "04-12",
        "price": 119
      },
      {
        "date": "04-13",
        "price": 114
      },
      {
        "date": "04-14",
        "price": 116
      },
      {
        "date": "04-15",
        "price": 119
      },
      {
        "date": "04-16",
        "price": 116
      }
    ]
  },
  {
    "id": "13",
    "name": "Hokkaido Milk Roll 200g",
    "sku": "PROD-013",
    "storeName": "Mong Kok",
    "category": "Bakery",
    "currentStock": 6,
    "safetyStock": 10,
    "maxStock": 30,
    "price": 43,
    "storeId": "2",
    "status": "low",
    "dailySales24h": 15,
    "salesHistory": [
      {
        "date": "04-10",
        "sales": 16
      },
      {
        "date": "04-11",
        "sales": 12
      },
      {
        "date": "04-12",
        "sales": 7
      },
      {
        "date": "04-13",
        "sales": 15
      },
      {
        "date": "04-14",
        "sales": 21
      },
      {
        "date": "04-15",
        "sales": 23
      },
      {
        "date": "04-16",
        "sales": 24
      }
    ],
    "priceHistory": [
      {
        "date": "04-10",
        "price": 38
      },
      {
        "date": "04-11",
        "price": 39
      },
      {
        "date": "04-12",
        "price": 43
      },
      {
        "date": "04-13",
        "price": 45
      },
      {
        "date": "04-14",
        "price": 40
      },
      {
        "date": "04-15",
        "price": 42
      },
      {
        "date": "04-16",
        "price": 39
      }
    ]
  },
  {
    "id": "14",
    "name": "Fresh Milk Brioche 300g",
    "sku": "PROD-014",
    "storeName": "Mong Kok",
    "category": "Bakery",
    "currentStock": 17,
    "safetyStock": 10,
    "maxStock": 30,
    "price": 80,
    "storeId": "2",
    "status": "normal",
    "dailySales24h": 11,
    "salesHistory": [
      {
        "date": "04-10",
        "sales": 13
      },
      {
        "date": "04-11",
        "sales": 9
      },
      {
        "date": "04-12",
        "sales": 6
      },
      {
        "date": "04-13",
        "sales": 22
      },
      {
        "date": "04-14",
        "sales": 5
      },
      {
        "date": "04-15",
        "sales": 6
      },
      {
        "date": "04-16",
        "sales": 18
      }
    ],
    "priceHistory": [
      {
        "date": "04-10",
        "price": 75
      },
      {
        "date": "04-11",
        "price": 78
      },
      {
        "date": "04-12",
        "price": 79
      },
      {
        "date": "04-13",
        "price": 84
      },
      {
        "date": "04-14",
        "price": 82
      },
      {
        "date": "04-15",
        "price": 78
      },
      {
        "date": "04-16",
        "price": 81
      }
    ]
  },
  {
    "id": "15",
    "name": "Classic Potato Chips 160g",
    "sku": "PROD-015",
    "storeName": "Causeway Bay",
    "category": "Snacks",
    "currentStock": 5,
    "safetyStock": 25,
    "maxStock": 80,
    "price": 161,
    "storeId": "3",
    "status": "low",
    "dailySales24h": 14,
    "salesHistory": [
      {
        "date": "04-10",
        "sales": 17
      },
      {
        "date": "04-11",
        "sales": 24
      },
      {
        "date": "04-12",
        "sales": 10
      },
      {
        "date": "04-13",
        "sales": 12
      },
      {
        "date": "04-14",
        "sales": 18
      },
      {
        "date": "04-15",
        "sales": 7
      },
      {
        "date": "04-16",
        "sales": 11
      }
    ],
    "priceHistory": [
      {
        "date": "04-10",
        "price": 158
      },
      {
        "date": "04-11",
        "price": 164
      },
      {
        "date": "04-12",
        "price": 160
      },
      {
        "date": "04-13",
        "price": 162
      },
      {
        "date": "04-14",
        "price": 164
      },
      {
        "date": "04-15",
        "price": 163
      },
      {
        "date": "04-16",
        "price": 156
      }
    ]
  },
  {
    "id": "16",
    "name": "Mixed Nuts 200g",
    "sku": "PROD-016",
    "storeName": "Tsim Sha Tsui",
    "category": "Snacks",
    "currentStock": 7,
    "safetyStock": 20,
    "maxStock": 60,
    "price": 130,
    "storeId": "1",
    "status": "low",
    "dailySales24h": 17,
    "salesHistory": [
      {
        "date": "04-10",
        "sales": 11
      },
      {
        "date": "04-11",
        "sales": 19
      },
      {
        "date": "04-12",
        "sales": 11
      },
      {
        "date": "04-13",
        "sales": 13
      },
      {
        "date": "04-14",
        "sales": 7
      },
      {
        "date": "04-15",
        "sales": 6
      },
      {
        "date": "04-16",
        "sales": 21
      }
    ],
    "priceHistory": [
      {
        "date": "04-10",
        "price": 126
      },
      {
        "date": "04-11",
        "price": 130
      },
      {
        "date": "04-12",
        "price": 132
      },
      {
        "date": "04-13",
        "price": 127
      },
      {
        "date": "04-14",
        "price": 126
      },
      {
        "date": "04-15",
        "price": 134
      },
      {
        "date": "04-16",
        "price": 129
      }
    ]
  },
  {
    "id": "17",
    "name": "Dark Chocolate 100g",
    "sku": "PROD-017",
    "storeName": "Mong Kok",
    "category": "Snacks",
    "currentStock": 24,
    "safetyStock": 15,
    "maxStock": 50,
    "price": 90,
    "storeId": "2",
    "status": "normal",
    "dailySales24h": 13,
    "salesHistory": [
      {
        "date": "04-10",
        "sales": 9
      },
      {
        "date": "04-11",
        "sales": 13
      },
      {
        "date": "04-12",
        "sales": 22
      },
      {
        "date": "04-13",
        "sales": 24
      },
      {
        "date": "04-14",
        "sales": 6
      },
      {
        "date": "04-15",
        "sales": 11
      },
      {
        "date": "04-16",
        "sales": 7
      }
    ],
    "priceHistory": [
      {
        "date": "04-10",
        "price": 92
      },
      {
        "date": "04-11",
        "price": 89
      },
      {
        "date": "04-12",
        "price": 89
      },
      {
        "date": "04-13",
        "price": 94
      },
      {
        "date": "04-14",
        "price": 91
      },
      {
        "date": "04-15",
        "price": 86
      },
      {
        "date": "04-16",
        "price": 86
      }
    ]
  },
  {
    "id": "18",
    "name": "Braised Beef Noodles 5pk",
    "sku": "PROD-018",
    "storeName": "Causeway Bay",
    "category": "Instant Food",
    "currentStock": 18,
    "safetyStock": 20,
    "maxStock": 60,
    "price": 181,
    "storeId": "3",
    "status": "low",
    "dailySales24h": 15,
    "salesHistory": [
      {
        "date": "04-10",
        "sales": 9
      },
      {
        "date": "04-11",
        "sales": 23
      },
      {
        "date": "04-12",
        "sales": 22
      },
      {
        "date": "04-13",
        "sales": 7
      },
      {
        "date": "04-14",
        "sales": 24
      },
      {
        "date": "04-15",
        "sales": 18
      },
      {
        "date": "04-16",
        "sales": 9
      }
    ],
    "priceHistory": [
      {
        "date": "04-10",
        "price": 182
      },
      {
        "date": "04-11",
        "price": 177
      },
      {
        "date": "04-12",
        "price": 180
      },
      {
        "date": "04-13",
        "price": 176
      },
      {
        "date": "04-14",
        "price": 176
      },
      {
        "date": "04-15",
        "price": 184
      },
      {
        "date": "04-16",
        "price": 181
      }
    ]
  },
  {
    "id": "19",
    "name": "Hot & Sour Noodles 6pk",
    "sku": "PROD-019",
    "storeName": "Mong Kok",
    "category": "Instant Food",
    "currentStock": 3,
    "safetyStock": 15,
    "maxStock": 50,
    "price": 33,
    "storeId": "2",
    "status": "low",
    "dailySales24h": 13,
    "salesHistory": [
      {
        "date": "04-10",
        "sales": 24
      },
      {
        "date": "04-11",
        "sales": 15
      },
      {
        "date": "04-12",
        "sales": 24
      },
      {
        "date": "04-13",
        "sales": 7
      },
      {
        "date": "04-14",
        "sales": 19
      },
      {
        "date": "04-15",
        "sales": 9
      },
      {
        "date": "04-16",
        "sales": 10
      }
    ],
    "priceHistory": [
      {
        "date": "04-10",
        "price": 30
      },
      {
        "date": "04-11",
        "price": 36
      },
      {
        "date": "04-12",
        "price": 33
      },
      {
        "date": "04-13",
        "price": 34
      },
      {
        "date": "04-14",
        "price": 34
      },
      {
        "date": "04-15",
        "price": 32
      },
      {
        "date": "04-16",
        "price": 37
      }
    ]
  },
  {
    "id": "20",
    "name": "Self-heating Rice 3pk",
    "sku": "PROD-020",
    "storeName": "Mong Kok",
    "category": "Instant Food",
    "currentStock": 20,
    "safetyStock": 15,
    "maxStock": 50,
    "price": 124,
    "storeId": "2",
    "status": "normal",
    "dailySales24h": 17,
    "salesHistory": [
      {
        "date": "04-10",
        "sales": 18
      },
      {
        "date": "04-11",
        "sales": 24
      },
      {
        "date": "04-12",
        "sales": 18
      },
      {
        "date": "04-13",
        "sales": 8
      },
      {
        "date": "04-14",
        "sales": 11
      },
      {
        "date": "04-15",
        "sales": 22
      },
      {
        "date": "04-16",
        "sales": 13
      }
    ],
    "priceHistory": [
      {
        "date": "04-10",
        "price": 127
      },
      {
        "date": "04-11",
        "price": 127
      },
      {
        "date": "04-12",
        "price": 119
      },
      {
        "date": "04-13",
        "price": 120
      },
      {
        "date": "04-14",
        "price": 122
      },
      {
        "date": "04-15",
        "price": 122
      },
      {
        "date": "04-16",
        "price": 125
      }
    ]
  },
  {
    "id": "21",
    "name": "Kitchen Paper Towel 3 Rolls",
    "sku": "PROD-021",
    "storeName": "Causeway Bay",
    "category": "Household",
    "currentStock": 22,
    "safetyStock": 15,
    "maxStock": 50,
    "price": 56,
    "storeId": "3",
    "status": "normal",
    "dailySales24h": 6,
    "salesHistory": [
      {
        "date": "04-10",
        "sales": 24
      },
      {
        "date": "04-11",
        "sales": 15
      },
      {
        "date": "04-12",
        "sales": 15
      },
      {
        "date": "04-13",
        "sales": 16
      },
      {
        "date": "04-14",
        "sales": 22
      },
      {
        "date": "04-15",
        "sales": 8
      },
      {
        "date": "04-16",
        "sales": 8
      }
    ],
    "priceHistory": [
      {
        "date": "04-10",
        "price": 58
      },
      {
        "date": "04-11",
        "price": 59
      },
      {
        "date": "04-12",
        "price": 57
      },
      {
        "date": "04-13",
        "price": 58
      },
      {
        "date": "04-14",
        "price": 57
      },
      {
        "date": "04-15",
        "price": 58
      },
      {
        "date": "04-16",
        "price": 51
      }
    ]
  },
  {
    "id": "22",
    "name": "Dishwashing Liquid 1.5kg",
    "sku": "PROD-022",
    "storeName": "Tsim Sha Tsui",
    "category": "Household",
    "currentStock": 33,
    "safetyStock": 20,
    "maxStock": 60,
    "price": 66,
    "storeId": "1",
    "status": "normal",
    "dailySales24h": 15,
    "salesHistory": [
      {
        "date": "04-10",
        "sales": 22
      },
      {
        "date": "04-11",
        "sales": 24
      },
      {
        "date": "04-12",
        "sales": 23
      },
      {
        "date": "04-13",
        "sales": 8
      },
      {
        "date": "04-14",
        "sales": 10
      },
      {
        "date": "04-15",
        "sales": 15
      },
      {
        "date": "04-16",
        "sales": 11
      }
    ],
    "priceHistory": [
      {
        "date": "04-10",
        "price": 62
      },
      {
        "date": "04-11",
        "price": 61
      },
      {
        "date": "04-12",
        "price": 64
      },
      {
        "date": "04-13",
        "price": 68
      },
      {
        "date": "04-14",
        "price": 70
      },
      {
        "date": "04-15",
        "price": 69
      },
      {
        "date": "04-16",
        "price": 69
      }
    ]
  },
  {
    "id": "23",
    "name": "Laundry Pods 50ct",
    "sku": "PROD-023",
    "storeName": "Causeway Bay",
    "category": "Household",
    "currentStock": 0,
    "safetyStock": 42,
    "maxStock": 84,
    "price": 25,
    "storeId": "3",
    "status": "out",
    "dailySales24h": 10,
    "salesHistory": [
      {
        "date": "04-10",
        "sales": 21
      },
      {
        "date": "04-11",
        "sales": 9
      },
      {
        "date": "04-12",
        "sales": 13
      },
      {
        "date": "04-13",
        "sales": 14
      },
      {
        "date": "04-14",
        "sales": 6
      },
      {
        "date": "04-15",
        "sales": 7
      },
      {
        "date": "04-16",
        "sales": 19
      }
    ],
    "priceHistory": [
      {
        "date": "04-10",
        "price": 29
      },
      {
        "date": "04-11",
        "price": 20
      },
      {
        "date": "04-12",
        "price": 21
      },
      {
        "date": "04-13",
        "price": 26
      },
      {
        "date": "04-14",
        "price": 29
      },
      {
        "date": "04-15",
        "price": 21
      },
      {
        "date": "04-16",
        "price": 28
      }
    ]
  },
  {
    "id": "24",
    "name": "Dry Dog Food 2kg",
    "sku": "PROD-024",
    "storeName": "Mong Kok",
    "category": "Pet Supplies",
    "currentStock": 8,
    "safetyStock": 10,
    "maxStock": 30,
    "price": 72,
    "storeId": "2",
    "status": "low",
    "dailySales24h": 7,
    "salesHistory": [
      {
        "date": "04-10",
        "sales": 19
      },
      {
        "date": "04-11",
        "sales": 16
      },
      {
        "date": "04-12",
        "sales": 9
      },
      {
        "date": "04-13",
        "sales": 20
      },
      {
        "date": "04-14",
        "sales": 15
      },
      {
        "date": "04-15",
        "sales": 14
      },
      {
        "date": "04-16",
        "sales": 8
      }
    ],
    "priceHistory": [
      {
        "date": "04-10",
        "price": 71
      },
      {
        "date": "04-11",
        "price": 67
      },
      {
        "date": "04-12",
        "price": 72
      },
      {
        "date": "04-13",
        "price": 72
      },
      {
        "date": "04-14",
        "price": 76
      },
      {
        "date": "04-15",
        "price": 70
      },
      {
        "date": "04-16",
        "price": 67
      }
    ]
  },
  {
    "id": "25",
    "name": "Cat Wet Food 85g*6",
    "sku": "PROD-025",
    "storeName": "Mong Kok",
    "category": "Pet Supplies",
    "currentStock": 12,
    "safetyStock": 15,
    "maxStock": 50,
    "price": 31,
    "storeId": "2",
    "status": "low",
    "dailySales24h": 8,
    "salesHistory": [
      {
        "date": "04-10",
        "sales": 9
      },
      {
        "date": "04-11",
        "sales": 8
      },
      {
        "date": "04-12",
        "sales": 22
      },
      {
        "date": "04-13",
        "sales": 15
      },
      {
        "date": "04-14",
        "sales": 22
      },
      {
        "date": "04-15",
        "sales": 17
      },
      {
        "date": "04-16",
        "sales": 16
      }
    ],
    "priceHistory": [
      {
        "date": "04-10",
        "price": 30
      },
      {
        "date": "04-11",
        "price": 26
      },
      {
        "date": "04-12",
        "price": 28
      },
      {
        "date": "04-13",
        "price": 27
      },
      {
        "date": "04-14",
        "price": 26
      },
      {
        "date": "04-15",
        "price": 30
      },
      {
        "date": "04-16",
        "price": 27
      }
    ]
  },
  {
    "id": "26",
    "name": "Tofu Cat Litter 6L",
    "sku": "PROD-026",
    "storeName": "Causeway Bay",
    "category": "Pet Supplies",
    "currentStock": 0,
    "safetyStock": 23,
    "maxStock": 46,
    "price": 106,
    "storeId": "3",
    "status": "out",
    "dailySales24h": 3,
    "salesHistory": [
      {
        "date": "04-10",
        "sales": 6
      },
      {
        "date": "04-11",
        "sales": 23
      },
      {
        "date": "04-12",
        "sales": 22
      },
      {
        "date": "04-13",
        "sales": 20
      },
      {
        "date": "04-14",
        "sales": 20
      },
      {
        "date": "04-15",
        "sales": 17
      },
      {
        "date": "04-16",
        "sales": 6
      }
    ],
    "priceHistory": [
      {
        "date": "04-10",
        "price": 109
      },
      {
        "date": "04-11",
        "price": 102
      },
      {
        "date": "04-12",
        "price": 101
      },
      {
        "date": "04-13",
        "price": 105
      },
      {
        "date": "04-14",
        "price": 104
      },
      {
        "date": "04-15",
        "price": 104
      },
      {
        "date": "04-16",
        "price": 103
      }
    ]
  },
  {
    "id": "27",
    "name": "Power Bank 20000mAh",
    "sku": "PROD-027",
    "storeName": "Causeway Bay",
    "category": "Electronics",
    "currentStock": 6,
    "safetyStock": 10,
    "maxStock": 30,
    "price": 12,
    "storeId": "3",
    "status": "low",
    "dailySales24h": 13,
    "salesHistory": [
      {
        "date": "04-10",
        "sales": 20
      },
      {
        "date": "04-11",
        "sales": 24
      },
      {
        "date": "04-12",
        "sales": 14
      },
      {
        "date": "04-13",
        "sales": 12
      },
      {
        "date": "04-14",
        "sales": 8
      },
      {
        "date": "04-15",
        "sales": 19
      },
      {
        "date": "04-16",
        "sales": 6
      }
    ],
    "priceHistory": [
      {
        "date": "04-10",
        "price": 16
      },
      {
        "date": "04-11",
        "price": 14
      },
      {
        "date": "04-12",
        "price": 10
      },
      {
        "date": "04-13",
        "price": 11
      },
      {
        "date": "04-14",
        "price": 7
      },
      {
        "date": "04-15",
        "price": 8
      },
      {
        "date": "04-16",
        "price": 13
      }
    ]
  },
  {
    "id": "28",
    "name": "Type-C Cable 1.5m",
    "sku": "PROD-028",
    "storeName": "Tsim Sha Tsui",
    "category": "Electronics",
    "currentStock": 11,
    "safetyStock": 15,
    "maxStock": 50,
    "price": 42,
    "storeId": "1",
    "status": "low",
    "dailySales24h": 13,
    "salesHistory": [
      {
        "date": "04-10",
        "sales": 22
      },
      {
        "date": "04-11",
        "sales": 5
      },
      {
        "date": "04-12",
        "sales": 5
      },
      {
        "date": "04-13",
        "sales": 19
      },
      {
        "date": "04-14",
        "sales": 10
      },
      {
        "date": "04-15",
        "sales": 18
      },
      {
        "date": "04-16",
        "sales": 13
      }
    ],
    "priceHistory": [
      {
        "date": "04-10",
        "price": 45
      },
      {
        "date": "04-11",
        "price": 37
      },
      {
        "date": "04-12",
        "price": 44
      },
      {
        "date": "04-13",
        "price": 40
      },
      {
        "date": "04-14",
        "price": 45
      },
      {
        "date": "04-15",
        "price": 41
      },
      {
        "date": "04-16",
        "price": 41
      }
    ]
  },
  {
    "id": "29",
    "name": "TWS Earbuds",
    "sku": "PROD-029",
    "storeName": "Tsim Sha Tsui",
    "category": "Electronics",
    "currentStock": 5,
    "safetyStock": 8,
    "maxStock": 25,
    "price": 177,
    "storeId": "1",
    "status": "low",
    "dailySales24h": 9,
    "salesHistory": [
      {
        "date": "04-10",
        "sales": 21
      },
      {
        "date": "04-11",
        "sales": 23
      },
      {
        "date": "04-12",
        "sales": 15
      },
      {
        "date": "04-13",
        "sales": 17
      },
      {
        "date": "04-14",
        "sales": 21
      },
      {
        "date": "04-15",
        "sales": 9
      },
      {
        "date": "04-16",
        "sales": 19
      }
    ],
    "priceHistory": [
      {
        "date": "04-10",
        "price": 177
      },
      {
        "date": "04-11",
        "price": 179
      },
      {
        "date": "04-12",
        "price": 179
      },
      {
        "date": "04-13",
        "price": 177
      },
      {
        "date": "04-14",
        "price": 176
      },
      {
        "date": "04-15",
        "price": 177
      },
      {
        "date": "04-16",
        "price": 176
      }
    ]
  },
  {
    "id": "30",
    "name": "Electric Toothbrush Heads 4pk",
    "sku": "PROD-030",
    "storeName": "Causeway Bay",
    "category": "Personal Care",
    "currentStock": 9,
    "safetyStock": 12,
    "maxStock": 40,
    "price": 87,
    "storeId": "3",
    "status": "low",
    "dailySales24h": 5,
    "salesHistory": [
      {
        "date": "04-10",
        "sales": 14
      },
      {
        "date": "04-11",
        "sales": 23
      },
      {
        "date": "04-12",
        "sales": 19
      },
      {
        "date": "04-13",
        "sales": 16
      },
      {
        "date": "04-14",
        "sales": 22
      },
      {
        "date": "04-15",
        "sales": 11
      },
      {
        "date": "04-16",
        "sales": 8
      }
    ],
    "priceHistory": [
      {
        "date": "04-10",
        "price": 86
      },
      {
        "date": "04-11",
        "price": 84
      },
      {
        "date": "04-12",
        "price": 88
      },
      {
        "date": "04-13",
        "price": 87
      },
      {
        "date": "04-14",
        "price": 90
      },
      {
        "date": "04-15",
        "price": 85
      },
      {
        "date": "04-16",
        "price": 89
      }
    ]
  }
];

export const mockTransfers: Transfer[] = [
  {
    "id": "DISP-2026-001",
    "productName": "Gold Infant Formula 900g",
    "sku": "PROD-001",
    "fromStore": "Central Warehouse",
    "toStore": "Causeway Bay",
    "quantity": 30,
    "status": "Pending Approval",
    "urgency": "high",
    "requestedBy": "David Chen",
    "requestedAt": "2026-04-16 12:33",
    "reason": "Stock below safety level"
  },
  {
    "id": "DISP-2026-002",
    "productName": "Baby Wipes 80 Sheets",
    "sku": "PROD-003",
    "fromStore": "Central Warehouse",
    "toStore": "Causeway Bay",
    "quantity": 22,
    "status": "In Progress",
    "urgency": "high",
    "requestedBy": "David Chen",
    "requestedAt": "2026-04-16 13:00",
    "reason": "Stock below safety level"
  },
  {
    "id": "DISP-2026-003",
    "productName": "Diet Coke 330ml*6",
    "sku": "PROD-008",
    "fromStore": "Central Warehouse",
    "toStore": "Causeway Bay",
    "quantity": 28,
    "status": "Pending Approval",
    "urgency": "high",
    "requestedBy": "David Chen",
    "requestedAt": "2026-04-16 13:10",
    "reason": "Stock below safety level"
  },
  {
    "id": "DISP-2026-004",
    "productName": "Classic Potato Chips 160g",
    "sku": "PROD-015",
    "fromStore": "Central Warehouse",
    "toStore": "Causeway Bay",
    "quantity": 36,
    "status": "Completed",
    "urgency": "high",
    "requestedBy": "David Chen",
    "requestedAt": "2026-04-16 10:01",
    "reason": "Stock below safety level"
  },
  {
    "id": "DISP-2026-005",
    "productName": "Braised Beef Noodles 5pk",
    "sku": "PROD-018",
    "fromStore": "Central Warehouse",
    "toStore": "Causeway Bay",
    "quantity": 3,
    "status": "Rejected",
    "urgency": "medium",
    "requestedBy": "David Chen",
    "requestedAt": "2026-04-16 10:05",
    "reason": "Stock below safety level"
  }
];

export const mockTopAlerts = [
  {
    "id": "1",
    "severity": "high",
    "description": "Low stock: Gold Infant Formula 900g (8 units)",
    "store": "Causeway Bay",
    "status": "Pending",
    "storeId": "1",
    "productId": "1"
  },
  {
    "id": "2",
    "severity": "high",
    "description": "Low stock: Baby Wipes 80 Sheets (12 units)",
    "store": "Causeway Bay",
    "status": "In Progress",
    "storeId": "1",
    "productId": "2"
  },
  {
    "id": "3",
    "severity": "high",
    "description": "Low stock: Diet Coke 330ml*6 (3 units)",
    "store": "Causeway Bay",
    "status": "Pending",
    "storeId": "1",
    "productId": "3"
  },
  {
    "id": "4",
    "severity": "high",
    "description": "Low stock: Classic Potato Chips 160g (5 units)",
    "store": "Causeway Bay",
    "status": "Viewed",
    "storeId": "1",
    "productId": "4"
  },
  {
    "id": "5",
    "severity": "medium",
    "description": "Low stock: Braised Beef Noodles 5pk (18 units)",
    "store": "Causeway Bay",
    "status": "Resolved",
    "storeId": "1",
    "productId": "5"
  },
  {
    "id": "6",
    "severity": "medium",
    "description": "Low stock: Power Bank 20000mAh (6 units)",
    "store": "Causeway Bay",
    "status": "Pending",
    "storeId": "1",
    "productId": "6"
  },
  {
    "id": "7",
    "severity": "medium",
    "description": "Low stock: Electric Toothbrush Heads 4pk (9 units)",
    "store": "Causeway Bay",
    "status": "Pending",
    "storeId": "1",
    "productId": "7"
  },
  {
    "id": "8",
    "severity": "high",
    "description": "Low stock: Diapers XL 56pcs (4 units)",
    "store": "Tsim Sha Tsui",
    "status": "Viewed",
    "storeId": "2",
    "productId": "8"
  },
  {
    "id": "9",
    "severity": "high",
    "description": "Low stock: Latte Coffee 270ml (2 units)",
    "store": "Tsim Sha Tsui",
    "status": "Pending",
    "storeId": "2",
    "productId": "9"
  },
  {
    "id": "10",
    "severity": "high",
    "description": "Low stock: Mixed Nuts 200g (7 units)",
    "store": "Tsim Sha Tsui",
    "status": "In Progress",
    "storeId": "2",
    "productId": "10"
  }
];

export const salesTrendData = [
  { day: 'Mon', value: 45, lastWeek: 38 },
  { day: 'Tue', value: 52, lastWeek: 45 },
  { day: 'Wed', value: 61, lastWeek: 50 },
  { day: 'Thu', value: 55, lastWeek: 52 },
  { day: 'Fri', value: 48, lastWeek: 44 },
  { day: 'Sat', value: 68, lastWeek: 60 },
  { day: 'Sun', value: 75, lastWeek: 65 },
];

export const weeklyStoreData = [
  {
    "name": "Causeway Bay",
    "sales": 411,
    "target": 415
  },
  {
    "name": "Tsim Sha Tsui",
    "sales": 207,
    "target": 216
  },
  {
    "name": "Mong Kok",
    "sales": 179,
    "target": 198
  }
];

export const inventoryDistribution = [
  {
    "category": "Baby Care",
    "value": 49
  },
  {
    "category": "Supplements",
    "value": 56
  },
  {
    "category": "Beverages",
    "value": 51
  },
  {
    "category": "Bakery",
    "value": 37
  },
  {
    "category": "Snacks",
    "value": 36
  },
  {
    "category": "Instant Food",
    "value": 41
  },
  {
    "category": "Household",
    "value": 55
  },
  {
    "category": "Pet Supplies",
    "value": 20
  },
  {
    "category": "Electronics",
    "value": 22
  },
  {
    "category": "Personal Care",
    "value": 9
  }
];

export const dashboardKpiData = [
  {
    "label": "Today's Sales",
    "value": 798814
  },
  {
    "label": "Orders",
    "value": 30
  },
  {
    "label": "Foot Traffic",
    "value": 105
  },
  {
    "label": "Total Stock",
    "value": 376
  }
];
