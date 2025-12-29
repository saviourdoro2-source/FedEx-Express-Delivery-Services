import { Layout } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Globe, 
  Award, 
  Heart,
  Target,
  Lightbulb,
  Shield,
  Truck
} from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: "Mission-Driven",
      description: "We're committed to making global shipping accessible, reliable, and transparent for everyone."
    },
    {
      icon: Lightbulb,
      title: "Innovation First",
      description: "Constantly improving our technology to deliver faster, smarter logistics solutions."
    },
    {
      icon: Heart,
      title: "Customer Focus",
      description: "Every decision we make starts with the question: how does this help our customers?"
    },
    {
      icon: Shield,
      title: "Trust & Security",
      description: "Your packages and data are protected by industry-leading security measures."
    }
  ];

  const team = [
    { role: "Operations", count: "5,000+", description: "Logistics experts worldwide" },
    { role: "Technology", count: "500+", description: "Engineers and developers" },
    { role: "Support", count: "1,000+", description: "Customer service agents" },
    { role: "Partners", count: "10,000+", description: "Local delivery partners" }
  ];

  return (
    <Layout>
      <section className="relative overflow-hidden py-16 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Badge variant="secondary" className="text-sm px-3 py-1">
              About FedExpress
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl font-black" data-testid="text-about-title">
              Connecting the World,{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                One Package at a Time
              </span>
            </h1>
            
            <p className="text-lg text-muted-foreground" data-testid="text-about-description">
              FedExpress is a modern shipping logistics platform built with 
              cutting-edge technology, offering best-in-class solutions 
              for all your logistics needs.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold" data-testid="text-story-title">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  This project was built to demonstrate how modern web technologies can power 
                  a comprehensive shipping platform. It showcases user authentication, 
                  real-time tracking, and a beautiful responsive interface.
                </p>
                <p>
                  Inspired by industry leaders like FedEx and DHL, we've created a visual 
                  language that communicates trust, speed, and reliability — the core values 
                  of any great logistics company.
                </p>
                <p>
                  While this is a demonstration project, the technologies and patterns used 
                  here represent production-ready solutions that could power real-world 
                  shipping applications.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Globe, label: "Global Reach", value: "220+ Countries" },
                { icon: Truck, label: "Daily Shipments", value: "1M+ Packages" },
                { icon: Users, label: "Happy Customers", value: "10M+ Users" },
                { icon: Award, label: "Industry Awards", value: "50+ Awards" }
              ].map((stat, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6 pb-4 space-y-2">
                    <div className="w-12 h-12 mx-auto rounded-full bg-accent/10 flex items-center justify-center">
                      <stat.icon className="h-6 w-6 text-accent" />
                    </div>
                    <div className="text-2xl font-bold" data-testid={`text-stat-${index}`}>{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" data-testid="text-values-title">Our Core Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do, from product development to customer service.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="hover-elevate overflow-visible">
                <CardContent className="pt-8 pb-6 space-y-4 text-center">
                  <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <value.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg" data-testid={`text-value-title-${index}`}>
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" data-testid="text-team-title">Our Global Team</h2>
            <p className="opacity-80 max-w-2xl mx-auto">
              Behind every delivery is a dedicated team working to make shipping seamless.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((item, index) => (
              <div key={index} className="text-center space-y-2 p-6 rounded-lg bg-white/5">
                <div className="text-3xl font-black text-accent" data-testid={`text-team-count-${index}`}>
                  {item.count}
                </div>
                <div className="font-semibold">{item.role}</div>
                <div className="text-sm opacity-70">{item.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-muted/50 border-0">
            <CardContent className="p-8 md:p-12 text-center space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold" data-testid="text-disclaimer-title">
                Important Notice
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                FedExpress is not affiliated with, endorsed by, or connected to 
                FedEx, DHL, or any other shipping company. The design inspiration draws 
                from industry visual patterns but uses no copyrighted assets or logos.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
}
