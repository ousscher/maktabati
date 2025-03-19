// components/layouts/ProtectedLayout.jsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../navbar';
import Sidebar from '../sidebar';

const ProtectedLayout = ({ children }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if there's a token in localStorage
    const token = localStorage.getItem('token');    
    if (!token) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
    
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-maktabati-background-body dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; 
  }

  return (
    <div className="flex flex-col h-screen bg-maktabati-background-body dark:bg-gray-900">
      {/* <Navbar /> */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar/>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ProtectedLayout;