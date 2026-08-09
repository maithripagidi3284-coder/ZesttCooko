import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import StatsBar from "@/components/landing/StatsBar";
import CookingServices from "@/components/landing/CookingServices";
import HowItWorks from "@/components/landing/HowItWorks";
import Cuisines from "@/components/landing/Cuisines";
import Testimonials from "@/components/landing/Testimonials";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <StatsBar />
      <CookingServices />
      <HowItWorks />
      <Cuisines />
      <Testimonials />
      <Footer />
    </main>
  );
}