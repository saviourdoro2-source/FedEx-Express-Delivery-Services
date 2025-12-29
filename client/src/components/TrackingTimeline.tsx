import { CheckCircle2, Circle, Truck, PackageCheck, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ShipmentResponse } from "@shared/routes";

interface TrackingTimelineProps {
  shipment: ShipmentResponse;
}

const STATUS_STEPS = [
  "Label Created",
  "On the Way", 
  "Out for Delivery", 
  "Delivered"
];

export function TrackingTimeline({ shipment }: TrackingTimelineProps) {
  const currentStepIndex = STATUS_STEPS.indexOf(shipment.status);

  return (
    <div className="w-full py-8">
      {/* Progress Bar (Desktop) */}
      <div className="relative hidden md:flex justify-between items-center mb-12 px-4">
        {/* Background Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10 rounded-full" />
        
        {/* Active Line */}
        <motion.div 
          className="absolute top-1/2 left-0 h-1 bg-brand-purple -z-10 rounded-full" 
          initial={{ width: "0%" }}
          animate={{ width: `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />

        {STATUS_STEPS.map((step, index) => {
          const isCompleted = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;

          let Icon = Circle;
          if (index === 0) Icon = PackageCheck;
          if (index === 1) Icon = Truck;
          if (index === 2) Icon = MapPin;
          if (index === 3) Icon = CheckCircle2;

          return (
            <div key={step} className="flex flex-col items-center relative">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center border-4 transition-colors duration-300 z-10 bg-white",
                  isCompleted 
                    ? "border-brand-purple text-brand-purple shadow-lg shadow-brand-purple/20" 
                    : "border-gray-200 text-gray-300"
                )}
              >
                <Icon size={20} strokeWidth={2.5} />
              </motion.div>
              <div className={cn(
                "absolute top-16 w-32 text-center text-sm font-bold transition-colors duration-300",
                isCompleted ? "text-brand-purple" : "text-gray-400"
              )}>
                {step}
              </div>
              {isCurrent && (
                <motion.div 
                  layoutId="pulse"
                  className="absolute inset-0 rounded-full bg-brand-purple/20 -z-20 animate-ping"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Vertical Timeline (Mobile) */}
      <div className="md:hidden space-y-8 pl-4 border-l-2 border-gray-100 ml-4">
        {STATUS_STEPS.map((step, index) => {
          const isCompleted = index <= currentStepIndex;
          
          return (
            <div key={step} className="relative pl-6">
              <div className={cn(
                "absolute -left-[21px] top-1 w-4 h-4 rounded-full border-2 bg-white transition-colors",
                isCompleted ? "border-brand-purple bg-brand-purple" : "border-gray-300"
              )} />
              <h4 className={cn(
                "font-bold text-lg",
                isCompleted ? "text-brand-purple" : "text-gray-400"
              )}>
                {step}
              </h4>
              {index === currentStepIndex && (
                <p className="text-sm text-gray-500 mt-1">
                  Current Status • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
