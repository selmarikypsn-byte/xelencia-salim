import { Layout } from "@/components/Layout/Layout";
import { HeroSection } from "@/components/Home/HeroSection";
import { BenefitsSection } from "@/components/Home/BenefitsSection";

const Home = () => {
  return (
    <Layout>
      <HeroSection />
      <BenefitsSection />
    </Layout>
  );
};

export default Home;