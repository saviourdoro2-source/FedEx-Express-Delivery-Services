import { Link } from "wouter";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Truck, 
  Plane, 
  Ship, 
  Package,
  Clock,
  Globe,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle,
  Building,
  Users
} from "lucide-react";

export default function ServicesPage() {
  const mainServices = [
    {
      icon: Zap,
      title: "Express Delivery",
      description: "Next-day delivery for urgent shipments. Available for domestic and select international destinations.",
      features: ["Next-day guarantee", "Priority handling", "Real-time tracking", "Signature confirmation"],
      badge: "Most Popular",
      badgeVariant: "default" as const
    },
    {
      icon: Truck,
      title: "Ground Shipping",
      description: "Cost-effective ground transportation for standard shipments with reliable delivery windows.",
      features: ["Economical rates", "2-5 day delivery", "Full tracking", "Insurance included"],
      badge: "Best Value",
      badgeVariant: "secondary" as const
    },
    {
      icon: Plane,
      title: "International Air",
      description: "Fast international delivery via our global air freight network to 220+ countries.",
      features: ["Global coverage", "Customs clearance", "Express options", "Door-to-door service"],
      badge: "Global",
      badgeVariant: "outline" as const
    }
  ];

  const additionalServices = [
    {
      icon: Package,
      title: "Freight Services",
      description: "Large shipment solutions for pallets and containers."
    },
    {
      icon: Ship,
      title: "Ocean Freight",
      description: "Cost-effective shipping for large international cargo."
    },
    {
      icon: Building,
      title: "Warehouse Solutions",
      description: "Storage and fulfillment services for businesses."
    },
    {
      icon: Users,
      title: "Business Accounts",
      description: "Volume discounts and dedicated account management."
    }
  ];

  const benefits = [
    { icon: Clock, text: "On-time delivery guarantee" },
    { icon: Shield, text: "Full package insurance" },
    { icon: Globe, text: "220+ countries served" },
    { icon: Zap, text: "Real-time notifications" }
  ];

  return (
    <Layout>
      <section className="relative overflow-hidden py-16 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Badge variant="secondary" className="text-sm px-3 py-1">
              Our Services
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl font-black" data-testid="text-services-title">
              Shipping Solutions for{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Every Need
              </span>
            </h1>
            
            <p className="text-lg text-muted-foreground" data-testid="text-services-description">
              From express deliveries to freight logistics, we offer comprehensive shipping 
              services tailored to your requirements.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {mainServices.map((service, index) => (
              <Card key={index} className="relative overflow-visible hover-elevate">
                {service.badge && (
                  <Badge 
                    variant={service.badgeVariant}
                    className="absolute -top-3 left-6"
                  >
                    {service.badge}
                  </Badge>
                )}
                <CardHeader className="pt-8">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
                    <service.icon className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle data-testid={`text-service-title-${index}`}>{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {service.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/register">
                    <Button className="w-full" data-testid={`button-get-started-${index}`}>
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" data-testid="text-additional-title">
              Additional Services
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Beyond standard shipping, we offer specialized solutions for complex logistics needs.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalServices.map((service, index) => (
              <Card key={index} className="text-center hover-elevate overflow-visible">
                <CardContent className="pt-8 pb-6 space-y-4">
                  <div className="w-12 h-12 mx-auto rounded-lg bg-accent/10 flex items-center justify-center">
                    <service.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-semibold" data-testid={`text-additional-service-${index}`}>
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold" data-testid="text-benefits-title">
                Why Ship With Us?
              </h2>
              <p className="opacity-80">
                Every shipment comes with our commitment to reliability, security, and 
                exceptional customer service.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                      <benefit.icon className="h-5 w-5 text-accent" />
                    </div>
                    <span className="text-sm font-medium">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-8 space-y-6">
                <h3 className="text-xl font-semibold">Get a Custom Quote</h3>
                <p className="opacity-80 text-sm">
                  Need a tailored shipping solution? Create an account and we'll help you 
                  find the perfect option for your needs.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/register">
                    <Button className="bg-accent text-accent-foreground border-accent" data-testid="button-create-account">
                      Create Account
                    </Button>
                  </Link>
                  <Link href="/tracking">
                    <Button variant="outline" className="border-white/30 text-white" data-testid="button-track-package">
                      Track Package
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4" data-testid="text-cta-title">
            Ready to Start Shipping?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of businesses and individuals who trust FedExpress 
            for their shipping needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/register">
              <Button size="lg" data-testid="button-get-started-final">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" data-testid="button-learn-more">
                Learn More About Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
