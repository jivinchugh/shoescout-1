import { CalendarIcon, FileTextIcon } from "@radix-ui/react-icons";
import { BellIcon, Share2Icon,TrendingUpDown,Footprints, Users } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import AnimatedBeamMultipleOutputDemo from "@/components/animated-beam-multiple-outputs";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import { Marquee } from "@/components/magicui/marquee";
import { AnimatedListDemo } from "@/components/AnimatedPriceCompare";
import { AvatarCirclesDemo } from "./avatarCircles";
import { IconCloudDemo } from "./userCloud";


const files = [
  {
    
    img:"/ShoeImages/{935AA3F8-E0C6-4E1A-BC55-15A10FA87E79}.png"
  },
  {

    img:"/ShoeImages/{C1DCB87F-999B-4696-8FE7-0F5E48C22FA3}.png"

  },
  {
    
    img:"/ShoeImages/{CB989DF1-EAA5-42BF-82ED-62C2FA5D0A71}.png"

  },
  {
    
    img:"/ShoeImages/{A6D9EC9D-8D9B-4CCC-A140-88F16D6ED921}.png"

  },
  {
    
    img:"/ShoeImages/{F5B1100A-1639-4044-A4EE-B7D19FFC62F5}.png"

  },
];

const features = [
  {
    Icon: TrendingUpDown,
    name: "Price Comparison",
    description: "We fetch and compare prices in real-time.",
    href: "#",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-1",
    background: (
        <AnimatedListDemo className="absolute right-2 h-[300px] w-full scale-75 border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_0%,#000_100%)] group-hover:scale-90" />),
  },
  {
    Icon: Footprints,
    name: "Huge Variety",
    description: "We have a wide range of shoes from different brands to meet your taste.",
    href: "#",
    cta: "Explore more",
    className: "col-span-3 lg:col-span-2",
    background: (
        <Marquee
        pauseOnHover
        className="absolute top-5 [--duration:20s] [mask-image:linear-gradient(to_top,transparent_0%,#000_100%)]  "
      >
        {files.map((f, idx) => (
          <figure
            key={idx}
            className={cn(
              "relative w-52 h-70 cursor-pointer overflow-hidden rounded-xl border ",
              "border-primary bg-gray-950/[.01] hover:bg-gray-950/[.05]",
              "dark:border-primary dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
              "transform-gpu blur-[px] transition-all duration-300 ease-out hover:blur-none",
            )}
          >
            <div className="h-full w-full">
              <img 
                src={f.img} 
                alt="shoe" 
                className="w-full h-full object-cover"
              />
            </div>
          </figure>
        ))}
      </Marquee>
    ),
  },
  {
    Icon: Share2Icon,
    name: "Direct to Resellers",
    description: "We redirect you to multiple trusted resellers to get the best price on your favorite shoes.",
    href: "#",
    cta: "View Resellers",
    className: "col-span-3 lg:col-span-2",
    background: (
      <AnimatedBeamMultipleOutputDemo className="absolute right-2 top-4 h-[300px] border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_0%,#000_100%)] group-hover:scale-105" />
    ),
  },
  {
    Icon: Users,
    name: "Served 100+ users",
    description: "We have served over 100 users with the best deals on their favorite shoes.",
    className: "col-span-3 lg:col-span-1",
    href: "#testimonials",
    cta: "View Testimonials",
    background: (
        <div className="absolute inset-0 flex items-center justify-center pb-20">
        {/* <AvatarCirclesDemo className="w-full h-full" />
         */}
         <IconCloudDemo />
      </div>
    
    ),
  },
];

export function BentoDemo() {
  return (
    <section className="container mx-auto px-4 py-16">
      <BentoGrid className="max-w-6xl mx-auto">
        {features.map((feature, idx) => (
          <BentoCard key={idx} {...feature} />
        ))}
      </BentoGrid>
    </section>
  );
}
