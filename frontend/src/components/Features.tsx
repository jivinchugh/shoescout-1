
import { ArrowRight, BarChart3, Compass, Globe, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BentoDemo } from './BentoFeatures';

const features = [
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: 'Price Comparison',
    description: 'Fetches and compares prices for a specific shoe from trusted reseller platforms to display the best available price.',
  },
  {
    icon: <Compass className="h-6 w-6" />,
    title: 'Shoe Description',
    description: 'Provides detailed descriptions of the selected shoe, including brand, model, and specifications.',
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: 'High-Quality Images',
    description: 'Displays images of the shoe to help users verify their choice visually.',
  },
  {
    icon: <Globe className="h-6 w-6" />,
    title: 'Direct to Reseller',
    description: 'Directs the user to reseller\'s website so that the user can buy shoes directly from there.',
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-2 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute right-[10%] top-[20%] h-[30%] w-[40%] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Designed for <span className="text-gradient">Sneakerheads</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Find the best deals across all major sneaker reselling platforms,
            all in one place.
          </p>
        </div>

        
        <BentoDemo />
      </div>
    </section>
  );
}
