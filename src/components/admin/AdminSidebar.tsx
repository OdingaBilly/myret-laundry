import {
  LayoutDashboard, Package, Users, Tag, CreditCard,
  Crown, Settings, BarChart3, ShoppingBag, Truck
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

const mainItems = [
  { title: 'Overview', url: '/admin', icon: LayoutDashboard },
  { title: 'Orders', url: '/admin/orders', icon: Package },
  { title: 'Customers', url: '/admin/customers', icon: Users },
  { title: 'Services', url: '/admin/services', icon: Tag },
  { title: 'Dispatch', url: '/admin/dispatch', icon: Truck },
  { title: 'Memberships', url: '/admin/memberships', icon: Crown },
  { title: 'Payments', url: '/admin/payments', icon: CreditCard },
  { title: 'Analytics', url: '/admin/analytics', icon: BarChart3 },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const isActive = (path: string) => 
    path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(path);

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {!collapsed && 'Admin Panel'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                  >
                    <NavLink
                      to={item.url}
                      end={item.url === '/admin'}
                      className="hover:bg-muted/50"
                      activeClassName="bg-muted text-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
