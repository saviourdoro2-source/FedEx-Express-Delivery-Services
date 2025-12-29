import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Truck, 
  Globe, 
  Shield, 
  Clock, 
  Search,
  ArrowRight,
  CheckCircle,
  Zap,
  MapPin
} from "lucide-react";

export default function HomePage() {
  const [trackingInput, setTrackingInput] = useState("");
  const [trackingResult, setTrackingResult] = useState<{ status?: string; error?: string; destination?: string } | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [, navigate] = useLocation();

  const handleQuickTrack = async () => {
    if (!trackingInput.trim()) {
      setTrackingResult({ error: "Please enter a tracking ID" });
      return;
    }
    
    setIsTracking(true);
    setTrackingResult(null);
    
    try {
      const res = await fetch(`/api/shipments/track/${encodeURIComponent(trackingInput.trim())}`);
      const data = await res.json();
      
      if (!res.ok) {
        setTrackingResult({ error: data.error || "Shipment not found" });
      } else {
        setTrackingResult({
          status: data.shipment.status,
          destination: data.shipment.destination
        });
      }
    } catch {
      setTrackingResult({ error: "Unable to track shipment. Please try again." });
    } finally {
      setIsTracking(false);
    }
  };

  const features = [
    {
      icon: Truck,
      title: "Express Shipping",
      description: "Domestic and international next-day delivery where available, with automated pickup and routing."
    },
    {
      icon: Globe,
      title: "Global Network",
      description: "Ship to over 220 countries and territories with our extensive worldwide logistics network."
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "End-to-end encryption, package insurance, and 24/7 support for all your shipments."
    }
  ];

  const stats = [
    { value: "220+", label: "Countries Served" },
    { value: "99.9%", label: "On-time Delivery" },
    { value: "24/7", label: "Customer Support" },
    { value: "1M+", label: "Packages Daily" }
  ];

  return (
    <Layout>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="secondary" className="text-sm px-3 py-1">
                <Zap className="h-3 w-3 mr-1 inline" />
                Fast. Reliable. Global.
              </Badge>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight" data-testid="text-hero-title">
                Ship with{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Confidence
                </span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-lg" data-testid="text-hero-description">
                Instant quotes, real-time tracking, and simple API-driven automation. 
                Your packages, delivered faster than ever.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link href="/services">
                  <Button size="lg" data-testid="button-get-quote">
                    Get a Quote
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/tracking">
                  <Button size="lg" variant="outline" className="bg-accent text-accent-foreground border-accent" data-testid="button-track-shipment">
                    <MapPin className="mr-2 h-4 w-4" />
                    Track a Shipment
                  </Button>
                </Link>
              </div>
            </div>

            <Card className="shadow-xl border-0 bg-card/80 backdrop-blur">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-accent" />
                  Quick Track
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter tracking ID (e.g., FDXABC123)"
                    value={trackingInput}
                    onChange={(e) => setTrackingInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleQuickTrack()}
                    data-testid="input-quick-track"
                  />
                  <Button 
                    onClick={handleQuickTrack}
                    disabled={isTracking}
                    data-testid="button-quick-track"
                  >
                    {isTracking ? "..." : "Track"}
                  </Button>
                </div>
                
                {trackingResult && (
                  <div className={`p-3 rounded-md text-sm ${
                    trackingResult.error 
                      ? "bg-destructive/10 text-destructive" 
                      : "bg-accent/10 text-foreground"
                  }`} data-testid="text-tracking-result">
                    {trackingResult.error ? (
                      trackingResult.error
                    ) : (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>
                          Status: <strong>{trackingResult.status}</strong>
                          {trackingResult.destination && (
                            <> — Destination: {trackingResult.destination}</>
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                
                <Link href="/tracking">
                  <span className="text-sm text-muted-foreground hover:text-accent cursor-pointer inline-flex items-center gap-1" data-testid="link-advanced-tracking">
                    Advanced tracking options
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-primary text-primary-foreground py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-1">
                <div className="text-3xl sm:text-4xl font-black text-accent" data-testid={`text-stat-value-${index}`}>
                  {stat.value}
                </div>
                <div className="text-sm opacity-80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" data-testid="text-features-title">
              Why Choose FedExpress?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We combine cutting-edge technology with reliable logistics to deliver your packages 
              safely and on time, every time.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover-elevate overflow-visible">
                <CardContent className="pt-8 pb-6 space-y-4">
                  <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold" data-testid={`text-feature-title-${index}`}>
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold" data-testid="text-cta-title">
                Ready to Ship?
              </h2>
              <p className="text-muted-foreground">
                Create an account to start shipping packages worldwide. Enjoy real-time tracking, 
                competitive rates, and a dashboard to manage all your shipments.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/register">
                  <Button size="lg" data-testid="button-create-account">
                    Create Free Account
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" size="lg" data-testid="button-learn-more">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Clock, text: "Fast Delivery" },
                { icon: Package, text: "Secure Packaging" },
                { icon: Globe, text: "Global Reach" },
                { icon: Shield, text: "Insured Shipping" }
              ].map((item, index) => (
                <Card key={index}>
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-accent/10 flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-accent" />
                    </div>
                    <span className="font-medium text-sm">{item.text}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
