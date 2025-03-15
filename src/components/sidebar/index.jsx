import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

const Sidebar = () => {
  const t = useTranslations('Sidebar');
  const router = useRouter();

  const menuItems = [
    { id: 'home', label: t('home'), path: '/home', icon: '/images/icons/home.svg' },
    { id: 'library', label: t('library'), path: '/mylibrary', icon: '/images/icons/library.svg' },
    { id: 'writing-assistant', label: t('writingAssistant'), path: '/writing-assistant', icon: '/images/icons/assistant.svg' },
    { id: 'profile', label: t('profile'), path: '/profile', icon: '/images/icons/profile.svg' },
  ];

  const extraItems = [
    { id: 'added-recently', label: t('addedRecently'), path: '/added-recently', icon: '/images/icons/recent.svg' },
    { id: 'starred', label: t('starred'), path: '/starred', icon: '/images/icons/star.svg' },
    { id: 'trash', label: t('trash'), path: '/trash', icon: '/images/icons/trash.svg' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    router.push('/login');
  };

  return (
    <div className="w-64 h-screen bg-gray-100 p-5 flex flex-col justify-between shadow-md">
      <div className="flex flex-col items-center mb-6">
        <Image src="/images/logo.png" alt="Maktabati Logo" width={120} height={120} />
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <Link href={item.path} className={`flex items-center p-3 rounded-lg transition 
                ${router.pathname.startsWith(item.path) ? 'bg-teal-500 text-white' : 'text-gray-700 hover:bg-gray-200'}
              `}>
                <Image src={item.icon} alt={item.label} width={20} height={20} />
                <span className="ml-3">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <p className="text-gray-500 text-sm mb-2">{t('more')}</p>
          <ul className="space-y-2">
            {extraItems.map((item) => (
              <li key={item.id}>
                <Link href={item.path} className={`flex items-center p-3 rounded-lg transition 
                  ${router.pathname.startsWith(item.path) ? ' text-teal-500' : 'text-gray-700 '}
                `}>
                  <Image src={item.icon} alt={item.label} width={20} height={20} />
                  <span className="ml-3">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center p-3 rounded-lg hover:bg-red-100 transition"
      >
        <Image src="/images/icons/logout.svg" alt="Logout" width={20} height={20} />
        <span className="ml-3">{t('logout')}</span>
      </button>
    </div>
  );
};

export default Sidebar;
