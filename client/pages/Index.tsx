import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/home/Hero";
import { FeaturedProperties } from "@/components/home/FeaturedProperties";
import { Services } from "@/components/home/Services";
import { Benefits } from "@/components/home/Benefits";
import { HowItWorks } from "@/components/home/HowItWorks";
import { ContactForm } from "@/components/home/ContactForm";

export default function Index() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F7F8FA] pb-16 md:pb-0 selection:bg-[#1B4965]/15 selection:text-[#1B4965]">
      <Header />
      <main className="flex-1">
        <Hero />
        <FeaturedProperties />
        <Services />
        <Benefits />
        <HowItWorks />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}
