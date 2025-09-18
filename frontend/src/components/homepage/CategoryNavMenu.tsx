import * as React from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const menCategories = {
  sneakers: [
    "Adidas",
    "Air Jordan",
    "ASICS",
    "Mihara Yasuhiro",
    "New Balance",
    "Nike",
    "Yeezy",
  ],
  shoes: [
    "Birkenstock",
    "Crocs",
    "Dr. Martens",
    "Gucci",
    "Timberland",
    "UGG",
  ],
  apparel: [
    "BAPE Apparel",
    "Denim Tears",
    "FOG Essentials",
    "Nike Apparel",
    "Sp5der",
    "Supreme Apparel",
    "Travis Scott",
  ],
  accessories: [
    "BAPE Accessories",
    "Casio G-Shock",
    "Gucci",
    "Goyard",
    "Louis Vuitton",
    "OFF-WHITE",
    "Supreme",
  ],
  shopBy: [
    "T-Shirts",
    "Belts",
    "Bottoms",
    "Jackets & Coats",
    "Sunglasses",
    "Wallets",
    "Watches",
  ]
};

const womenCategories = {
  sneakers: [
    "Adidas",
    "Air Jordan",
    "ASICS",
    "New Balance",
    "Nike",
    "Yeezy",
  ],
  shoes: [
    "Birkenstock",
    "Dr. Martens",
    "Gucci",
    "UGG",
  ],
  apparel: [
    "FOG Essentials",
    "Nike Apparel",
    "Supreme Apparel",
  ],
  accessories: [
    "Casio G-Shock",
    "Gucci",
    "Louis Vuitton",
  ],
  shopBy: [
    "Dresses",
    "Tops",
    "Bottoms",
    "Jackets",
    "Handbags",
    "Jewelry",
    "Watches",
  ]
};

const kidsCategories = {
  sneakers: [
    "Adidas",
    "Air Jordan",
    "Nike",
  ],
  shoes: [
    "Crocs",
    "UGG",
  ],
  apparel: [
    "Nike Apparel",
    "Supreme Apparel",
  ],
  accessories: [
    "Casio G-Shock",
  ],
  shopBy: [
    "T-Shirts",
    "Shorts",
    "Hoodies",
    "Hats",
    "Backpacks",
  ]
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export function CategoryNavMenu() {
  return (
    <NavigationMenu className="max-w-full justify-center">
      <NavigationMenuList className="space-x-2">
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent">Men</NavigationMenuTrigger>
          <NavigationMenuContent className="w-screen left-0 absolute">
            <div className="w-full bg-popover border-b shadow-lg animate-in fade-in-10">
              <div className="container mx-auto py-6 grid grid-cols-5 gap-8">
                <div>
                  <h4 className="mb-3 text-lg font-medium leading-none border-b pb-2">Men's Sneakers</h4>
                  <ul className="space-y-2">
                    {menCategories.sneakers.map((item) => (
                      <li key={item}>
                        <NavigationMenuLink
                          className="text-sm hover:text-shoescout-purple block py-1"
                          href="#"
                        >
                          {item}
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="mb-3 text-lg font-medium leading-none border-b pb-2">Men's Shoes</h4>
                  <ul className="space-y-2">
                    {menCategories.shoes.map((item) => (
                      <li key={item}>
                        <NavigationMenuLink
                          className="text-sm hover:text-shoescout-purple block py-1"
                          href="#"
                        >
                          {item}
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="mb-3 text-lg font-medium leading-none border-b pb-2">Men's Apparel</h4>
                  <ul className="space-y-2">
                    {menCategories.apparel.map((item) => (
                      <li key={item}>
                        <NavigationMenuLink
                          className="text-sm hover:text-shoescout-purple block py-1"
                          href="#"
                        >
                          {item}
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="mb-3 text-lg font-medium leading-none border-b pb-2">Men's Accessories</h4>
                  <ul className="space-y-2">
                    {menCategories.accessories.map((item) => (
                      <li key={item}>
                        <NavigationMenuLink
                          className="text-sm hover:text-shoescout-purple block py-1"
                          href="#"
                        >
                          {item}
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </div>
                
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent">Women</NavigationMenuTrigger>
          <NavigationMenuContent className="w-screen left-0 absolute">
            <div className="w-full bg-popover border-b shadow-lg animate-in fade-in-10">
              <div className="container mx-auto py-6 grid grid-cols-5 gap-8">
                <div>
                  <h4 className="mb-3 text-lg font-medium leading-none border-b pb-2">Women's Sneakers</h4>
                  <ul className="space-y-2">
                    {womenCategories.sneakers.map((item) => (
                      <li key={item}>
                        <NavigationMenuLink
                          className="text-sm hover:text-shoescout-purple block py-1"
                          href="#"
                        >
                          {item}
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="mb-3 text-lg font-medium leading-none border-b pb-2">Women's Shoes</h4>
                  <ul className="space-y-2">
                    {womenCategories.shoes.map((item) => (
                      <li key={item}>
                        <NavigationMenuLink
                          className="text-sm hover:text-shoescout-purple block py-1"
                          href="#"
                        >
                          {item}
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="mb-3 text-lg font-medium leading-none border-b pb-2">Women's Apparel</h4>
                  <ul className="space-y-2">
                    {womenCategories.apparel.map((item) => (
                      <li key={item}>
                        <NavigationMenuLink
                          className="text-sm hover:text-shoescout-purple block py-1"
                          href="#"
                        >
                          {item}
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="mb-3 text-lg font-medium leading-none border-b pb-2">Women's Accessories</h4>
                  <ul className="space-y-2">
                    {womenCategories.accessories.map((item) => (
                      <li key={item}>
                        <NavigationMenuLink
                          className="text-sm hover:text-shoescout-purple block py-1"
                          href="#"
                        >
                          {item}
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </div>
                
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent">Kids</NavigationMenuTrigger>
          <NavigationMenuContent className="w-screen left-0 absolute">
            <div className="w-full bg-popover border-b shadow-lg animate-in fade-in-10">
              <div className="container mx-auto py-6 grid grid-cols-5 gap-8">
                <div>
                  <h4 className="mb-3 text-lg font-medium leading-none border-b pb-2">Kids' Sneakers</h4>
                  <ul className="space-y-2">
                    {kidsCategories.sneakers.map((item) => (
                      <li key={item}>
                        <NavigationMenuLink
                          className="text-sm hover:text-shoescout-purple block py-1"
                          href="#"
                        >
                          {item}
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="mb-3 text-lg font-medium leading-none border-b pb-2">Kids' Shoes</h4>
                  <ul className="space-y-2">
                    {kidsCategories.shoes.map((item) => (
                      <li key={item}>
                        <NavigationMenuLink
                          className="text-sm hover:text-shoescout-purple block py-1"
                          href="#"
                        >
                          {item}
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="mb-3 text-lg font-medium leading-none border-b pb-2">Kids' Apparel</h4>
                  <ul className="space-y-2">
                    {kidsCategories.apparel.map((item) => (
                      <li key={item}>
                        <NavigationMenuLink
                          className="text-sm hover:text-shoescout-purple block py-1"
                          href="#"
                        >
                          {item}
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="mb-3 text-lg font-medium leading-none border-b pb-2">Kids' Accessories</h4>
                  <ul className="space-y-2">
                    {kidsCategories.accessories.map((item) => (
                      <li key={item}>
                        <NavigationMenuLink
                          className="text-sm hover:text-shoescout-purple block py-1"
                          href="#"
                        >
                          {item}
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </div>
                
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}