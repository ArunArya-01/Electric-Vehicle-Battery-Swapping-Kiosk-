import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Battery, Clock, MapPin, Zap, Shield, Leaf } from "lucide-react";
import Navbar from "@/components/Navbar";
import heroImage from "@/assets/hero-ev-swap.jpg";
import kioskImage from "@/assets/kiosk-exterior.jpg";

const Index = () => {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Complete battery swap in under 5 minutes",
    },
    {
      icon: MapPin,
      title: "Nationwide Network",
      description: "Find kiosks wherever you go",
    },
    {
      icon: Clock,
      title: "24/7 Available",
      description: "Swap batteries anytime, anywhere",
    },
    {
      icon: Leaf,
      title: "Eco-Friendly",
      description: "Sustainable energy for cleaner future",
    },
    {
      icon: Shield,
      title: "Safe & Secure",
      description: "Premium battery quality guaranteed",
    },
    {
      icon: Battery,
      title: "Smart Monitoring",
      description: "Real-time battery health tracking",
    },
  ];

  const stats = [
    { value: "5min", label: "Average Swap Time" },
    { value: "150+", label: "Active Kiosks" },
    { value: "50k+", label: "Happy Customers" },
    { value: "99.9%", label: "Uptime" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <Zap className="h-4 w-4" />
                  The Future of EV Charging
                </span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Swap Your{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  EV Battery
                </span>{" "}
                in Minutes
              </h1>
              <p className="text-xl text-muted-foreground">
                Skip the wait. Drive further. Join thousands of EV owners who have
                revolutionized their charging experience with instant battery swaps.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/kiosks">
                  <Button size="lg" className="shadow-lg hover:shadow-xl transition-all">
                    Find Nearest Kiosk
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="lg" variant="outline">
                    Get Started Free
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-3xl" />
              <img
                src={heroImage}
                alt="EV Battery Swapping Station"
                className="relative rounded-3xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-border bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                SwapCharge
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the next generation of EV charging with our innovative battery
              swapping technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-2 hover:border-primary/50 transition-all hover:shadow-lg group"
              >
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">
              Three simple steps to a fully charged EV
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Find a Kiosk",
                description: "Use our app to locate the nearest battery swapping station",
              },
              {
                step: "02",
                title: "Drive In",
                description: "Pull up to the automated kiosk and authenticate",
              },
              {
                step: "03",
                title: "Swap & Go",
                description: "Battery swapped in under 5 minutes. Continue your journey!",
              },
            ].map((step, index) => (
              <div key={index} className="text-center relative">
                <div className="text-6xl font-bold text-primary/20 mb-4">{step.step}</div>
                <h3 className="text-2xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
                {index < 2 && (
                  <div className="hidden md:block absolute top-12 -right-4 text-primary">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Experience the Future?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of satisfied EV owners and never wait for charging again
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="shadow-lg">
                  Create Free Account
                </Button>
              </Link>
              <Link to="/kiosks">
                <Button size="lg" variant="outline">
                  Explore Locations
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 SwapCharge. Powering the future of electric mobility.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
