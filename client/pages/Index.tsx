import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PhoneBanner } from "@/components/home/PhoneBanner";
import { Hero } from "@/components/home/Hero";
import { Services } from "@/components/home/Services";
import { Benefits } from "@/components/home/Benefits";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Testimonials } from "@/components/home/Testimonials";
import { ContactForm } from "@/components/home/ContactForm";

export default function Index() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-1">
        <Hero />
        <Services />
        <Benefits />
        <HowItWorks />
        <Testimonials />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}
