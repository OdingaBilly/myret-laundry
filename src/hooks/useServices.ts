import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { mapServiceRow, type ServiceData, fallbackServices } from '@/lib/services';

export function useServices(options?: { includeInactive?: boolean }) {
  const includeInactive = !!options?.includeInactive;
  const query = useQuery({
    queryKey: ['services', { includeInactive }],
    queryFn: async (): Promise<ServiceData[]> => {
      let q = supabase.from('services').select('*').order('sort_order', { ascending: true });
      if (!includeInactive) q = q.eq('active', true);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []).map(mapServiceRow);
    },
    staleTime: 60_000,
  });

  return {
    ...query,
    services: query.data && query.data.length > 0 ? query.data : (query.isLoading ? fallbackServices : query.data ?? []),
  };
}

export function useService(slug?: string) {
  const { services, isLoading } = useServices({ includeInactive: true });
  return { service: services.find((s) => s.slug === slug), isLoading };
}

export type Zone = {
  id: string;
  name: string;
  area_description: string;
  pickup_fee: number;
  delivery_fee: number;
  eta_hours: number;
  active: boolean;
  sort_order: number;
};

export function useZones(options?: { includeInactive?: boolean }) {
  const includeInactive = !!options?.includeInactive;
  return useQuery({
    queryKey: ['delivery_zones', { includeInactive }],
    queryFn: async () => {
      let q = supabase.from('delivery_zones').select('*').order('sort_order', { ascending: true });
      if (!includeInactive) q = q.eq('active', true);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as Zone[];
    },
    staleTime: 60_000,
  });
}

export type Driver = {
  id: string;
  name: string;
  phone: string;
  vehicle: string | null;
  zone_id: string | null;
  active: boolean;
  notes: string | null;
};

export function useDrivers(options?: { includeInactive?: boolean }) {
  const includeInactive = !!options?.includeInactive;
  return useQuery({
    queryKey: ['drivers', { includeInactive }],
    queryFn: async () => {
      let q = supabase.from('drivers').select('*').order('name', { ascending: true });
      if (!includeInactive) q = q.eq('active', true);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as Driver[];
    },
    staleTime: 60_000,
  });
}
