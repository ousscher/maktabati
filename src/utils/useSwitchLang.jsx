import { useRouter } from "next/router";

export default function useSwitchLang() {
    const router = useRouter();

    const switchLocale = (newLocale) => {
        router.push({
            pathname: router.pathname,
            query: router.query
        }, router.asPath, { locale: newLocale });
    };

    return { switchLocale };
}