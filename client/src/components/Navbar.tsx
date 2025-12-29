import { Package, Menu, X } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Shipping", href: "#" },
    { name: "Tracking", href: "#" },
    { name: "Design & Print", href: "#" },
    { name: "Locations", href: "#" },
    { name: "Support", href: "#" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="container-custom mx-auto">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-brand-purple rounded-lg blur opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative bg-gradient-to-br from-brand-purple to-brand-accent p-2 rounded-lg text-white">
                <Package className="w-8 h-8" strokeWidth={1.5} />
              </div>
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-brand-purple">
              EXPRESS<span className="text-brand-orange">SHIP</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                className="text-sm font-semibold text-gray-600 hover:text-brand-purple transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-orange transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" className="font-semibold text-brand-purple hover:bg-brand-purple/5">
              Sign In
            </Button>
            <Button className="bg-brand-orange hover:bg-brand-orange/90 text-white font-bold shadow-lg shadow-brand-orange/20">
              Open Account
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-gray-600 hover:text-brand-purple"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b"
          >
            <div className="container-custom py-4 flex flex-col space-y-4">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href}
                  className="px-4 py-2 text-base font-semibold text-gray-700 hover:bg-brand-purple/5 rounded-lg"
                >
                  {link.name}
                </a>
              ))}
              <div className="h-px bg-gray-100 my-2" />
              <Button variant="ghost" className="w-full justify-start">Sign In</Button>
              <Button className="w-full bg-brand-orange text-white">Open Account</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
