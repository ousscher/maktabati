import { NextIntlClientProvider } from "next-intl";
import { useRouter } from "next/router";
import "@/styles/globals.css";
import "@/styles/fonts.css";
import { ProfileProvider } from "@/contexts/ProfileContext";
import { ToastContainer } from "react-toastify";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  
  return (
    <ProfileProvider>
      <NextIntlClientProvider
        locale={router.locale}
        timeZone="Africa/Algiers"
        messages={pageProps.messages}
      >
        <Component {...pageProps} />
        <ToastContainer position="top-center" />
      </NextIntlClientProvider>
    </ProfileProvider>
  );
}
