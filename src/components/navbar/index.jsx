// components/navbar/index.jsx
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useSwitchLang from '@/utils/useSwitchLang';
import { useTranslations } from 'next-intl';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const t = useTranslations('Navbar');
  const { switchLocale, locale } = useSwitchLang();

  useEffect(() => {
    // Check if user token exists in local storage
    const token = localStorage.getItem('userToken');
    if (token) {
      setIsAuthenticated(true);
      // You might want to fetch user profile data here
      // For now we'll use a placeholder
      setUserProfile({
        name: 'User Name',
        avatar: '/images/avatar-placeholder.png' 
      });
    }
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    // Optionally save preference to localStorage
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="font-main text-maktabati-text-normal_text dark:text-white text-2xl font-bold">
            Maktabati
          </Link>
        </div>
        
        <div className="flex items-center space-x-6">
          {/* Language Toggle */}
          <div className="flex gap-2">
            <button 
              className={`px-3 py-1 rounded text-sm ${locale === 'en' ? 'bg-green-500 text-white' : 'bg-green-200 text-gray-700'}`} 
              onClick={() => switchLocale('en')}
            >
              EN
            </button>
            <button 
              className={`px-3 py-1 rounded text-sm ${locale === 'fr' ? 'bg-green-500 text-white' : 'bg-green-200 text-gray-700'}`} 
              onClick={() => switchLocale('fr')}
            >
              FR
            </button>
          </div>
          
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 text-gray-700 dark:text-gray-300" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
                className="hidden dark:block"
              />
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" 
                className="block dark:hidden"
              />
            </svg>
          </button>
          
          {/* User Profile or Login Button */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{userProfile?.name}</span>
              <div className="h-8 w-8 rounded-full overflow-hidden">
                <Image 
                  src={userProfile?.avatar} 
                  alt="User profile" 
                  width={32} 
                  height={32} 
                  className="object-cover"
                />
              </div>
            </div>
          ) : (
            <Link 
              href="/login" 
              className="text-sm font-medium text-maktabati-text-normal_text dark:text-white hover:text-green-600 dark:hover:text-green-400"
            >
              {t('login')}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;