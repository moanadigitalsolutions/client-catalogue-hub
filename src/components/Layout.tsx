import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import AppSidebar from "./AppSidebar";
import { Breadcrumbs } from "./Breadcrumbs";
import { HelpGuide } from "./HelpGuide";

const Layout = () => {
  const { signOut } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-5">
          <div className="flex justify-between items-start mb-4">
            <Breadcrumbs />
            <Button variant="ghost" onClick={signOut} size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
          <div className="grid gap-5">
            <Outlet />
          </div>
          <div className="fixed bottom-5 right-5">
            <HelpGuide />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;