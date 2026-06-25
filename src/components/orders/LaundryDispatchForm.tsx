import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { 
  MapPin, Phone, User, Calendar, Clock, Truck, Store, 
  Camera, FileText, Loader2, X, Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useZones, useService } from '@/hooks/useServices';
import type { Database } from '@/integrations/supabase/types';

type LaundryService = Database['public']['Enums']['laundry_service'];
type DeliveryOption = Database['public']['Enums']['delivery_option'];
type ReturnOption = Database['public']['Enums']['return_option'];

const orderSchema = z.object({
  customerName: z.string().min(2, 'Name is required'),
  customerPhone: z.string().min(10, 'Valid phone number required'),
  customerAddress: z.string().min(5, 'Full address is required'),
  laundryNotes: z.string().optional(),
  specialInstructions: z.string().optional(),
  pickupDate: z.string().optional(),
  pickupTimeSlot: z.string().optional(),
  returnDate: z.string().min(1, 'Return date is required'),
  deliveryOption: z.enum(['self_deliver', 'pickup_requested']),
  returnOption: z.enum(['self_pickup', 'delivery_requested']),
  zoneId: z.string().optional(),
});

type OrderFormData = z.infer<typeof orderSchema>;

interface LaundryDispatchFormProps {
  serviceType: LaundryService;
  serviceName: string;
  onSuccess?: () => void;
  compact?: boolean;
}

