
import { ArrowRight, BarChart3, Compass, Globe, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    <section id="features" className="relative py-24 overflow-hidden">
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

        <div className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-2">
          {features.map((feature, index) => (
            <div
              key={index}
              className={cn(
                'group relative rounded-2xl border border-border bg-card p-8 shadow-soft transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]',
                'animate-fade-in [animation-delay:var(--delay)]'
              )}
              style={{ '--delay': `${index * 100 + 100}ms` } as React.CSSProperties}
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                {feature.icon}
              </div>
              <h3 className="mb-3 text-xl font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 overflow-hidden rounded-2xl">
          <div className="relative mx-auto max-w-5xl animate-scale-in">
            <div className="aspect-[16/7] rounded-2xl bg-gradient-to-r from-primary/20 to-accent p-2 shadow-xl md:p-3">
              <div className="relative overflow-hidden rounded-xl bg-card">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-primary/10 p-px"></div>
                <img
                  src="https://images.unsplash.com/photo-1552346154-21d32810aba3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
                  alt="Sneaker marketplace app interface"
                  className="h-full w-full rounded-lg object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
