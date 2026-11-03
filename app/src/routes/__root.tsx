import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { ArrowUpRight, Moon, Sun } from "lucide-react";
import appCss from "../styles.css?url";
import appMetaJson from "../app-meta.json";

declare const __HF_DESIGN_INSPECTOR__: boolean;

type AppMeta = {
  og_title?: string | null;
  og_description?: string | null;
  og_image_url?: string | null;
  favicon_url?: string | null;
  theme_color?: string | null;
  og_video_url?: string | null;
};
const appMeta = appMetaJson as AppMeta;
function buildHead(meta: AppMeta) {
  const title = meta.og_title || "Adversix Tech | Creative Technology Studio";
  const description = meta.og_description || "Digital strategy, software engineering, web experiences and automation, brought together in one creative technology studio.";
  const image = meta.og_image_url || "/og.png";
  const favicon = meta.favicon_url || "/favicon.svg";
  return {
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title },
      { name: "description", content: description },
      { name: "author", content: "Adversix Tech" },
      { name: "theme-color", content: meta.theme_color || "saddlebrown" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://adversix-tech.higgsfield.app/" },
      { property: "og:image", content: image },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: image },
      ...(meta.og_video_url ? [{ property: "og:video", content: meta.og_video_url }] : []),
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: favicon, type: "image/png", sizes: "512x512" },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "icon", href: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { rel: "icon", href: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/site.webmanifest" },
      { rel: "canonical", href: "https://adversix-tech.higgsfield.app/" },
    ],
  };
}

function NotFoundComponent() {
  return <main className="not-found"><p>404</p><h1>This page is not here.</h1><a href="/">Return home <ArrowUpRight className="ui-icon" size={15} aria-hidden="true" /></a></main>;
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  return <main className="not-found"><p>Something went wrong</p><h1>The page could not load.</h1><button type="button" onClick={() => { router.invalidate(); reset(); }}>Try again</button></main>;
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => buildHead(appMeta),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return <html lang="en"><head><HeadContent /></head><body>{children}<Scripts /></body></html>;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  useEffect(() => {
    const saved = window.localStorage.getItem("adversix-theme");
    const next = saved === "dark" ? "dark" : "light";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
    const syncTheme = (event: StorageEvent) => {
      if (event.key !== "adversix-theme") return;
      const value = event.newValue === "dark" ? "dark" : "light";
      setTheme(value);
    };
    window.addEventListener("storage", syncTheme);
    return () => window.removeEventListener("storage", syncTheme);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem("adversix-theme", theme);
  }, [theme]);
  useEffect(() => {
    if (!__HF_DESIGN_INSPECTOR__) return;
    void import("../module/design-inspector/runtime").then(({ installHiggsfieldDesignInspector }) => installHiggsfieldDesignInspector()).catch((error) => console.error(error));
  }, []);
  return <QueryClientProvider client={queryClient}><Outlet /><button className="global-theme-toggle" type="button" onClick={() => setTheme((current) => current === "light" ? "dark" : "light")} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`} title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}><span aria-hidden="true">{theme === "light" ? <Moon className="ui-icon" size={16} strokeWidth={1.7} /> : <Sun className="ui-icon" size={16} strokeWidth={1.7} />}</span><span>{theme === "light" ? "Dark mode" : "Light mode"}</span></button></QueryClientProvider>;
}