import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ServicePage from "./pages/ServicePage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import NewOrderPage from "./pages/NewOrderPage";
import MembershipPage from "./pages/MembershipPage";
import AdminLayout from "./components/admin/AdminLayout";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminServices from "./pages/admin/AdminServices";
import AdminMemberships from "./pages/admin/AdminMemberships";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminDispatch from "./pages/admin/AdminDispatch";
import AdminCategories from "./pages/admin/AdminCategories";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/order/new" element={<NewOrderPage />} />
            <Route path="/membership" element={<MembershipPage />} />
            <Route path="/services/:slug" element={<ServicePage />} />
            
            {/* Admin routes with sidebar layout */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminOverview />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="dispatch" element={<AdminDispatch />} />
              <Route path="memberships" element={<AdminMemberships />} />
              <Route path="payments" element={<AdminPayments />} />
              <Route path="analytics" element={<AdminAnalytics />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
