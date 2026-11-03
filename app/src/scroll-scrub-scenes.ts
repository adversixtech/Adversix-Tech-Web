import { createElement } from "react";
import { ArrowUpRight } from "lucide-react";
import type { ScrollScrubScene, ScrollScrubTheme } from "@/components/scroll-scrub/scroll-scrub";

export const scrollScrubTheme: ScrollScrubTheme = {
  accent: "#C87859",
  background: "#F5F0E8",
  ink: "#2C211D",
  muted: "#795B4A",
};

export const scrollScrubScenes: ScrollScrubScene[] = [
  {
    id: "precision-artifact",
    label: "Adversix Tech",
    poster: "/assets/world/scene-01-poster.png",
    mobilePoster: "/assets/world/scene-01-mobile-poster.png",
    clip: "/assets/world/scene-01.mp4",
    mobileClip: "/assets/world/scene-01-mobile.mp4",
    title: "Ideas, made real.",
    body: "Digital strategy, software engineering, web experiences and automation—brought together in one creative technology studio.",
    kicker: "",
    align: "left",
    scroll: 5.4,
    objectPosition: "center center",
    mobileObjectPosition: "center center",
    actions: createElement("a", { className: "hero-journey-link", href: "#work" }, "Explore our work ", createElement("span", { "aria-hidden": true }, createElement(ArrowUpRight, { size: 15, strokeWidth: 1.7 }))),
  },
];
