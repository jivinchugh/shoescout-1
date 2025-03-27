import { WordRotate } from "@/components/magicui/word-rotate";

export function WordRotateDemo() {
  return (
    <WordRotate
      className="text-4xl font-bold text-black dark:text-white sm:text-5xl md:text-6xl animate-slide-down [animation-delay:75ms]"
      words={["For Sneaker Enthusiasts", "For Fashionistas", "For Hypebeasts", "For Resellers"]}
    />
  );
}
