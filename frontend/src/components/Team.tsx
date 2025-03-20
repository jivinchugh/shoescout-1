
import { Github, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

const team = [
  {
    name: 'Jivin Chugh',
    role: 'Back-End Dev',
    github: 'jivinchugh',
    email: 'jchugh@myseneca.ca',
    avatar: 'https://avatars.githubusercontent.com/u/106029065?v=4',
  },
  {
    name: 'Amitoj Uppal',
    role: 'Front-End Dev',
    github: 'auppal12',
    email: 'auppal12@myseneca.ca',
    avatar: 'https://avatars.githubusercontent.com/u/122369522?v=4',
  },
  {
    name: 'Madhav Rajpal',
    role: 'Front-End Dev',
    github: 'maddySeneca',
    email: 'mrajpal4@myseneca.ca',
    avatar: 'https://avatars.githubusercontent.com/u/158625426?v=4',
  },
  {
    name: 'Nand Patel',
    role: 'Database Specialist',
    github: 'Nand1904',
    email: 'npatel389@myseneca.ca',
    avatar: 'https://avatars.githubusercontent.com/u/97470256?v=4',
  },
];

export function Team() {
  return (
    <section id="team" className="relative py-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute right-[5%] top-[10%] h-[30%] w-[30%] rounded-full bg-secondary blur-[100px]" />
      </div>

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Meet the <span className="text-gradient">Team</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Our talented developers working together to build the best sneaker price comparison platform.
          </p>
        </div>

        <div className="mx-auto mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member, index) => (
            <div
              key={index}
              className={cn(
                'group relative overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all duration-300 hover:shadow-lg',
                'animate-fade-in [animation-delay:var(--delay)]'
              )}
              style={{ '--delay': `${index * 100 + 100}ms` } as React.CSSProperties}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              
              <div className="p-6">
                <h3 className="font-display text-xl font-semibold">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
                
                <div className="mt-4 flex space-x-3">
                  <a
                    href={`https://github.com/${member.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-colors hover:bg-primary hover:text-white"
                  >
                    <Github className="h-4 w-4" />
                    <span className="sr-only">GitHub</span>
                  </a>
                  <a
                    href={`mailto:${member.email}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-colors hover:bg-primary hover:text-white"
                  >
                    <Mail className="h-4 w-4" />
                    <span className="sr-only">Email</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
