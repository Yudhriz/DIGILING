import React from "react";
import { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  // Check if current route is auth-related
  const isAuthPage = ["/login", "/register", "/forgot-password"].includes(
    location.pathname
  );

  if (isAuthPage) {
    return (
      <div className='min-h-screen bg-gray-50 flex flex-col justify-center'>
        {children}
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col'>
      <Toaster position='top-center' reverseOrder={false} />

      <Navbar />
      <main className='flex-grow'>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
