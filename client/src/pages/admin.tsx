import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { 
  Users,
  Package,
  Shield,
  ShieldOff,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle,
  Truck,
  MapPin
} from "lucide-react";
import type { Shipment } from "@shared/schema";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

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

function UsersTable() {
  const { toast } = useToast();
  const { user: currentUser } = useAuth();

  const { data, isLoading, error } = useQuery<{ users: AdminUser[] }>({
    queryKey: ["/api/admin/users"],
  });

  const toggleAdminMutation = useMutation({
    mutationFn: async ({ userId, isAdmin }: { userId: string; isAdmin: boolean }) => {
      const res = await apiRequest("PATCH", `/api/admin/users/${userId}`, { isAdmin });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "User updated",
        description: "Admin status has been updated.",
      });
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to update user",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-2">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-muted-foreground">Failed to load users</p>
      </div>
    );
  }

  const users = data?.users || [];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
              No users found
            </TableCell>
          </TableRow>
        ) : (
          users.map((user) => (
            <TableRow key={user.id} data-testid={`row-user-${user.id}`}>
              <TableCell className="font-medium" data-testid={`text-username-${user.id}`}>{user.name}</TableCell>
              <TableCell data-testid={`text-email-${user.id}`}>{user.email}</TableCell>
              <TableCell>
                <Badge 
                  variant={user.isAdmin ? "default" : "secondary"} 
                  className="gap-1"
                  data-testid={`badge-role-${user.id}`}
                >
                  {user.isAdmin ? (
                    <>
                      <Shield className="h-3 w-3" />
                      Admin
                    </>
                  ) : (
                    "User"
                  )}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(user.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                {user.id !== currentUser?.id && (
                  <Button
                    size="sm"
                    variant={user.isAdmin ? "outline" : "default"}
                    onClick={() => toggleAdminMutation.mutate({ userId: user.id, isAdmin: !user.isAdmin })}
                    disabled={toggleAdminMutation.isPending}
                    data-testid={`button-toggle-admin-${user.id}`}
                  >
                    {toggleAdminMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : user.isAdmin ? (
                      <>
                        <ShieldOff className="h-4 w-4 mr-1" />
                        Remove Admin
                      </>
                    ) : (
                      <>
                        <Shield className="h-4 w-4 mr-1" />
                        Make Admin
                      </>
                    )}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

function ShipmentsTable() {
  const { toast } = useToast();

  const { data, isLoading, error } = useQuery<{ shipments: Shipment[] }>({
    queryKey: ["/api/admin/shipments"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (shipmentId: string) => {
      const res = await apiRequest("DELETE", `/api/admin/shipments/${shipmentId}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/shipments"] });
      toast({
        title: "Shipment deleted",
        description: "The shipment has been removed.",
      });
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to delete shipment",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-2">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-muted-foreground">Failed to load shipments</p>
      </div>
    );
  }

  const shipments = data?.shipments || [];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tracking ID</TableHead>
          <TableHead>Route</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {shipments.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
              No shipments found
            </TableCell>
          </TableRow>
        ) : (
          shipments.map((shipment) => (
            <TableRow key={shipment.id} data-testid={`row-shipment-${shipment.id}`}>
              <TableCell className="font-mono font-medium" data-testid={`text-tracking-${shipment.id}`}>
                {shipment.trackingId}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-sm">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <span className="truncate max-w-[100px]">{shipment.origin}</span>
                  <Truck className="h-3 w-3 text-muted-foreground mx-1" />
                  <span className="truncate max-w-[100px]">{shipment.destination}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(shipment.status)} data-testid={`badge-status-${shipment.id}`}>
                  {shipment.status}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(shipment.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="destructive"
                      data-testid={`button-delete-shipment-${shipment.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Shipment</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete shipment {shipment.trackingId}? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteMutation.mutate(shipment.id)}
                        className="bg-destructive text-destructive-foreground"
                        data-testid="button-confirm-delete"
                      >
                        {deleteMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Delete"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

export default function AdminPage() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/login");
    } else if (!isLoading && isAuthenticated && !isAdmin) {
      toast({
        title: "Access denied",
        description: "You don't have permission to access the admin panel.",
        variant: "destructive",
      });
      setLocation("/dashboard");
    }
  }, [isAuthenticated, isAdmin, isLoading, setLocation, toast]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground" data-testid="text-admin-title">Admin Panel</h1>
          <p className="text-muted-foreground mt-1">
            Manage users and shipments across the platform
          </p>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="users" className="gap-2" data-testid="tab-users">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="shipments" className="gap-2" data-testid="tab-shipments">
              <Package className="h-4 w-4" />
              Shipments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Management
                </CardTitle>
                <CardDescription>
                  View and manage user accounts and admin privileges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UsersTable />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shipments">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Shipment Management
                </CardTitle>
                <CardDescription>
                  View and manage all shipments in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ShipmentsTable />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
