import React from 'react';
import { useLocation } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';

const LoginPage: React.FC = () => {
  const location = useLocation();
  const message = location.state?.message;
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary-50 to-white">
      <div className="w-full max-w-md space-y-8">
        {message && (
          <div className="rounded-md bg-success-50 p-4 mb-4">
            <div className="text-sm text-success-700">{message}</div>
          </div>
        )}
        
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary-600 flex items-center justify-center">
            <svg 
              className="h-10 w-10 mr-2" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M18 6v6a3 3 0 0 1-3 3h-1.5l-3 3v-3H9a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3Z"/>
              <path d="m18 15-3-3"/>
              <path d="M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
            </svg>
            DIGILING
          </h1>
          <h2 className="mt-2 text-lg font-medium text-gray-900">Digital Guidance and Counseling</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to your account to continue</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;