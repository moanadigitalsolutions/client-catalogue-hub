import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import AppSidebar from "./AppSidebar";
import { Breadcrumbs } from "./Breadcrumbs";
import { HelpGuide } from "./HelpGuide";
import UserBadge from "./dashboard/UserBadge";

const Layout = () => {
  const { signOut } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-4">
            <Breadcrumbs />
            <div className="flex items-center gap-4">
              <UserBadge />
              <Button variant="ghost" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
          <div className="grid gap-6">
            <Outlet />
          </div>
          <div className="fixed bottom-6 right-6">
            <HelpGuide />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;