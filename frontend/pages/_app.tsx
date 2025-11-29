import "../styles/globals.css";
import "./../styles/index.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "../src/hooks/useAuth";
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Analytics } from "@vercel/analytics/react";
import { usePathname } from "next/navigation";

const queryClient = new QueryClient();

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag: any;
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {};

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  useEffect(() => {
    checkRoute();
  }, [checkRoute]);

  function checkRoute() {
    const paths = ["/", "/inventory", "/dollys", "/help", "/profile"];
    if (!paths.includes(pathname)) {
      router.push("/");
    }
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Component {...pageProps} />
        <Analytics />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