export function LaundryDispatchForm({ 
  serviceType, 
  serviceName, 
  onSuccess,
  compact = false 
}: LaundryDispatchFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { data: zones } = useZones();
  const { service } = useService(serviceType);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      deliveryOption: 'pickup_requested',
      returnOption: 'delivery_requested',
    },
  });

  const deliveryOption = watch('deliveryOption');
  const returnOption = watch('returnOption');
  const zoneId = watch('zoneId');
  const selectedZone = zones?.find((z) => z.id === zoneId);
  const pickupFee = deliveryOption === 'pickup_requested' && selectedZone ? Number(selectedZone.pickup_fee) : 0;
  const deliveryFee = returnOption === 'delivery_requested' && selectedZone ? Number(selectedZone.delivery_fee) : 0;
  const estimatedPrice = (service?.basePrice ?? 0) + pickupFee + deliveryFee;

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const onSubmit = async (data: OrderFormData) => {
    setIsLoading(true);

    try {
      let currentUser = user;

      // Auto sign-in anonymously if not logged in
      if (!currentUser) {
        const { error: anonError } = await supabase.auth.signInAnonymously();
        if (anonError) throw anonError;
        const { data: sessionData } = await supabase.auth.getSession();
        currentUser = sessionData.session?.user ?? null;
        if (!currentUser) throw new Error('Failed to create anonymous session');
      }
      let customerPhotoUrl: string | null = null;

      // Upload photo if provided
      if (photoFile) {
        const fileExt = photoFile.name.split('.').pop();
        const filePath = `${currentUser.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('laundry-photos')
          .upload(filePath, photoFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('laundry-photos')
          .getPublicUrl(filePath);
        
        customerPhotoUrl = urlData.publicUrl;
      }

      // Create order
      const { error: orderError } = await supabase.from('orders').insert({
        user_id: currentUser.id,
        service_type: serviceType,
        customer_name: data.customerName,
        customer_phone: data.customerPhone,
        customer_address: data.customerAddress,
        laundry_notes: data.laundryNotes || null,
        special_instructions: data.specialInstructions || null,
        pickup_date: data.deliveryOption === 'pickup_requested' ? data.pickupDate : null,
        pickup_time_slot: data.deliveryOption === 'pickup_requested' ? data.pickupTimeSlot : null,
        return_date: data.returnDate,
        delivery_option: data.deliveryOption as DeliveryOption,
        return_option: data.returnOption as ReturnOption,
        customer_photo_url: customerPhotoUrl,
        zone_id: data.zoneId || null,
        pickup_fee: pickupFee || null,
        delivery_fee: deliveryFee || null,
        estimated_price: estimatedPrice || null,
      });

      if (orderError) throw orderError;

      toast({
        title: 'Order Placed!',
        description: 'Your laundry order has been submitted successfully.',
      });

      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast({
        title: 'Order Failed',
        description: error.message || 'Failed to place order. Please try again.',
        variant: 'destructive',
      });
    }

    setIsLoading(false);
  };

  // Get minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={compact ? '' : 'glass-card p-4 md:p-6 rounded-2xl'}
    >
      {!compact && (
        <div className="mb-5 md:mb-6">
          <h3 className="text-lg md:text-xl font-bold text-foreground">Schedule {serviceName}</h3>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Fill in the details to dispatch your laundry
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                {...register('customerName')}
                id="customerName"
                placeholder="Your name"
                className="pl-10"
              />
            </div>
            {errors.customerName && (
              <p className="text-xs text-destructive">{errors.customerName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerPhone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                {...register('customerPhone')}
                id="customerPhone"
                placeholder="+254 700 000 000"
                className="pl-10"
              />
            </div>
            {errors.customerPhone && (
              <p className="text-xs text-destructive">{errors.customerPhone.message}</p>
            )}
          </div>
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label htmlFor="customerAddress">Delivery Address</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Textarea
              {...register('customerAddress')}
              id="customerAddress"
              placeholder="Full address including building, floor, apartment..."
              className="pl-10 min-h-[80px]"
            />
          </div>
          {errors.customerAddress && (
            <p className="text-xs text-destructive">{errors.customerAddress.message}</p>
          )}
        </div>

        {/* Laundry Notes */}
        <div className="space-y-2">
          <Label htmlFor="laundryNotes">Laundry Description</Label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Textarea
              {...register('laundryNotes')}
              id="laundryNotes"
              placeholder="Describe your items: e.g., 3 shirts, 2 trousers, 1 suit..."
              className="pl-10 min-h-[60px]"
            />
          </div>
        </div>

        {/* Special Instructions */}
        <div className="space-y-2">
          <Label htmlFor="specialInstructions">Special Instructions (Optional)</Label>
          <Textarea
            {...register('specialInstructions')}
            id="specialInstructions"
            placeholder="Any special care instructions, stain locations, etc."
            className="min-h-[60px]"
          />
        </div>

        {/* Photo Upload */}
        <div className="space-y-2">
          <Label>Photo of Items (Optional)</Label>
          {photoPreview ? (
            <div className="relative w-32 h-32">
              <img
                src={photoPreview}
                alt="Preview"
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={removePhoto}
                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex flex-col items-center">
                <Camera className="w-6 h-6 text-muted-foreground mb-1" />
                <span className="text-xs text-muted-foreground">Upload photo</span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Delivery Options */}
        <div className="space-y-3">
          <Label>How will you send your laundry?</Label>
          <RadioGroup
            value={deliveryOption}
            onValueChange={(value) => setValue('deliveryOption', value as DeliveryOption)}
            className="grid grid-cols-2 gap-3"
          >
            <label 
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                deliveryOption === 'pickup_requested' 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:bg-muted/50'
              }`}
            >
              <RadioGroupItem value="pickup_requested" />
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4" />
                <span className="text-sm">Schedule Pickup</span>
              </div>
            </label>
            <label 
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                deliveryOption === 'self_deliver' 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:bg-muted/50'
              }`}
            >
              <RadioGroupItem value="self_deliver" />
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4" />
                <span className="text-sm">Drop Off</span>
              </div>
            </label>
          </RadioGroup>
        </div>

        {/* Pickup Scheduling */}
        {deliveryOption === 'pickup_requested' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 p-3 md:p-4 bg-muted/30 rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="pickupDate">Pickup Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  {...register('pickupDate')}
                  id="pickupDate"
                  type="date"
                  min={minDate}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pickupTimeSlot">Time Slot</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <select
                  {...register('pickupTimeSlot')}
                  id="pickupTimeSlot"
                  className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm"
                >
                  <option value="">Select time</option>
                  <option value="08:00-10:00">8:00 AM - 10:00 AM</option>
                  <option value="10:00-12:00">10:00 AM - 12:00 PM</option>
                  <option value="12:00-14:00">12:00 PM - 2:00 PM</option>
                  <option value="14:00-16:00">2:00 PM - 4:00 PM</option>
                  <option value="16:00-18:00">4:00 PM - 6:00 PM</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Return Options */}
        <div className="space-y-3">
          <Label>How would you like to receive your laundry?</Label>
          <RadioGroup
            value={returnOption}
            onValueChange={(value) => setValue('returnOption', value as ReturnOption)}
            className="grid grid-cols-2 gap-3"
          >
            <label 
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                returnOption === 'delivery_requested' 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:bg-muted/50'
              }`}
            >
              <RadioGroupItem value="delivery_requested" />
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4" />
                <span className="text-sm">Deliver to Me</span>
              </div>
            </label>
            <label 
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                returnOption === 'self_pickup' 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:bg-muted/50'
              }`}
            >
              <RadioGroupItem value="self_pickup" />
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4" />
                <span className="text-sm">I'll Pick Up</span>
              </div>
            </label>
          </RadioGroup>
        </div>

        {/* Return Date */}
        <div className="space-y-2">
          <Label htmlFor="returnDate">When do you need it back?</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              {...register('returnDate')}
              id="returnDate"
              type="date"
              min={minDate}
              className="pl-10"
            />
          </div>
          {errors.returnDate && (
            <p className="text-xs text-destructive">{errors.returnDate.message}</p>
          )}
        </div>

        {/* Service area / zone */}
        {(deliveryOption === 'pickup_requested' || returnOption === 'delivery_requested') && zones && zones.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="zoneId">Service area</Label>
            <select
              {...register('zoneId')}
              id="zoneId"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">Select your area</option>
              {zones.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name} — pickup KES {Number(z.pickup_fee).toLocaleString()} / delivery KES {Number(z.delivery_fee).toLocaleString()}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Price preview */}
        {service && (
          <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm space-y-1">
            <div className="flex justify-between"><span className="text-muted-foreground">{service.name}</span><span>KES {service.basePrice.toLocaleString()}</span></div>
            {pickupFee > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Pickup ({selectedZone?.name})</span><span>KES {pickupFee.toLocaleString()}</span></div>}
            {deliveryFee > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Delivery ({selectedZone?.name})</span><span>KES {deliveryFee.toLocaleString()}</span></div>}
            <div className="flex justify-between font-semibold border-t border-border pt-1 mt-1"><span>Estimated total</span><span>KES {estimatedPrice.toLocaleString()}</span></div>
          </div>
        )}


          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Placing Order...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Place Order
            </>
          )}
        </Button>
      </form>
    </motion.div>
  );
}
