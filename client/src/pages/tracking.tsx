import { useState } from "react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Package, 
  MapPin, 
  Clock, 
  Truck, 
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowRight
} from "lucide-react";
import type { Shipment, ShipmentEvent } from "@shared/schema";

interface TrackingData {
  shipment: Shipment;
  events: ShipmentEvent[];
}

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "delivered":
      return "bg-green-500/10 text-green-600 border-green-200";
    case "in transit":
      return "bg-blue-500/10 text-blue-600 border-blue-200";
    case "exception":
      return "bg-red-500/10 text-red-600 border-red-200";
    case "created":
    default:
      return "bg-accent/10 text-accent border-accent/20";
  }
}

function getStatusIcon(status: string) {
  switch (status.toLowerCase()) {
    case "delivered":
      return CheckCircle;
    case "in transit":
      return Truck;
    case "exception":
      return AlertCircle;
    default:
      return Package;
  }
}

export default function TrackingPage() {
  const [trackingId, setTrackingId] = useState("");
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async () => {
    if (!trackingId.trim()) {
      setError("Please enter a tracking ID");
      return;
    }

    setIsLoading(true);
    setError(null);
    setTrackingData(null);

    try {
      const res = await fetch(`/api/shipments/track/${encodeURIComponent(trackingId.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Shipment not found");
      }

      setTrackingData({
        shipment: data.shipment,
        events: data.events || []
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to track shipment");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <Layout>
      <section className="relative overflow-hidden py-16 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Badge variant="secondary" className="text-sm px-3 py-1">
              <MapPin className="h-3 w-3 mr-1 inline" />
              Package Tracking
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl font-black" data-testid="text-tracking-title">
              Track Your{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Shipment
              </span>
            </h1>
            
            <p className="text-lg text-muted-foreground" data-testid="text-tracking-description">
              Enter your tracking ID to get real-time updates on your package location and delivery status.
            </p>
          </div>

          <div className="max-w-2xl mx-auto mt-10">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder="Enter tracking ID (e.g., FDXABC12345)"
                      value={trackingId}
                      onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                      className="pl-10 text-lg h-12"
                      disabled={isLoading}
                      data-testid="input-tracking-id"
                    />
                  </div>
                  <Button 
                    size="lg" 
                    onClick={handleTrack}
                    disabled={isLoading}
                    className="h-12"
                    data-testid="button-track"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Tracking...
                      </>
                    ) : (
                      <>
                        Track Package
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>

                {error && (
                  <div className="mt-4 p-4 rounded-md bg-destructive/10 text-destructive flex items-center gap-2" data-testid="text-error">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {trackingData && (
        <section className="py-12 bg-muted/50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-3" data-testid="text-shipment-tracking-id">
                      <Package className="h-6 w-6 text-accent" />
                      {trackingData.shipment.trackingId}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Created on {formatDate(trackingData.shipment.createdAt)}
                    </CardDescription>
                  </div>
                  <Badge className={`text-sm px-3 py-1.5 ${getStatusColor(trackingData.shipment.status)}`} data-testid="text-shipment-status">
                    {(() => {
                      const StatusIcon = getStatusIcon(trackingData.shipment.status);
                      return <StatusIcon className="h-4 w-4 mr-1.5 inline" />;
                    })()}
                    {trackingData.shipment.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Sender</div>
                    <div className="font-medium" data-testid="text-sender-name">{trackingData.shipment.senderName}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Recipient</div>
                    <div className="font-medium" data-testid="text-recipient-name">{trackingData.shipment.recipientName}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Origin</div>
                    <div className="font-medium flex items-center gap-1" data-testid="text-origin">
                      <MapPin className="h-4 w-4 text-accent" />
                      {trackingData.shipment.origin}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Destination</div>
                    <div className="font-medium flex items-center gap-1" data-testid="text-destination">
                      <MapPin className="h-4 w-4 text-primary" />
                      {trackingData.shipment.destination}
                    </div>
                  </div>
                </div>
                {trackingData.shipment.weightKg && (
                  <div className="mt-4 pt-4 border-t">
                    <span className="text-sm text-muted-foreground">Weight: </span>
                    <span className="font-medium">{trackingData.shipment.weightKg} kg</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {trackingData.events.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-accent" />
                    Tracking History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative space-y-0">
                    {trackingData.events.map((event, index) => {
                      const EventIcon = getStatusIcon(event.status);
                      const isLast = index === trackingData.events.length - 1;
                      
                      return (
                        <div key={event.id} className="relative flex gap-4 pb-6" data-testid={`event-${index}`}>
                          {!isLast && (
                            <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-border" />
                          )}
                          <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            index === 0 ? "bg-accent text-white" : "bg-muted"
                          }`}>
                            <EventIcon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-semibold">{event.status}</span>
                              <Badge variant="outline" size="sm">
                                {event.location}
                              </Badge>
                            </div>
                            {event.note && (
                              <p className="text-sm text-muted-foreground mt-1">{event.note}</p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDate(event.timestamp)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      )}

      {!trackingData && !isLoading && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold mb-2">How It Works</h2>
              <p className="text-muted-foreground">Track any FedExpress shipment in three easy steps</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "Enter Tracking ID",
                  description: "Input the unique tracking number from your shipping confirmation or receipt."
                },
                {
                  step: "2",
                  title: "View Real-Time Status",
                  description: "See the current location and status of your package instantly."
                },
                {
                  step: "3",
                  title: "Track Timeline",
                  description: "View the complete journey of your shipment with timestamps and locations."
                }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-primary to-accent text-white font-bold text-lg flex items-center justify-center mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}
