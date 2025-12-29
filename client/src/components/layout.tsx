import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import { Package, Truck, MapPin, User, LogOut, Sun, Moon, Menu, X, Shield } from "lucide-react";
import { useState } from "react";

function Logo() {
  return (
    <Link href="/">
      <div className="flex items-center gap-3 cursor-pointer" data-testid="link-home-logo">
        <div className="w-12 h-9 bg-gradient-to-r from-accent to-orange-300 rounded-md flex items-center justify-center">
          <span className="text-primary font-black text-sm">FDX</span>
        </div>
        <div className="hidden sm:block">
          <div className="font-extrabold text-lg leading-tight">FedExpress</div>
          <div className="text-xs text-muted-foreground">Reliable global shipping</div>
        </div>
      </div>
    </Link>
  );
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="text-primary-foreground/90 hover:text-accent hover:bg-white/10"
      data-testid="button-theme-toggle"
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </Button>
  );
}

function NavLinks({ onItemClick }: { onItemClick?: () => void }) {
  const [location] = useLocation();
  const { isAuthenticated, isAdmin, logout } = useAuth();

  const links = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/tracking", label: "Track" },
    { href: "/about", label: "About" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  return (
    <>
      {links.map((link) => (
        <Link key={link.href} href={link.href}>
          <span
            className={`font-semibold transition-colors cursor-pointer ${
              isActive(link.href)
                ? "text-accent"
                : "text-primary-foreground/90 hover:text-accent"
            }`}
            onClick={onItemClick}
            data-testid={`link-nav-${link.label.toLowerCase()}`}
          >
            {link.label}
          </span>
        </Link>
      ))}
      {isAuthenticated ? (
        <>
          <Link href="/dashboard">
            <span
              className={`font-semibold transition-colors cursor-pointer ${
                isActive("/dashboard")
                  ? "text-accent"
                  : "text-primary-foreground/90 hover:text-accent"
              }`}
              onClick={onItemClick}
              data-testid="link-nav-dashboard"
            >
              Dashboard
            </span>
          </Link>
          {isAdmin && (
            <Link href="/admin">
              <span
                className={`font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                  isActive("/admin")
                    ? "text-accent"
                    : "text-primary-foreground/90 hover:text-accent"
                }`}
                onClick={onItemClick}
                data-testid="link-nav-admin"
              >
                <Shield className="h-4 w-4" />
                Admin
              </span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              logout();
              onItemClick?.();
            }}
            className="font-semibold text-primary-foreground/90 hover:text-accent hover:bg-white/10"
            data-testid="button-logout"
          >
            <LogOut className="h-4 w-4 mr-1" />
            Logout
          </Button>
        </>
      ) : (
        <Link href="/login">
          <Button
            className={`${isActive("/login") ? "bg-accent text-accent-foreground" : "bg-white/10 text-primary-foreground hover:bg-white/20"}`}
            size="sm"
            onClick={onItemClick}
            data-testid="link-nav-login"
          >
            <User className="h-4 w-4 mr-1" />
            Login
          </Button>
        </Link>
      )}
    </>
  );
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-primary to-primary/85 text-primary-foreground shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo />
          
          <nav className="hidden md:flex items-center gap-6">
            <NavLinks />
            <ThemeToggle />
          </nav>

          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 flex flex-col gap-3">
            <NavLinks onItemClick={() => setMobileMenuOpen(false)} />
          </nav>
        )}
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-7 bg-gradient-to-r from-accent to-orange-300 rounded flex items-center justify-center">
                <span className="text-primary font-black text-xs">FDX</span>
              </div>
              <span className="font-bold text-lg">FedExpress</span>
            </div>
            <p className="text-muted-foreground text-sm max-w-md">
              This is a demonstration project showcasing shipping logistics functionality. 
              Not affiliated with or endorsed by FedEx or DHL.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/services"><span className="hover:text-accent cursor-pointer" data-testid="link-footer-services">Our Services</span></Link>
              <Link href="/tracking"><span className="hover:text-accent cursor-pointer" data-testid="link-footer-tracking">Track Package</span></Link>
              <Link href="/about"><span className="hover:text-accent cursor-pointer" data-testid="link-footer-about">About Us</span></Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Features</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-accent" />
                Express Shipping
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent" />
                Real-time Tracking
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-accent" />
                Global Delivery
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground">
          <p>Reliable global shipping. Built with love.</p>
        </div>
      </div>
    </footer>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
