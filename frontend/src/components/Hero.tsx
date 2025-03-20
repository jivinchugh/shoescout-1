
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-[10%] -top-[10%] h-[40%] w-[50%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute -right-[10%] bottom-[10%] h-[40%] w-[50%] rounded-full bg-primary/20 blur-[120px]" />
      </div>

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Main Heading with Animated Entrance */}
          <div className="inline-block animate-slide-down rounded-full bg-secondary px-4 py-1.5 text-sm font-medium text-secondary-foreground">
            Find the best shoe deals across the web
          </div>
          
          <h1 className="mt-6 text-balance font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl animate-slide-down [animation-delay:75ms]">
            <span className="text-gradient">Smart Price Comparison</span> 
            <br />
            For Sneaker Enthusiasts
          </h1>
          
          <p className="mt-6 text-lg text-muted-foreground animate-slide-down [animation-delay:150ms]">
            We aggregate prices from trusted resellers
            to help you find the best deals on your favorite shoes.
          </p>
          
          {/* Call to Action */}
          <div className="mt-10 flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 animate-slide-down [animation-delay:200ms]">
            <a
              href="#features"
              className="group flex items-center justify-center rounded-full bg-primary px-6 py-3 text-base font-medium text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:translate-y-[-2px]"
            >
              Explore Features
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
          
          {/* Featured Shoe Image */}
          <div className="relative mx-auto mt-16 max-w-3xl animate-scale-in [animation-delay:300ms]">
            <div className="aspect-[16/9] rounded-2xl bg-gradient-to-br from-secondary via-accent to-secondary p-2 shadow-xl md:p-3">
              <div className="relative overflow-hidden rounded-xl bg-card">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-primary/10 p-px"></div>
                <img
                  src="https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1625&q=80"
                  alt="Sneaker collection"
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
