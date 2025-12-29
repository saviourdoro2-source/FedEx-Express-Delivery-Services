import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type CreateShipmentRequest, type CreateSubscriptionRequest } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

// GET /api/shipments/:trackingNumber
export function useTrackShipment(trackingNumber: string | null) {
  return useQuery({
    queryKey: [api.shipments.track.path, trackingNumber],
    queryFn: async () => {
      if (!trackingNumber) return null;
      const url = buildUrl(api.shipments.track.path, { trackingNumber });
      const res = await fetch(url);
      
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch shipment details");
      
      return api.shipments.track.responses[200].parse(await res.json());
    },
    enabled: !!trackingNumber && trackingNumber.length > 0,
    retry: false,
  });
}

// POST /api/subscriptions
export function useSubscribeUpdates() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (data: CreateSubscriptionRequest) => {
      const res = await fetch(api.subscriptions.create.path, {
        method: api.subscriptions.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = await res.json();
          throw new Error(error.message || "Invalid input");
        }
        throw new Error("Failed to subscribe");
      }
      return api.subscriptions.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      toast({
        title: "Subscribed!",
        description: "You will receive SMS updates for this shipment.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Helper to create dummy shipment for demo purposes (POST /api/shipments)
// This is mostly for development/demo seeding from the client if needed
export function useCreateShipment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateShipmentRequest) => {
      const res = await fetch(api.shipments.create.path, {
        method: api.shipments.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create shipment");
      return api.shipments.create.responses[201].parse(await res.json());
    },
  });
}
