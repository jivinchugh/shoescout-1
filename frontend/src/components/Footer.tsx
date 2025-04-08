import { cn } from "@/lib/utils";

interface FooterProps {
  hideLinks?: boolean;
}

export function Footer({ hideLinks = false }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-border bg-card py-12">
      <div className="container mx-auto px-4">
        {!hideLinks ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="font-display text-xl font-semibold text-gradient">
                ShoeScout
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Finding the best prices for sneaker enthusiasts across trusted reseller platforms.
              </p>
            </div>
            
            <div>
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider">
                Platform
              </h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <a href="#features" className="text-muted-foreground transition-colors hover:text-primary">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#testimonials" className="text-muted-foreground transition-colors hover:text-primary">
                    Testimonials
                  </a>
                </li>
                <li>
                  <a href="#team" className="text-muted-foreground transition-colors hover:text-primary">
                    Team
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider">
                Resources
              </h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <a href="#" className="text-muted-foreground transition-colors hover:text-primary">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground transition-colors hover:text-primary">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground transition-colors hover:text-primary">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider">
                Connect
              </h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <a href="#" className="text-muted-foreground transition-colors hover:text-primary">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground transition-colors hover:text-primary">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground transition-colors hover:text-primary">
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="font-display text-xl font-semibold text-gradient">
              ShoeScout
            </div>
          </div>
        )}
        
        <div className={cn("mt-12 flex flex-col items-center justify-between border-t border-border pt-8 md:flex-row", hideLinks && "mt-4")}>
          <p className="text-sm text-muted-foreground">
            &copy; {year} ShoeScout. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
