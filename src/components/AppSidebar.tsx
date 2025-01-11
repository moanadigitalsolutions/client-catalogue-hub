import { LayoutDashboard, Users, Settings as SettingsIcon, UserPlus, FileText, UserCog } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

const AppSidebar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;

      console.log('Checking admin status for user:', user.id);
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user role:', error);
        return;
      }

      console.log('Fetched user role:', data);
      setIsAdmin(data?.role === 'admin');
    };

    checkAdminStatus();
  }, [user]);

  const items = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      showAlways: true,
    },
    {
      title: "New Client",
      url: "/clients/new",
      icon: UserPlus,
      showAlways: true,
    },
    {
      title: "Client List",
      url: "/clients",
      icon: Users,
      showAlways: true,
    },
    {
      title: "Users",
      url: "/users",
      icon: UserCog,
      adminOnly: true,
    },
    {
      title: "Reports",
      url: "/reports",
      icon: FileText,
      showAlways: true,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: SettingsIcon,
      showAlways: true,
    },
  ];

  const filteredItems = items.filter(item => item.showAlways || (item.adminOnly && isAdmin));

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Client Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton onClick={() => navigate(item.url)}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;