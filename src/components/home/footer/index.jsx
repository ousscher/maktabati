import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="flex max-md:flex-col items-center justify-between px-24 py-4 bg-transparent">
      
      {/* Left - Maktabati Logo */}
      <div className="flex items-center">
        <Image src="/images/logo.png" alt="Maktabati Logo" width={80} height={50} />
      </div>

      {/* Center - Links & Copyright */}
      <div className="text-gray-500 text-sm flex space-x-6 max-md:hidden">
        <p>© 2025 Maktabati.</p>
        <Link href="/privacy-notice" className="text-teal-600 hover:underline">{t("privacy")}</Link>
        <Link href="/terms-of-service" className="text-teal-600 hover:underline">{t("terms")}</Link>
        <Link href="/status" className="text-teal-600 hover:underline">{t("status")}</Link>
      </div>

      {/* Right - Social Media Icons */}
      <div className="flex space-x-2 py-5">
        <Link href="https://www.instagram.com/maktabati.app/" className="w-9 h-9 flex items-center justify-center border-2 border-teal-500 rounded-full hover:bg-teal-500 hover:text-white transition">
          <FaInstagram className="text-teal-800" size={14} />
        </Link>
        <Link href="https://twitter.com" className="w-9 h-9 flex items-center justify-center border-2 border-teal-500 rounded-full hover:bg-teal-500 hover:text-white transition">
          <FaTwitter className="text-teal-800" size={14} />
        </Link>
        <Link href="https://linkedin.com" className="w-9 h-9 flex items-center justify-center border-2 border-teal-500 rounded-full hover:bg-teal-500 hover:text-white transition">
          <FaLinkedinIn className="text-teal-800" size={14} />
        </Link>
      </div>

      <div className="text-gray-500 text-sm flex justify-center space-x-4 md:hidden">
        <p>© 2025 Maktabati.</p>
        <Link href="/privacy-notice" className="text-teal-600 hover:underline">{t("privacy")}</Link>
        <Link href="/terms-of-service" className="text-teal-600 hover:underline">{t("terms")}</Link>
        <Link href="/status" className="text-teal-600 hover:underline">{t("status")}</Link>
      </div>

    </footer>
  );
}
