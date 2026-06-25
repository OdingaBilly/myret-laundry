import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from './AdminSidebar';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminLayout() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/dashboard');
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center border-b px-3 md:px-4 bg-background sticky top-0 z-10 gap-2">
            <SidebarTrigger />
            <h1 className="text-base md:text-lg font-bold text-foreground truncate">MyRet Admin</h1>
            <a href="/" className="ml-auto text-xs md:text-sm text-muted-foreground hover:text-foreground whitespace-nowrap">
              <span className="hidden sm:inline">← Back to Site</span>
              <span className="sm:hidden">← Site</span>
            </a>
          </header>
          <main className="flex-1 p-3 md:p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
