import Nav from "./components/Nav";
import Hero from "./components/Hero";
import TrustStrip from "./components/TrustStrip";
import FeatureGrid from "./components/FeatureGrid";
import PlatformDownloads from "./components/PlatformDownloads";
import HowItWorks from "./components/HowItWorks";
import ScreenshotCarousel from "./components/ScreenshotCarousel";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Nav />
      <main>
        <Hero />
        <TrustStrip />
        <FeatureGrid />
        <PlatformDownloads />
        <HowItWorks />
        <ScreenshotCarousel />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

export default App;
