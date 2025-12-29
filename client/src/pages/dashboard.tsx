import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { 
  Package, 
  Plus, 
  MapPin, 
  Truck, 
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Search,
  RefreshCw,
  ArrowRight,
  User,
  Download
} from "lucide-react";
import { generateShippingLabel } from "@/lib/pdfLabel";
import type { Shipment } from "@shared/schema";

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "delivered":
      return "bg-green-500/10 text-green-600 border-green-200 dark:border-green-800";
    case "in transit":
      return "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800";
    case "exception":
      return "bg-red-500/10 text-red-600 border-red-200 dark:border-red-800";
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

function CreateShipmentDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [senderName, setSenderName] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (data: {
      senderName: string;
      recipientName: string;
      origin: string;
      destination: string;
      weightKg?: number;
    }) => {
      const res = await apiRequest("POST", "/api/shipments", data);
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Shipment created!",
        description: `Tracking ID: ${data.shipment.trackingId}`,
      });
      setOpen(false);
      resetForm();
      onSuccess();
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to create shipment",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setSenderName("");
    setRecipientName("");
    setOrigin("");
    setDestination("");
    setWeightKg("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName || !recipientName || !origin || !destination) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    mutation.mutate({
      senderName,
      recipientName,
      origin,
      destination,
      weightKg: weightKg ? parseInt(weightKg) : undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button data-testid="button-create-shipment">
          <Plus className="mr-2 h-4 w-4" />
          Create Shipment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Shipment</DialogTitle>
          <DialogDescription>
            Fill in the shipment details. A tracking ID will be generated automatically.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="senderName">Sender Name *</Label>
              <Input
                id="senderName"
                placeholder="John Doe"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                disabled={mutation.isPending}
                data-testid="input-sender-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipientName">Recipient Name *</Label>
              <Input
                id="recipientName"
                placeholder="Jane Smith"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                disabled={mutation.isPending}
                data-testid="input-recipient-name"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="origin">Origin City *</Label>
              <Input
                id="origin"
                placeholder="New York, NY"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                disabled={mutation.isPending}
                data-testid="input-origin"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination">Destination City *</Label>
              <Input
                id="destination"
                placeholder="Los Angeles, CA"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                disabled={mutation.isPending}
                data-testid="input-destination"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="weightKg">Weight (kg, optional)</Label>
            <Input
              id="weightKg"
              type="number"
              placeholder="5"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              disabled={mutation.isPending}
              data-testid="input-weight"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending} data-testid="button-submit-shipment">
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  Create Shipment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ShipmentCard({ shipment }: { shipment: Shipment }) {
  const [, navigate] = useLocation();
  const StatusIcon = getStatusIcon(shipment.status);

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleDownloadLabel = (e: React.MouseEvent) => {
    e.stopPropagation();
    generateShippingLabel(shipment);
  };

  const handleCardClick = () => {
    navigate(`/tracking?id=${shipment.trackingId}`);
  };

  return (
    <Card className="hover-elevate overflow-visible cursor-pointer" onClick={handleCardClick} data-testid={`card-shipment-${shipment.trackingId}`}>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="font-semibold flex items-center gap-2 flex-wrap" data-testid={`text-tracking-id-${shipment.trackingId}`}>
                {shipment.trackingId}
                <Badge className={`text-xs ${getStatusColor(shipment.status)}`}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {shipment.status}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {shipment.senderName} → {shipment.recipientName}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{shipment.origin} → {shipment.destination}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{formatDate(shipment.createdAt)}</span>
            </div>
            <Button
              size="icon"
              variant="outline"
              onClick={handleDownloadLabel}
              data-testid={`button-download-label-${shipment.trackingId}`}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, refetch } = useQuery<{ shipments: Shipment[] }>({
    queryKey: ["/api/shipments"],
    enabled: isAuthenticated,
  });

  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const shipments = data?.shipments || [];
  const filteredShipments = searchQuery
    ? shipments.filter(
        (s) =>
          s.trackingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.destination.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : shipments;

  const stats = {
    total: shipments.length,
    inTransit: shipments.filter((s) => s.status.toLowerCase() === "in transit").length,
    delivered: shipments.filter((s) => s.status.toLowerCase() === "delivered").length,
    created: shipments.filter((s) => s.status.toLowerCase() === "created").length,
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold" data-testid="text-dashboard-title">Dashboard</h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-2">
              <User className="h-4 w-4" />
              Welcome back, {user?.name}
            </p>
          </div>
          <CreateShipmentDialog onSuccess={() => refetch()} />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-primary" data-testid="stat-total">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Shipments</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-accent" data-testid="stat-created">{stats.created}</div>
              <div className="text-sm text-muted-foreground">Created</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-blue-500" data-testid="stat-in-transit">{stats.inTransit}</div>
              <div className="text-sm text-muted-foreground">In Transit</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-green-500" data-testid="stat-delivered">{stats.delivered}</div>
              <div className="text-sm text-muted-foreground">Delivered</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Your Shipments</CardTitle>
                <CardDescription>
                  {filteredShipments.length} shipment{filteredShipments.length !== 1 ? "s" : ""} found
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search shipments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-full sm:w-64"
                    data-testid="input-search"
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => refetch()}
                  disabled={isLoading}
                  data-testid="button-refresh"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredShipments.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">
                  {searchQuery ? "No shipments found" : "No shipments yet"}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchQuery
                    ? "Try adjusting your search query"
                    : "Create your first shipment to get started"}
                </p>
                {!searchQuery && (
                  <CreateShipmentDialog onSuccess={() => refetch()} />
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredShipments.map((shipment) => (
                  <ShipmentCard key={shipment.id} shipment={shipment} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
