// src/pages/LoginPage.tsx

import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Battery, Shield, User } from 'lucide-react';
import { useEffect } from 'react';

export default function LoginPage() {
  const navigate = useNavigate();

  // This clears any "login" when you visit the page
  useEffect(() => {
    sessionStorage.removeItem('authRole');
  }, []);

  const handleLogin = (role: 'user' | 'admin') => {
    // 1. We "fake" the login by saving the role in the browser's session
    sessionStorage.setItem('authRole', role);

    // 2. We navigate to the correct page
    if (role === 'admin') {
      navigate('/admin');
    } else {
      // We'll move your old homepage to '/home' in the next steps
      navigate('/home'); 
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Battery className="h-12 w-12 text-primary mx-auto mb-4" />
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Welcome to SwapCharge
          </CardTitle>
          <CardDescription>Please select your role to continue</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            size="lg" 
            className="w-full" 
            onClick={() => handleLogin('user')}
          >
            <User className="h-5 w-5 mr-2" />
            Sign In as User
          </Button>
          <Button 
            size="lg" 
            className="w-full" 
            variant="outline"
            onClick={() => handleLogin('admin')}
          >
            <Shield className="h-5 w-5 mr-2" />
            Sign In as Admin
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}