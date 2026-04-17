import { createHashRouter } from "react-router";
import { Root } from "./components/Root";
import { WelcomePage } from "./components/WelcomePage";
import { WebDashboard } from "./components/web/WebDashboard";
import { WebStoreDetail } from "./components/web/WebStoreDetail";
import { WebStoresList } from "./components/web/WebStoresList";
import { WebProductDetail } from "./components/web/WebProductDetail";
import { WebTransferCenter } from "./components/web/WebTransferCenter";
import { WebInventory } from "./components/web/WebInventory";
import { WebMonitor } from "./components/web/WebMonitor";
import { MobileHome } from "./components/mobile/MobileHome";
import { MobileAlertDetail } from "./components/mobile/MobileAlertDetail";
import { MobileInboundList } from "./components/mobile/MobileInboundList";
import { MobileInboundDetail } from "./components/mobile/MobileInboundDetail";
import { MobileReturnInspection } from "./components/mobile/MobileReturnInspection";
import { MobileReturnList } from "./components/mobile/MobileReturnList";
import { MobileProfile } from "./components/mobile/MobileProfile";
import { MobileInventory } from "./components/mobile/MobileInventory";
import { MobileProductDetail } from "./components/mobile/MobileProductDetail";

export const router = createHashRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: WelcomePage },
      // Web Routes
      { path: "web", Component: WebDashboard },
      { path: "web/store/:storeId", Component: WebStoreDetail },
      { path: "web/stores", Component: WebStoresList },
      { path: "web/product/:productId", Component: WebProductDetail },
      { path: "web/transfer", Component: WebTransferCenter },
      { path: "web/inventory", Component: WebInventory },
      { path: "web/monitor", Component: WebMonitor },
      // Mobile Routes
      { path: "mobile", Component: MobileHome },
      { path: "mobile/alert/:alertId", Component: MobileAlertDetail },
      { path: "mobile/inbound", Component: MobileInboundList },
      { path: "mobile/inbound/:id", Component: MobileInboundDetail },
      { path: "mobile/return", Component: MobileReturnList },
      { path: "mobile/return/:id", Component: MobileReturnInspection },
      { path: "mobile/profile", Component: MobileProfile },
      { path: "mobile/inventory", Component: MobileInventory },
      { path: "mobile/inventory/product/:id", Component: MobileProductDetail },
    ],
  },
]);