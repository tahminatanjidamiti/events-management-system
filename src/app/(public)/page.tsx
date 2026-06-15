import AiSuggestions from "@/components/modules/Home/AiSuggessions";
import ConnectUser from "@/components/modules/Home/ConnectUser/ConnectUser";
import FAQ from "@/components/modules/Home/FAQ";
import FeaturedEvents from "@/components/modules/Home/FeaturedEvents";
import Hero from "@/components/modules/Home/Hero";
import Promotions from "@/components/modules/Home/Promotions";
import Services from "@/components/modules/Home/Services";
import { Testimonials } from "@/components/modules/Home/Testimonials";


export default function HomePage() {
  return (
    <div>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-50 h-50 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: "4s" }} />
      </div>
        <Hero />
      <FeaturedEvents />
      <ConnectUser />
      <Services />
      <Testimonials />
      <FAQ />
      <AiSuggestions />
      <Promotions />
    </div>
  );
}
