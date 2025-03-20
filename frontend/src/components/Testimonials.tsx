
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const testimonials = [
  {
    content:
      "I found a pair of Jordan 1s for $50 less than I would have paid elsewhere. This site is a game-changer for sneakerheads!",
    author: {
      name: 'Alex Morgan',
      role: 'Sneaker Collector',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    rating: 5,
  },
  {
    content:
      "The price comparison saved me a ton of money on my last three purchases. The interface is clean and the information is accurate.",
    author: {
      name: 'Sarah Chen',
      role: 'Casual Buyer',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    rating: 5,
  },
  {
    content:
      "I appreciate how easy it is to compare prices across different platforms. It's become an essential tool in my sneaker shopping routine.",
    author: {
      name: 'Marcus Johnson',
      role: 'Reseller',
      avatar: 'https://randomuser.me/api/portraits/men/86.jpg',
    },
    rating: 4,
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="relative py-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[10%] top-[30%] h-[40%] w-[40%] rounded-full bg-accent blur-[130px]" />
      </div>

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Loved by <span className="text-gradient">Sneaker Enthusiasts</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Don't just take our word for it — hear what our users have to say about their experience.
          </p>
        </div>

        <div className="mx-auto mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={cn(
                'group rounded-2xl border border-border bg-card p-8 shadow-soft transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]',
                'animate-fade-in [animation-delay:var(--delay)]'
              )}
              style={{ '--delay': `${index * 100 + 100}ms` } as React.CSSProperties}
            >
              <div className="flex space-x-1 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'h-5 w-5',
                      i < testimonial.rating ? 'fill-primary text-primary' : 'fill-muted text-muted'
                    )}
                  />
                ))}
              </div>
              
              <blockquote className="text-foreground">
                "{testimonial.content}"
              </blockquote>
              
              <div className="mt-6 flex items-center">
                <img
                  src={testimonial.author.avatar}
                  alt={testimonial.author.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div className="ml-4">
                  <p className="font-medium">{testimonial.author.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.author.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
