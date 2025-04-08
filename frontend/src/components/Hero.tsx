import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import { MarqueeDemo } from "./MovingBrands";
import { WordRotateDemo } from "./WordRotate";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";

export function Hero() {
  const { loginWithRedirect } = useAuth0();
  return (
    <section className="relative min-h-screen w-full overflow-hidden pt-20 pb md:pt-20 md:pb">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-[10%] -top-[10%] h-[40%] w-[50%] rounded-full bg-primary/10 blur-[120px]" />
        {/* <div className="absolute -right-[10%] bottom-[10%] h-[40%] w-[50%] rounded-full bg-primary/20 blur-[120px]" /> */}
      </div>

      <div className="mt-0 container relative mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-balance font-display sm:mt-6 md:mt-8 lg:mt-8 xl:mt-8 2xl:mt-16 text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl animate-slide-down [animation-delay:75ms]">
            <span className="text-gradient">Smart Price Comparison</span>
            <br />
            <WordRotateDemo />
          </h1>

          <p className="mt-6 text-lg text-muted-foreground animate-slide-down [animation-delay:150ms]">
            We aggregate prices from trusted resellers to help you find the best
            deals on your favorite shoes.
          </p>

          {/* Call to Action */}

          <br />
          <InteractiveHoverButton>Get Started</InteractiveHoverButton>
          {/* Featured Shoe Image */}

          <br />
          <br />
          <br />
          <MarqueeDemo />
        </div>
      </div>
    </section>
  );
}
