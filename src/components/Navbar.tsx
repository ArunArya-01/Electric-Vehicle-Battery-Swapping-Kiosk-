import { Link, useLocation, useNavigate } from "react-router-dom"; // 1. Import useNavigate
import { Button } from "@/components/ui/button";
import { Battery, Menu, X, LogOut } from "lucide-react"; // 2. Import LogOut icon
import { useState } from "react";

const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // 3. Add useNavigate
  const navigate = useNavigate();

  // 4. Check the user's role from sessionStorage
  const authRole = sessionStorage.getItem('authRole');

  const navLinks = [
    // We'll conditionally add links based on role
  ];

  // 5. Build the nav links based on the role
  if (authRole === 'admin') {
    navLinks.push({ to: "/admin", label: "Admin Dashboard" });
    navLinks.push({ to: "/kiosks", label: "Kiosk Map" });
  } else if (authRole === 'user') {
    navLinks.push({ to: "/home", label: "Home" });
    navLinks.push({ to: "/kiosks", label: "Find Kiosks" });
    navLinks.push({ to: "/dashboard", label: "Dashboard" });
  }
  // If no role (logged out), the navLinks array will be empty or 
  // you can add a default "Home" link. Let's add the ones from your homepage:
  if (!authRole) {
    navLinks.push({ to: "/home", label: "Home" });
    navLinks.push({ to: "/kiosks", label: "Find Kiosks" });
    navLinks.push({ to: "/dashboard", label: "Dashboard" });
  }

  // 6. Create the Logout function
  const handleLogout = () => {
    sessionStorage.removeItem('authRole'); // Clear the "fake" login
    setMobileMenuOpen(false);
    navigate('/'); // Send user to the login page
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to={authRole ? "/home" : "/"} className="flex items-center gap-2 transition-transform hover:scale-105">
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

            {/* 7. Show "Logout" or "Sign In" button */}
            {authRole ? (
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            ) : (
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

            {/* 8. Show mobile "Logout" or "Sign In" button */}
            {authRole ? (
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