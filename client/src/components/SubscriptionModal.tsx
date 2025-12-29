import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bell, Smartphone, Check } from "lucide-react";
import { insertSubscriptionSchema } from "@shared/schema";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useSubscribeUpdates } from "@/hooks/use-shipments";

// Validation schema for the form
const formSchema = insertSubscriptionSchema.extend({
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
});

type FormValues = z.infer<typeof formSchema>;

interface SubscriptionModalProps {
  trackingNumber: string;
}

export function SubscriptionModal({ trackingNumber }: SubscriptionModalProps) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending, isSuccess, reset: resetMutation } = useSubscribeUpdates();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      trackingNumber,
      phoneNumber: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    mutate(values, {
      onSuccess: () => {
        setTimeout(() => {
          setOpen(false);
          resetMutation(); // Reset mutation state
          form.reset();    // Reset form
        }, 2000);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="gap-2 border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white transition-colors"
        >
          <Bell className="w-4 h-4" />
          Get SMS Updates
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl text-brand-purple">
            <Smartphone className="w-6 h-6 text-brand-orange" />
            Stay Updated
          </DialogTitle>
          <DialogDescription>
            Enter your mobile number to receive real-time SMS updates for shipment 
            <span className="font-mono font-bold text-gray-900 mx-1">{trackingNumber}</span>.
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-6 text-center animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">You're Subscribed!</h3>
            <p className="text-gray-500 mt-2">We'll text you when this package moves.</p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="(555) 123-4567" 
                        {...field} 
                        className="text-lg py-6"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                <Button 
                  type="submit" 
                  disabled={isPending}
                  className="bg-brand-purple hover:bg-brand-purple/90 min-w-[120px]"
                >
                  {isPending ? "Subscribing..." : "Subscribe"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
