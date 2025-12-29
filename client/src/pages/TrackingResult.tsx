import { useRoute, Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { TrackingTimeline } from "@/components/TrackingTimeline";
import { SubscriptionModal } from "@/components/SubscriptionModal";
import { useTrackShipment } from "@/hooks/use-shipments";
import { Package, MapPin, Calendar, Clock, ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function TrackingResult() {
  const [, params] = useRoute("/track/:trackingNumber");
  const trackingNumber = params?.trackingNumber || "";
  
  const { data: shipment, isLoading, error } = useTrackShipment(trackingNumber);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />

      <main className="container-custom mx-auto pt-28 pb-16">
        {/* Breadcrumb / Back */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="pl-0 hover:bg-transparent text-gray-500 hover:text-brand-purple">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <TrackingSkeleton />
        ) : error || !shipment ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Shipment Not Found</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              We couldn't find a shipment with tracking number <span className="font-mono font-bold text-gray-800">{trackingNumber}</span>.
              Please check the number and try again.
            </p>
            <Link href="/">
              <Button className="bg-brand-purple hover:bg-brand-accent">Try Another Number</Button>
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Header Card */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8 border border-gray-100">
              <div className="bg-brand-purple p-6 sm:p-10 text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2 opacity-80">
                    <Package className="w-5 h-5" />
                    <span className="text-sm font-medium tracking-wider uppercase">Standard Shipping</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-bold font-mono tracking-tight">{shipment.trackingNumber}</h1>
                </div>
                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wider opacity-80">Estimated Delivery</p>
                    <p className="text-xl font-bold">{shipment.estimatedDelivery}</p>
                  </div>
                  <Calendar className="w-8 h-8 opacity-80" />
                </div>
              </div>

              <div className="p-6 sm:p-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-brand-purple mb-1">
                      {shipment.status}
                    </h2>
                    <div className="flex items-center text-gray-500">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>Last location: <span className="font-semibold text-gray-700">{shipment.currentLocation}</span></span>
                    </div>
                  </div>
                  
                  <SubscriptionModal trackingNumber={trackingNumber} />
                </div>

                <TrackingTimeline shipment={shipment} />
                
                <div className="mt-8 pt-8 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">Last Updated</p>
                      <p className="text-gray-500">
                        {shipment.lastUpdated ? new Date(shipment.lastUpdated).toLocaleString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Package className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">Package Details</p>
                      <p className="text-gray-500">4.5 lbs • 12x10x8 in</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">Service</p>
                      <p className="text-gray-500">Express Ground w/ Signature</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg mb-4 text-brand-accent">Delivery Instructions</h3>
                <p className="text-gray-600 mb-6">You can request to leave the package at a specific location or schedule a new delivery time.</p>
                <Button variant="outline" className="w-full">Manage Delivery</Button>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg mb-4 text-brand-accent">Proof of Delivery</h3>
                <p className="text-gray-600 mb-6">A photo signature will be available once the package is delivered successfully.</p>
                <Button variant="ghost" disabled className="w-full text-gray-400">Not Available Yet</Button>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

function TrackingSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-[200px] w-full rounded-3xl" />
      <div className="bg-white p-10 rounded-3xl shadow-sm space-y-8">
        <div className="flex justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-3 gap-6 pt-8">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}
