import { Outlet } from "react-router";
import { Toaster } from "sonner";
import { ModeProvider } from "../context/ModeContext";
import { AppDataProvider } from "../context/AppDataContext";

export function Root() {
  return (
    <AppDataProvider>
      <ModeProvider>
        <Outlet />
        <Toaster position="top-center" richColors />
      </ModeProvider>
    </AppDataProvider>
  );
}