import { useState } from "react";
import { useLocation, useSearch } from "wouter";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, ArrowRight, Loader2, CheckCircle } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function VerifyPage() {
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationType, setVerificationType] = useState<"email" | "phone">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const type = (params.get("type") || "email") as "email" | "phone";

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleGenerateCode = async () => {
    setIsLoading(true);
    try {
      const res = await apiRequest("POST", "/api/verification/generate", { type: verificationType });
      const data = await res.json();
      toast({
        title: "Code sent!",
        description: data.message,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to generate code",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!verificationCode) {
      toast({
        title: "Missing code",
        description: "Please enter the verification code.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await apiRequest("POST", "/api/verification/verify", {
        code: verificationCode,
        type: verificationType,
      });
      const data = await res.json();

      setIsVerified(true);
      toast({
        title: "Verified!",
        description: data.message,
      });

      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      toast({
        title: "Verification failed",
        description: err instanceof Error ? err.message : "Invalid code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          {isVerified ? (
            <Card className="border-green-200 dark:border-green-800">
              <CardContent className="p-12 text-center">
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-green-100 dark:bg-green-900 p-3">
                    <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-2">Verified!</h2>
                <p className="text-muted-foreground mb-6">
                  Your {verificationType} has been verified. Redirecting to home...
                </p>
                <Button onClick={() => navigate("/")} className="w-full">
                  Go to Home
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl">Verify Your Account</CardTitle>
                <CardDescription>
                  Complete your account setup to start shipping
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>Verification Method</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant={verificationType === "email" ? "default" : "outline"}
                      onClick={() => setVerificationType("email")}
                      className="flex items-center justify-center gap-2"
                      disabled={isLoading}
                      data-testid="button-verify-email"
                    >
                      <Mail className="h-4 w-4" />
                      Email
                    </Button>
                    <Button
                      type="button"
                      variant={verificationType === "phone" ? "default" : "outline"}
                      onClick={() => setVerificationType("phone")}
                      className="flex items-center justify-center gap-2"
                      disabled={isLoading}
                      data-testid="button-verify-phone"
                    >
                      <Phone className="h-4 w-4" />
                      Phone
                    </Button>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleGenerateCode}
                  disabled={isLoading}
                  data-testid="button-send-code"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Verification Code"
                  )}
                </Button>

                <form onSubmit={handleVerify} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">Verification Code</Label>
                    <Input
                      id="code"
                      placeholder="6-character code"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                      maxLength={6}
                      className="font-mono text-center text-lg tracking-widest"
                      disabled={isLoading}
                      data-testid="input-verify-code"
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading} data-testid="button-verify">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>

                <p className="text-center text-xs text-muted-foreground">
                  You can skip verification and access your account from dashboard settings.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}
