import { Link } from "wouter";
import { PackageX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 text-center p-4">
      <div className="w-24 h-24 bg-brand-purple/10 rounded-full flex items-center justify-center mb-6 text-brand-purple">
        <PackageX className="w-12 h-12" />
      </div>
      
      <h1 className="text-6xl font-extrabold text-brand-purple mb-2">404</h1>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h2>
      <p className="text-gray-500 max-w-md mb-8">
        The package you're looking for seems to have been lost in transit. 
        Let's get you back to headquarters.
      </p>

      <Link href="/">
        <Button size="lg" className="bg-brand-purple hover:bg-brand-accent font-bold px-8">
          Return Home
        </Button>
      </Link>
    </div>
  );
}
