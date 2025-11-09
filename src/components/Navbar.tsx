// src/components/ui/Navbar.tsx

import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Battery, Menu, X, LogOut, User as UserIcon, LayoutDashboard, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext"; 

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const { user, profile, signOut } = useAuth();

  const navLinks = [];

  // --- FIX 1 ---
  // Add 'profile?' to safely check the role
  if (user && profile?.role === 'admin') {
    navLinks.push({ to: "/admin", label: "Admin" });
    navLinks.push({ to: "/kiosks", label: "Kiosk Map" });
  } else if (user) {
    // Regular User Links
    navLinks.push({ to: "/home", label: "Home" });
    navLinks.push({ to: "/kiosks", label: "Find Kiosks" });
    navLinks.push({ to: "/dashboard", label: "Dashboard" });
  } else {
    // Logged-out User Links
    navLinks.push({ to: "/home", label: "Home" });
    navLinks.push({ to: "/kiosks", label: "Find Kiosks" });
  }

  const handleLogout = () => {
    signOut();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const getInitials = (name?: string | null, email?: string | null) => {
    if (name) {
      const parts = name.split(' ');
      return (parts[0]?.[0] || '' + parts[1]?.[0] || '').toUpperCase();
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          
          <Link to={user ? "/home" : "/"} className="flex items-center gap-2 transition-transform hover:scale-105">
            <Battery className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              SwapCharge
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === link.to
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Profile Dropdown */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      {/* --- FIX 2 (add 'profile?.') --- */}
                      <AvatarImage src={user.user_metadata?.avatar_url} alt={profile?.full_name || profile?.email} />
                      <AvatarFallback>{getInitials(profile?.full_name, profile?.email)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      {/* --- FIX 3 (the error you saw) --- */}
                      <p className="text-sm font-medium leading-none">
                        {profile?.full_name || "Welcome"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {profile?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {/* --- FIX 4 (add 'profile?.') --- */}
                  {profile?.role === 'admin' ? (
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      <span>Admin</span>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // User is logged out, show Sign In
              <Link to="/">
                <Button>Sign In</Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 animate-in slide-in-from-top">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`block text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === link.to
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <Button className="w-full" variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            ) : (
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full">Sign In</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;