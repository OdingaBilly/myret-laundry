import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type MembershipPlan = {
  id: string;
  name: string;
  price: number;
  benefits?: any;
  points_multiplier: number;
  sort_order: number;
};

export type Membership = {
  id: string;
  user_id: string;
  plan_id: string | null;
  started_at: string;
  expires_at: string | null;
  active: boolean;
  points_balance: number;
};

export function useMembershipPlans() {
  return useQuery({
    queryKey: ['membership_plans'],
    queryFn: async (): Promise<MembershipPlan[]> => {
      const { data, error } = await supabase.from('membership_plans').select('*').order('sort_order', { ascending: true });
      if (error) throw error;
      return (data ?? []) as MembershipPlan[];
    },
    staleTime: 60_000,
  });
}

export function useMembership(userId?: string) {
  return useQuery({
    queryKey: ['membership', userId],
    queryFn: async (): Promise<Membership | null> => {
      if (!userId) return null;
      const { data, error } = await supabase.from('memberships').select('*').eq('user_id', userId).maybeSingle();
      if (error) throw error;
      return (data ?? null) as Membership | null;
    },
    enabled: !!userId,
    staleTime: 60_000,
  });
}

export function useLoyaltyPoints(userId?: string) {
  return useQuery({
    queryKey: ['loyalty_points', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase.from('loyalty_points').select('*').eq('user_id', userId).order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []);
    },
    enabled: !!userId,
    staleTime: 60_000,
  });
}
