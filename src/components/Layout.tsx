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
        <main className="flex-1 p-6 space-y-6 overflow-auto">
          <div className="flex justify-between items-center bg-card rounded-xl p-4 shadow-md border border-border/50">
            <Breadcrumbs />
            <Button 
              variant="ghost" 
              onClick={signOut} 
              size="sm"
              className="hover:bg-primary/10 transition-colors duration-200"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
          <div className="space-y-6">
            <Outlet />
          </div>
          <div className="fixed bottom-6 right-6 z-50">
            <HelpGuide />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;