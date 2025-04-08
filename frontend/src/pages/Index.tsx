
import { Layout } from '@/components/Layout';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { Testimonials } from '@/components/Testimonials';
import { Team } from '@/components/Team';
import { useAuth0 } from "@auth0/auth0-react";
import ShoeSizeForm from '@/components/ShoeSizeForm';
import {BentoDemo} from '@/components/BentoFeatures';
import ShoeSearch from '@/components/ShoeSearch';


const Index = () => {
  
  const { isAuthenticated } = useAuth0();
  return (
    <Layout>
      <Hero />
      <Features />
      <Testimonials />
      
    </Layout>
  );
};

export default Index;
