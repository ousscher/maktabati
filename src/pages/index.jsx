import Hero from "@/components/home/hero";

export default function Home() {
    return (
        <>
          <Hero />
        </>
    );
}

export async function getStaticProps(context) {
    return {
        props: {
            messages: (await import(`../../public/locales/${context.locale}.json`)).default
        }
    };
}