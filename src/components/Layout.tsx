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
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6 bg-card rounded-lg p-4 shadow-sm">
            <Breadcrumbs />
            <Button 
              variant="ghost" 
              onClick={signOut} 
              size="sm"
              className="hover:bg-primary/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
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