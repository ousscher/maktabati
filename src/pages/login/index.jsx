"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useTranslations } from "next-intl";
import useSwitchLang from "@/utils/useSwitchLang";
import axios from "axios";
import ProtectedLayout from "@/components/layout/ProtectedLayout";

export default function Login() {
  const { isAuthenticated, loading, setAuthToken } = useAuth();
  const [error, setError] = useState(null);
  const router = useRouter();
  const t = useTranslations("Login");
  const { switchLocale, locale } = useSwitchLang();
  
  useEffect(() => {
    if (isAuthenticated === true) {
      router.push("/home");
    }
    
    // Check if there's a theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, [isAuthenticated, router]);
  
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [hidePassword, setHidePassword] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await axios.post("/api/auth/login", {
        email: loginForm.email,
        password: loginForm.password,
      });
      const token = response.data.token;
      if (token) {
        setAuthToken(token);
        router.push("/admin/dashboard");
      }
    } catch (err) {
      setError(t("invalidCredentials"));
    }
  };

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  return (
    <main className="w-full flex">
      <div className="relative flex-1 hidden items-center justify-center h-screen bg-maktabati-background-body overflow-hidden lg:flex">
        <div className="relative z-10 w-full max-w-md flex flex-col justify-around items-center">
          {/* <img src="/logo.png" width={250} alt="logo" /> */}
          <div className="mt-16 space-y-3">
            <h3 className="text-maktabati-text-title text-3xl font-bold">
              {t("getStarted")}
            </h3>
          </div>
        </div>
        <div
          className="absolute inset-0 my-auto h-[500px]"
          style={{
            background:
              "linear-gradient(152.92deg, rgba(245, 191, 3, 0.1) 4.54%, rgba(255, 220, 100, 0.2) 34.2%, rgba(255, 245, 150, 0.1) 77.55%)",
            filter: "blur(118px)",
          }}
        ></div>
      </div>
      <div className="flex-1 flex items-center justify-center h-screen">
        {/* Language and Theme Toggles */}
        <div className="absolute right-6 top-6 flex items-center space-x-4">
          {/* Language Toggle */}
          <div className="flex gap-2">
            <button 
              className={`px-3 py-1 rounded text-sm ${locale === 'en' ? 'bg-maktabati-logo-primary text-maktabati-components-button-solid-default-text_color' : 'bg-maktabati-components-film_roll_rectangle-bg_color text-maktabati-text-normal_text'}`} 
              onClick={() => switchLocale('en')}
            >
              EN
            </button>
            <button 
              className={`px-3 py-1 rounded text-sm ${locale === 'fr' ? 'bg-maktabati-logo-primary text-maktabati-components-button-solid-default-text_color' : 'bg-maktabati-components-film_roll_rectangle-bg_color text-maktabati-text-normal_text'}`} 
              onClick={() => switchLocale('fr')}
            >
              FR
            </button>
          </div>
          
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full hover:bg-maktabati-components-film_roll_rectangle-bg_color transition-colors"
            aria-label="Toggle theme"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 text-maktabati-text-normal_text" 
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
        </div>

        <div className="max-w-sm w-full text-maktabati-text-normal_text space-y-5 px-4">
          <div className="text-center pb-8">
            {/* <img src="/logo.png" width={150} alt="logo" className="mx-auto" /> */}
            <div className="mt-5">
              <h3 className="text-maktabati-text-title text-2xl font-bold sm:text-3xl">
                {t("loginToAccount")}
              </h3>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="font-medium">{t("email")}</label>
              <input
                value={loginForm.email}
                onChange={(e) => {
                  setLoginForm({ ...loginForm, email: e.target.value });
                }}
                type="email"
                required
                placeholder={t("emailPlaceholder")}
                className="w-full mt-2 px-3 py-2 text-maktabati-text-title bg-transparent outline-none border focus:border-maktabati-logo-primary focus:ring-1 focus:ring-maktabati-logo-primary shadow-sm rounded-lg border-maktabati-border-border_color"
              />
            </div>
            <div>
              <label className="font-medium">{t("password")}</label>
              <div className="relative">
                <input
                  type={hidePassword ? "password" : "text"}
                  value={loginForm.password}
                  onChange={(e) => {
                    setLoginForm({ ...loginForm, password: e.target.value });
                  }}
                  placeholder={t("passwordPlaceholder")}
                  required
                  className="w-full mt-2 px-3 py-2 text-maktabati-text-title bg-transparent outline-none border focus:border-maktabati-logo-primary focus:ring-1 focus:ring-maktabati-logo-primary shadow-sm rounded-lg border-maktabati-border-border_color"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-4 bg-transparent"
                  onClick={() => setHidePassword(!hidePassword)}
                >
                  {hidePassword ? (
                    <svg
                      className="w-6 h-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {error && (
                <p className="text-maktabati-text-invalid_color text-sm mt-2">
                  {error}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-maktabati-logo-primary focus:ring-maktabati-logo-primary border-maktabati-border-border_color rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-maktabati-text-normal_text">
                  {t("rememberMe")}
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-maktabati-logo-primary hover:text-maktabati-components-button-solid-green-bg_color">
                  {t("forgotPassword")}
                </a>
              </div>
            </div>
            
            <button
              className="w-full px-4 py-2 text-maktabati-components-button-solid-default-text_color font-medium bg-maktabati-logo-primary hover:bg-maktabati-components-button-solid-green-bg_color active:bg-maktabati-components-button-solid-green-bg_color rounded-lg duration-150"
              type="submit"
            >
              {t("login")}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
export async function getStaticProps(context) {
  return {
      props: {
          messages: (await import(`../../../public/locales/${context.locale}.json`)).default
      }
  };
}