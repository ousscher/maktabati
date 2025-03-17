import Navbar from "@/components/home/navbar";
import HeroSection from "@/components/home/hero";
import FeaturesSection from "@/components/home/features";
import FAQSection from "@/components/home/faq";
import CTASection from "@/components/home/Ready";
import Footer from "@/components/home/footer";

export default function Home() {
    return (
        <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('/images/backgroud.png')` }}>
            <Navbar className="bg-transparent" />
            <HeroSection  className="bg-transparent"/>
            <FeaturesSection  className="bg-transparent"/>
            <FAQSection  className="bg-transparent"/>
            <CTASection className="bg-transparent"/>
            <Footer className="bg-transparent"/>
        </div>
    );
}


export async function getStaticProps(context) {
    return {
        props: {
            messages: (await import(`../../public/locales/${context.locale}.json`)).default
        }
    };
}