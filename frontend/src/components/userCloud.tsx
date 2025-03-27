import { IconCloud } from "@/components/magicui/icon-cloud";

const slugs = [
//   "typescript",
//   "javascript",
//   "dart",
//   "java",
//   "react",
//   "flutter",
//   "android",
//   "html5",
//   "css3",
//   "nodedotjs",
//   "express",
//   "nextdotjs",
//   "prisma",
//   "amazonaws",
//   "postgresql",
//   "firebase",
//   "nginx",
//   "vercel",
//   "testinglibrary",
//   "jest",
//   "cypress",
//   "docker",
//   "git",
//   "jira",
//   "github",
//   "gitlab",
//   "visualstudiocode",
//   "androidstudio",
//   "sonarqube",
//   "figma",
16860528

,20110627

,106103625

,59228569,

59442788,
59442786,
59442787,
89768406,
89768401,
89768405,
89768404,
89768403,
89768402,
89768407,
89768408,
89768409,
89768410,
89768411,
89768412,
89768413,

];

export function IconCloudDemo() {
  const images = slugs.map(
    (slug) => `https://avatars.githubusercontent.com/u/${slug}`,
  );

  return (
    <div className="relative flex size-full items-center justify-center overflow-hidden">
      <IconCloud images={images} />
    </div>
  );
}
