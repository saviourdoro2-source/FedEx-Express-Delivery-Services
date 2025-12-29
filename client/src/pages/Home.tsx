import { useState } from "react";
import { useLocation } from "wouter";
import { Search, ArrowRight, Package, Clock, ShieldCheck, Globe } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export default function Home() {
  const [trackingInput, setTrackingInput] = useState("");
  const [, setLocation] = useLocation();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingInput.trim()) {
      setLocation(`/track/${trackingInput.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-purple via-brand-purple to-brand-accent" />
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 bg-[url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay" />
          {/* Descriptive comment: Warehouse shipping crates background texture */}
          
          {/* Decorative shapes */}
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand-orange/20 rounded-full blur-3xl" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-400/10 rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative z-10 mx-auto text-center lg:text-left">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl mx-auto lg:mx-0"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
                Shipping that <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-yellow-400">
                  Delivers Promise.
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Fast, reliable, and secure shipping solutions for your business and personal needs. Track your packages in real-time.
              </p>

              {/* Tracking Form Card */}
              <div className="bg-white p-2 rounded-2xl shadow-2xl max-w-lg mx-auto lg:mx-0 transform translate-y-4">
                <form onSubmit={handleTrack} className="flex items-center">
                  <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input 
                      placeholder="Enter Tracking Number" 
                      className="pl-12 pr-4 py-7 text-lg border-none shadow-none focus-visible:ring-0 rounded-xl bg-transparent"
                      value={trackingInput}
                      onChange={(e) => setTrackingInput(e.target.value)}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    size="lg"
                    className="h-14 px-8 rounded-xl bg-brand-purple hover:bg-brand-accent text-white font-bold tracking-wide transition-all hover:scale-105 active:scale-95"
                  >
                    TRACK
                  </Button>
                </form>
              </div>
            </motion.div>

            {/* Right Side Illustration/Image */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block relative"
            >
              {/* Abstract 3D Cube/Package Representation */}
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent rounded-3xl backdrop-blur-sm border border-white/10 shadow-2xl transform rotate-6" />
                <img 
                  src="https://images.unsplash.com/photo-1566576912904-60017581a169?q=80&w=2070&auto=format&fit=crop" 
                  alt="Shipping Logistics"
                  className="rounded-3xl shadow-2xl object-cover w-full h-full transform -rotate-3 border-4 border-white/20"
                />
                {/* Descriptive comment: Shipping container yard aerial view */}

                {/* Floating Status Badge */}
                <div className="absolute -bottom-8 -left-8 bg-white p-4 rounded-xl shadow-xl flex items-center gap-4 animate-bounce duration-[3000ms]">
                  <div className="bg-green-100 p-2 rounded-full text-green-600">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase">Status</p>
                    <p className="text-sm font-bold text-gray-900">Delivered Successfully</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-24 bg-white">
        <div className="container-custom mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-brand-purple mb-4">Global Shipping Solutions</h2>
            <p className="text-gray-600">Whether you're shipping across town or across the ocean, we have the tools and expertise to get it there.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Clock}
              title="Express Delivery"
              description="Next-day delivery options available for urgent shipments to major cities worldwide."
            />
            <FeatureCard 
              icon={ShieldCheck}
              title="Secure Handling"
              description="End-to-end tracking and insurance options to keep your valuable items safe."
            />
            <FeatureCard 
              icon={Globe}
              title="International Reach"
              description="Seamless customs clearance and delivery to over 220 countries and territories."
            />
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="bg-brand-accent py-12 mt-auto">
        <div className="container-custom mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-6">Ready to ship?</h2>
          <Button variant="outline" className="border-white text-brand-purple hover:bg-white/10 hover:text-white transition-colors bg-white font-bold px-8 py-6 rounded-full text-lg">
            Create a Shipment <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <div className="mt-12 pt-8 border-t border-white/10 text-gray-400 text-sm">
            © 2024 ExpressShip Services. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="p-8 rounded-2xl border border-gray-100 hover:shadow-xl hover:border-brand-purple/20 transition-all duration-300 group bg-gray-50/50 hover:bg-white">
      <div className="w-14 h-14 rounded-xl bg-brand-purple/5 text-brand-purple flex items-center justify-center mb-6 group-hover:bg-brand-purple group-hover:text-white transition-colors">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}
