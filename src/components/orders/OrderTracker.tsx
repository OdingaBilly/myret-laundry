import { motion } from 'framer-motion';
import { 
  Clock, CheckCircle2, Truck, Store, Sparkles, 
  Package, MapPin, XCircle
} from 'lucide-react';

interface OrderTrackerProps {
  status: string;
  createdAt: string;
  pickedUpAt?: string | null;
  completedAt?: string | null;
}

const displaySteps = [
  { status: 'pending', label: 'Placed', icon: <Clock className="w-4 h-4" /> },
  { status: 'confirmed', label: 'Confirmed', icon: <CheckCircle2 className="w-4 h-4" /> },
  { status: 'picked_up', label: 'Picked Up', icon: <Truck className="w-4 h-4" /> },
  { status: 'in_progress', label: 'Cleaning', icon: <Sparkles className="w-4 h-4" /> },
  { status: 'ready', label: 'Ready', icon: <Package className="w-4 h-4" /> },
  { status: 'completed', label: 'Complete', icon: <CheckCircle2 className="w-4 h-4" /> },
];

export function OrderTracker({ status, createdAt, pickedUpAt, completedAt }: OrderTrackerProps) {
  if (status === 'cancelled') {
    return (
      <div className="p-4 bg-destructive/10 rounded-lg">
        <div className="flex items-center gap-3 text-destructive">
          <XCircle className="w-6 h-6" />
          <div>
            <p className="font-medium">Order Cancelled</p>
            <p className="text-sm opacity-80">This order has been cancelled.</p>
          </div>
        </div>
      </div>
    );
  }

  const getStepStatus = (stepStatus: string, currentStatus: string): 'complete' | 'current' | 'pending' => {
    const statusOrder = ['pending', 'confirmed', 'picked_up', 'at_store', 'in_progress', 'ready', 'out_for_delivery', 'delivered', 'completed'];
    
    // Special mapping for display steps
    const displayMap: Record<string, number> = {
      'pending': 0,
      'confirmed': 1,
      'picked_up': 2,
      'at_store': 2,
      'in_progress': 3,
      'ready': 4,
      'out_for_delivery': 5,
      'delivered': 5,
      'completed': 5,
    };

    const displayCurrent = displayMap[currentStatus] ?? 0;
    const displayStep = displayMap[stepStatus] ?? 0;

    if (displayStep < displayCurrent) return 'complete';
    if (displayStep === displayCurrent) return 'current';
    return 'pending';
  };

  const getCurrentStepIndex = () => {
    const displayMap: Record<string, number> = {
      'pending': 0,
      'confirmed': 1,
      'picked_up': 2,
      'at_store': 2,
      'in_progress': 3,
      'ready': 4,
      'out_for_delivery': 5,
      'delivered': 5,
      'completed': 5,
    };
    return displayMap[status] ?? 0;
  };

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="relative">
        <div className="flex justify-between">
          {displaySteps.map((step, index) => {
            const stepState = getStepStatus(step.status, status);
            return (
              <div key={step.status} className="flex flex-col items-center relative z-10">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: stepState === 'current' ? 1.1 : 1 }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    stepState === 'complete' 
                      ? 'bg-primary text-primary-foreground' 
                      : stepState === 'current'
                      ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step.icon}
                </motion.div>
                <span className={`text-[10px] md:text-xs mt-2 text-center ${
                  stepState === 'pending' ? 'text-muted-foreground' : 'text-foreground'
                }`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
        
        {/* Progress line */}
        <div className="absolute top-4 left-4 right-4 h-0.5 bg-muted -z-0">
          <motion.div
            initial={{ width: 0 }}
            animate={{ 
              width: `${Math.min(100, (getCurrentStepIndex() / (displaySteps.length - 1)) * 100)}%` 
            }}
            transition={{ duration: 0.5 }}
            className="h-full bg-primary"
          />
        </div>
      </div>

      {/* Status details */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs text-muted-foreground">
        <div>
          <p className="font-medium text-foreground">Ordered</p>
          <p>{new Date(createdAt).toLocaleDateString()}</p>
        </div>
        {pickedUpAt && (
          <div>
            <p className="font-medium text-foreground">Picked Up</p>
            <p>{new Date(pickedUpAt).toLocaleDateString()}</p>
          </div>
        )}
        {completedAt && (
          <div>
            <p className="font-medium text-foreground">Completed</p>
            <p>{new Date(completedAt).toLocaleDateString()}</p>
          </div>
        )}
      </div>
    </div>
  );
}
